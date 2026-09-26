const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
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
    recordType: {
      type: String,
      enum: [
        "Blood Test",
        "Prescription",
        "Medical Report",
        "Vaccination",
        "Vaccine",
        "Lab Report",
        "Vitals",
        "Consultation",
        "Invoice",
        "Other"
      ],
      default: "Vitals",
      index: true
    },
    recordDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    fileUrl: {
      type: String,
      default: ""
    },
    aiSummary: {
      type: String,
      default: ""
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    vitals: {
      systolic: { type: Number },
      diastolic: { type: Number },
      heartRate: { type: Number },
      bloodGlucose: { type: Number },
      weightKg: { type: Number }
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

healthRecordSchema.index({ userId: 1, recordDate: -1 });

module.exports = mongoose.models.HealthRecord || mongoose.model("HealthRecord", healthRecordSchema);
