const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const env = require("../config/env");

// Ensure upload directory exists
if (!fs.existsSync(env.uploadDir)) {
  fs.mkdirSync(env.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, env.uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueKey = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueKey);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow PDFs, images, docs
  const allowedMimes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Please upload a PDF, PNG, JPG, or TXT file."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: env.maxFileSizeMB * 1024 * 1024 // e.g. 15MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
