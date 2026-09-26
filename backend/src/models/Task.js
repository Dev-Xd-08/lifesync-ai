const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
      default: ""
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      index: true
    },
    dueDate: {
      type: Date,
      index: true
    },
    category: {
      type: String,
      default: "General"
    },
    linkedResourceType: {
      type: String,
      enum: ["Document", "Expense", "HealthRecord", null],
      default: null
    },
    linkedResourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ userId: 1, dueDate: 1, status: 1 });

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
