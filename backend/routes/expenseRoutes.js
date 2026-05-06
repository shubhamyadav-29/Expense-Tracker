import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
   getTotalExpense,
  categorySummary,
  monthlyExpenses,
} from "../controllers/expenseController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", authMiddleware, addExpense);

// READ
router.get("/", authMiddleware, getExpenses);

// UPDATE
router.put("/:id", authMiddleware, updateExpense);

// DELETE
router.delete("/:id", authMiddleware, deleteExpense);

// analytics routes
router.get("/total", authMiddleware, getTotalExpense);
router.get("/summary", authMiddleware, categorySummary);
router.get("/monthly", authMiddleware, monthlyExpenses);

export default router;