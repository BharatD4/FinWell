const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

module.exports = Transaction;