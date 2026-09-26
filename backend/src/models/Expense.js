const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      default: "expense",
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "General",
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than zero"]
    },
    currency: {
      type: String,
      default: "USD"
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Compound index for user query by date
expenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
