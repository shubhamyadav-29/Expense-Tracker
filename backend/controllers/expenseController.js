import Expense from "../models/Expense.js";

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