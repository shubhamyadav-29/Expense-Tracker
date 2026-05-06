import Expense from "../models/Expense.js";
import mongoose from "mongoose";

// Add Expense
export const addExpense = async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;

    const expense = new Expense({
      user: req.user.id,
      amount,
      category,
      date,
      notes,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    // check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: "Expense not found" });

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await expense.deleteOne();

    res.json({ msg: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTotalExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({ total });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const categorySummary = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      {
       $match: { user: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const monthlyExpenses = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      {
       $match: { user: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};