import { useState,useEffect  } from "react";
import API from "../services/api";

const ExpenseForm = ({ fetchExpenses, editingExpense, setEditingExpense }) => {
  const [formData, setFormData] = useState({
    amount: editingExpense?.amount || "",
    category: editingExpense?.category || "",
    notes: editingExpense?.notes || "",
  });

  useEffect(() => {
  if (editingExpense) {
    setFormData({
      amount: editingExpense.amount,
      category: editingExpense.category,
      notes: editingExpense.notes,
    });
  }
}, [editingExpense]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    if (editingExpense) {
      await API.put(
        `/expenses/${editingExpense._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingExpense(null);
    } else {
      await API.post("/expenses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    setFormData({
      amount: "",
      category: "",
      notes: "",
    });

    fetchExpenses();
  } catch (error) {
    console.log(error);
  }
};
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg p-6 rounded-xl mb-6"
    >
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded"
      />

      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded"
      />

      <button className="bg-black text-white px-6 py-3 rounded">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
