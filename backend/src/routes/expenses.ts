import { Router } from "express";
import { parseExpense } from "../services/aiService";
import {
  createExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseById,
  updateExpense,
} from "../database";

const router = Router();

// PUT update expense
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = updateExpense(Number(id), updates);

    if (updated) {
      res.json({ success: true, expense: updated });
    } else {
      res.status(404).json({ success: false, error: "Expense not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update expense" });
  }
});

// GET all expenses
router.get("/", (req, res) => {
  try {
    const expenses = getAllExpenses();
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch expenses" });
  }
});

// POST new expense (AI parsed)
router.post("/", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res
        .status(400)
        .json({ success: false, error: "Input is required" });
    }

    // 1. Parse with AI
    const parsedData = await parseExpense(input);

    // 2. Save to DB
    const expense = createExpense({
      ...parsedData,
      original_input: input,
    });

    res.status(201).json({ success: true, expense });
  } catch (error: any) {
    console.error("Add Expense Error:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Could not parse expense",
    });
  }
});

// DELETE expense
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const result = deleteExpense(Number(id));

    if (result) {
      res.json({ success: true, message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ success: false, error: "Expense not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete expense" });
  }
});

export default router;
