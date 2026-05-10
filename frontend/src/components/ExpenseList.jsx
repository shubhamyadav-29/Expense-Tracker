import API from "../services/api";
import toast from "react-hot-toast";

const ExpenseList = ({
  expenses,
  fetchExpenses,
  setEditingExpense,
  darkMode,
}) => {

  const handleDelete = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await API.delete(
        `/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Expense deleted successfully"
      );

      fetchExpenses();

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to delete expense"
      );

    }
  };

  return (

    <div
      className={`shadow-lg p-6 rounded-xl ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
      }`}
    >

      <h2 className="text-2xl font-bold mb-4">

        Expenses

      </h2>

      {expenses.length === 0 ? (

        <p>No expenses found</p>

      ) : (

        expenses.map((expense) => (

          <div
            key={expense._id}
            className={`border-b py-5 ${
              darkMode
                ? "border-gray-700"
                : "border-gray-200"
            }`}
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              {/* left */}
              <div className="flex-1">

                <p className="font-semibold text-lg">

                  {expense.category}

                </p>

                <p
                  className={`break-words ${
                    darkMode
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >

                  {expense.notes}

                </p>

                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-400"
                  }`}
                >

                  {new Date(
                    expense.date
                  ).toLocaleDateString()}

                </p>

              </div>

              {/* right */}
              <div className="flex flex-wrap items-center gap-3">

                <p className="font-bold text-lg">

                  ₹{expense.amount}

                </p>

                <button
                  onClick={() =>
                    setEditingExpense(expense)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >

                  Edit

                </button>

                <button
                  onClick={() =>
                    handleDelete(expense._id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >

                  Delete

                </button>

              </div>

            </div>

          </div>

        ))
      )}

    </div>

  );
};

export default ExpenseList;