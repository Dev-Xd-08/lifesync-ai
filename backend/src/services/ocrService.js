const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

const ocrService = {
  /**
   * Extract text from image or document file
   * @param {string} filePath - Absolute path to file on disk
   * @param {string} mimeType - File MIME type
   */
  async extractText(filePath, mimeType) {
    try {
      // If plain text file, read directly
      if (mimeType === "text/plain") {
        const text = fs.readFileSync(filePath, "utf-8");
        return {
          text: text.slice(0, 5000),
          confidence: 100
        };
      }

      // If image, run Tesseract OCR
      if (mimeType.startsWith("image/")) {
        console.log(`[OCR] Processing image with Tesseract: ${path.basename(filePath)}`);
        const { data } = await Tesseract.recognize(filePath, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text" && m.progress === 1) {
              console.log(`[OCR] Recognition finished: ${Math.round(m.progress * 100)}%`);
            }
          }
        });

        return {
          text: data.text || "",
          confidence: Math.round(data.confidence || 0)
        };
      }

      // For PDF or other formats, read sample text buffer if accessible
      const buffer = fs.readFileSync(filePath);
      const rawSample = buffer.toString("utf-8", 0, Math.min(buffer.length, 10000));
      const cleanTokens = rawSample
        .replace(/[^\x20-\x7E\n]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        text: cleanTokens.length > 50 ? cleanTokens.slice(0, 3000) : `Document uploaded: ${path.basename(filePath)}`,
        confidence: 85
      };
    } catch (err) {
      console.warn(`[OCR Warning] OCR processing encountered an issue: ${err.message}`);
      return {
        text: `File: ${path.basename(filePath)} (Processed without OCR)`,
        confidence: 70
      };
    }
  },

  /**
   * Heuristic regex parser to extract dates, IDs, and issuer from raw text
   */
  parseMetadataFromText(text, originalFileName = "") {
    const cleanText = text || "";
    
    // Heuristic 1: Detect Document Type
    let detectedCategory = "Other";
    const lower = cleanText.toLowerCase() + " " + originalFileName.toLowerCase();
    if (lower.includes("tax") || lower.includes("w-2") || lower.includes("1040") || lower.includes("invoice") || lower.includes("bank") || lower.includes("statement")) {
      detectedCategory = "Financial";
    } else if (lower.includes("passport") || lower.includes("license") || lower.includes("id card") || lower.includes("aadhaar") || lower.includes("visa")) {
      detectedCategory = "Government";
    } else if (lower.includes("hospital") || lower.includes("clinic") || lower.includes("prescription") || lower.includes("medical") || lower.includes("lab") || lower.includes("blood")) {
      detectedCategory = "Medical";
    } else if (lower.includes("degree") || lower.includes("diploma") || lower.includes("transcript") || lower.includes("certificate") || lower.includes("university")) {
      detectedCategory = "Academic";
    }

    // Heuristic 2: Expiry & Issue Dates (e.g. 2026-10-15, 10/15/2026, 15-10-2026)
    const dateMatches = cleanText.match(/\b(?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/g);
    let issueDate = null;
    let expiryDate = null;

    if (dateMatches && dateMatches.length > 0) {
      const parsedDates = dateMatches
        .map((d) => new Date(d))
        .filter((d) => !isNaN(d.getTime()));

      if (parsedDates.length >= 2) {
        parsedDates.sort((a, b) => a.getTime() - b.getTime());
        issueDate = parsedDates[0];
        expiryDate = parsedDates[parsedDates.length - 1];
      } else if (parsedDates.length === 1) {
        issueDate = parsedDates[0];
      }
    }

    // Heuristic 3: Issuer Detection
    let issuer = "Self-Issued / Private";
    if (lower.includes("internal revenue service") || lower.includes("irs")) issuer = "Internal Revenue Service";
    else if (lower.includes("department of motor vehicles") || lower.includes("dmv")) issuer = "State DMV";
    else if (lower.includes("hospital") || lower.includes("health") || lower.includes("clinic")) issuer = "Healthcare Provider";
    else if (lower.includes("bank") || lower.includes("chase") || lower.includes("wells fargo") || lower.includes("citi")) issuer = "Financial Institution";
    else if (lower.includes("university") || lower.includes("college") || lower.includes("school")) issuer = "Academic Board";

    // Heuristic 4: Identifier Masking (Redact sensitive identifier to XXXX-XXXX-1234)
    let identifierMasked = "SEC-DOC-" + Math.floor(1000 + Math.random() * 9000);
    const idMatch = cleanText.match(/\b([A-Z0-9]{3,5}[-\s]?[A-Z0-9]{3,5}[-\s]?[A-Z0-9]{3,5})\b/i);
    if (idMatch && idMatch[1]) {
      const raw = idMatch[1].replace(/[^A-Z0-9]/gi, "");
      if (raw.length >= 4) {
        identifierMasked = "XXXX-XXXX-" + raw.slice(-4).toUpperCase();
      }
    }

    return {
      category: detectedCategory,
      issuer,
      identifierMasked,
      issueDate,
      expiryDate,
      rawOcrText: cleanText.slice(0, 1500)
    };
  }
};

module.exports = ocrService;
