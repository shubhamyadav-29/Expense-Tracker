import { useState, useEffect } from "react";
import API from "../services/api";

const ExpenseForm = ({
  fetchExpenses,
  editingExpense,
  setEditingExpense,
  categories,
}) => {

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    notes: "",
    date: "",
  });

  // populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        notes: editingExpense.notes,
        date: editingExpense.date?.split("T")[0],
      });
    }
  }, [editingExpense]);

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // edit expense
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

        // add expense
        await API.post("/expenses", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      }

      // reset form
      setFormData({
        amount: "",
        category: "Food",
        notes: "",
        date: "",
      });

      // refresh dashboard
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

      {/* title */}
      <h2 className="text-2xl font-bold mb-4">
        {editingExpense
          ? "Edit Expense"
          : "Add Expense"}
      </h2>

      {/* amount */}
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded"
        required
      />

      {/* category dropdown */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded"
      >

        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}

      </select>

      {/* notes */}
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded"
      />

      {/* date */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full border p-3 mb-4 rounded"
      />

      {/* buttons */}
      <div className="flex gap-4">

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          {editingExpense
            ? "Update Expense"
            : "Add Expense"}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={() => {
              setEditingExpense(null);

              setFormData({
                amount: "",
                category: "Food",
                notes: "",
                date: "",
              });
            }}
            className="bg-gray-300 px-6 py-3 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  );
};

export default ExpenseForm;