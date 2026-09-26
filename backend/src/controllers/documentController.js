const path = require("path");
const fs = require("fs");
const DataStore = require("../database/store");
const ocrService = require("../services/ocrService");
const env = require("../config/env");

const documentController = {
  // GET /api/v1/documents
  async getDocuments(req, res, next) {
    try {
      const { category, search } = req.query;
      const docs = await DataStore.documents.findByUser(req.user.id, { category, search });
      res.json({
        success: true,
        count: docs.length,
        documents: docs
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/documents (multipart)
  async uploadDocument(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file provided for upload."
        });
      }

      const filePath = req.file.path;
      const originalName = req.file.originalname;
      const mimeType = req.file.mimetype;
      const fileSizeBytes = req.file.size;
      const fileKey = req.file.filename;

      // Run OCR & heuristics extraction
      const ocrResult = await ocrService.extractText(filePath, mimeType);
      const parsedMetadata = ocrService.parseMetadataFromText(ocrResult.text, originalName);

      // Title defaults to request body title, or sanitized original filename
      const title = req.body.title && req.body.title.trim()
        ? req.body.title.trim()
        : originalName.replace(/\.[^/.]+$/, "");

      const category = req.body.category || parsedMetadata.category || "Other";

      const docRecord = await DataStore.documents.create({
        userId: req.user.id,
        title,
        category,
        fileUrl: `/api/v1/documents/placeholder`, // updated after ID generated
        fileKey,
        originalName,
        fileSizeBytes,
        mimeType,
        extractedMetadata: {
          issuer: parsedMetadata.issuer,
          identifierMasked: parsedMetadata.identifierMasked,
          issueDate: parsedMetadata.issueDate,
          expiryDate: parsedMetadata.expiryDate,
          rawOcrText: parsedMetadata.rawOcrText,
          confidenceScore: ocrResult.confidence
        }
      });

      // Update download link
      docRecord.fileUrl = `/api/v1/documents/${docRecord._id}/download`;

      res.status(201).json({
        success: true,
        message: "Document uploaded and OCR metadata extracted successfully.",
        document: docRecord
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/documents/:id/download
  async downloadDocument(req, res, next) {
    try {
      const doc = await DataStore.documents.findById(req.params.id, req.user.id);
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: "Document not found or access denied."
        });
      }

      const filePath = path.join(env.uploadDir, doc.fileKey);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: "Physical file is missing from the server vault."
        });
      }

      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(doc.originalName || doc.title)}"`);
      res.setHeader("Content-Type", doc.mimeType || "application/octet-stream");

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/v1/documents/:id
  async deleteDocument(req, res, next) {
    try {
      const doc = await DataStore.documents.findById(req.params.id, req.user.id);
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: "Document not found or access denied."
        });
      }

      // Delete database record
      await DataStore.documents.delete(req.params.id, req.user.id);

      // Clean up physical file
      const filePath = path.join(env.uploadDir, doc.fileKey);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.warn("Failed to unlink deleted file:", err.message);
        });
      }

      res.json({
        success: true,
        message: "Document securely deleted from vault."
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = documentController;
