require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Transaction = require("./models/Transaction");

const app = express();

/* ==============================
   MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/finwell";

/* ==============================
   BASIC ROUTES
================================ */

app.get("/", (req, res) => {
  res.json({
    message: "FinWell API is running",
    status: "ok"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

/* ==============================
   GET ALL TRANSACTIONS
================================ */

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    console.error(
      "Error fetching transactions:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
});

/* ==============================
   ADD TRANSACTION
================================ */

app.post("/api/transactions", async (req, res) => {
  try {
    const {
      name,
      category,
      amount,
      type
    } = req.body;

    if (
      !name ||
      !category ||
      amount === undefined ||
      !type
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0"
      });
    }

    if (
      type !== "income" &&
      type !== "expense"
    ) {
      return res.status(400).json({
        message:
          "Type must be income or expense"
      });
    }

    const transaction =
      await Transaction.create({
        name: name.trim(),
        category: category.trim(),
        amount: Number(amount),
        type
      });

    res.status(201).json(transaction);

  } catch (error) {
    console.error(
      "Error adding transaction:",
      error
    );

    res.status(500).json({
      message: "Failed to add transaction",
      error: error.message
    });
  }
});

/* ==============================
   DELETE TRANSACTION
================================ */

app.delete(
  "/api/transactions/:id",
  async (req, res) => {
    try {
      const transaction =
        await Transaction.findByIdAndDelete(
          req.params.id
        );

      if (!transaction) {
        return res.status(404).json({
          message:
            "Transaction not found"
        });
      }

      res.status(200).json({
        message:
          "Transaction deleted successfully"
      });

    } catch (error) {
      console.error(
        "Error deleting transaction:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete transaction",
        error: error.message
      });
    }
  }
);

/* ==============================
   DATABASE CONNECTION
================================ */

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `FinWell API running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });