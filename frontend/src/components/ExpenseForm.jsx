import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const ExpenseForm = ({
  fetchExpenses,
  editingExpense,
  setEditingExpense,
  categories,
  setCategories,
  darkMode,
}) => {

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    notes: "",
    date: "",
  });

  const [showCustomCategory, setShowCustomCategory] =
    useState(false);

  const [customCategory, setCustomCategory] =
    useState("");

  // populate form while editing
  useEffect(() => {

    if (editingExpense) {

      setShowCustomCategory(false);

      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        notes: editingExpense.notes,
        date: editingExpense.date?.split("T")[0],
      });

    }

  }, [editingExpense]);

  // handle inputs
  const handleChange = (e) => {

    const { name, value } = e.target;

    // custom category selected
    if (
      name === "category" &&
      value === "custom"
    ) {

      setShowCustomCategory(true);

      return;

    }

    // predefined category selected
    if (
      name === "category" &&
      value !== "custom"
    ) {

      setShowCustomCategory(false);

    }

    setFormData({
      ...formData,
      [name]: value,
    });

  };

  // add custom category
  const handleAddCustomCategory = () => {

    if (
      customCategory.trim().length < 2
    ) {
      toast.error(
        "Category name too short"
      );
      return;
    }

    // duplicate check
    const alreadyExists =
      categories.some(
        (cat) =>
          cat.toLowerCase() ===
          customCategory.toLowerCase()
      );

    if (alreadyExists) {

      toast.error(
        "Category already exists"
      );

      return;
    }

    // add category
    setCategories([
      ...categories,
      customCategory,
    ]);

    // select category
    setFormData({
      ...formData,
      category: customCategory,
    });

    toast.success(
      "Custom category added"
    );

    // reset
    setCustomCategory("");
    setShowCustomCategory(false);

  };

  // submit form
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      // update
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

        toast.success(
          "Expense updated successfully"
        );

        setEditingExpense(null);

      } else {

        // add
        await API.post(
          "/expenses",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Expense added successfully"
        );

      }

      // reset
      setFormData({
        amount: "",
        category: "Food",
        notes: "",
        date: "",
      });

      setShowCustomCategory(false);

      // refresh
      fetchExpenses();

    } catch (error) {

      console.log(error);

      toast.error(
        "Something went wrong"
      );

    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 rounded-xl shadow-lg mb-6 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
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
        className={`w-full border p-3 mb-4 rounded ${
          darkMode
            ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
        required
      />

      {/* category */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className={`w-full border p-3 mb-4 rounded ${
          darkMode
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      >

        {categories.map(
          (category, index) => (

            <option
              key={index}
              value={category}
              className="bg-gray-800 text-white"
            >

              {category}

            </option>

          )
        )}

        <option value="custom">

          + Add Custom Category

        </option>

      </select>

      {/* custom category */}
      {showCustomCategory && (

        <div className="flex gap-2 mb-4">

          <input
            type="text"
            placeholder="Enter category name"
            value={customCategory}
            onChange={(e) =>
              setCustomCategory(
                e.target.value
              )
            }
            className={`w-full border p-3 rounded ${
              darkMode
                ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                : "bg-white text-black placeholder-gray-500 border-gray-300"
            }`}
          />

          <button
            type="button"
            onClick={
              handleAddCustomCategory
            }
            className="bg-blue-500 text-white px-4 rounded"
          >

            Add

          </button>

        </div>

      )}

      {/* notes */}
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className={`w-full border p-3 mb-4 rounded ${
          darkMode
            ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      />

      {/* date */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className={`w-full border p-3 mb-4 rounded ${
          darkMode
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      />

      {/* buttons */}
      <div className="flex gap-4">

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-700 transition"
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

              setShowCustomCategory(false);

              setFormData({
                amount: "",
                category: "Food",
                notes: "",
                date: "",
              });

            }}
            className="bg-gray-400 text-black px-6 py-3 rounded hover:bg-gray-500 transition"
          >

            Cancel

          </button>

        )}

      </div>

    </form>
  );
};

export default ExpenseForm;