const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        "Identity",
        "Education",
        "Finance",
        "Medical",
        "Insurance",
        "Legal",
        "Government",
        "Academic",
        "Financial",
        "Other"
      ],
      default: "Other",
      index: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileKey: {
      type: String,
      required: true,
      unique: true
    },
    originalName: {
      type: String,
      default: ""
    },
    fileSizeBytes: {
      type: Number,
      default: 0
    },
    mimeType: {
      type: String,
      default: "application/octet-stream"
    },
    extractedMetadata: {
      issuer: { type: String, default: "" },
      identifierMasked: { type: String, default: "" },
      issueDate: { type: Date },
      expiryDate: { type: Date, index: true },
      rawOcrText: { type: String, default: "" },
      confidenceScore: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for global search
documentSchema.index({ title: "text", "extractedMetadata.issuer": "text" });

module.exports = mongoose.models.Document || mongoose.model("Document", documentSchema);
