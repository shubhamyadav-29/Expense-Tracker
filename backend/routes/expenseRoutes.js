import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
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

export default router;