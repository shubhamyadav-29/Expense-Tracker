import API from "../services/api";

const ExpenseList = ({ expenses, fetchExpenses, setEditingExpense }) => {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense._id}
            className="border-b py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{expense.category}</p>

              <p className="text-gray-500">{expense.notes}</p>
              <p className="text-sm text-gray-400">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-bold">₹{expense.amount}</p>

              <button
                onClick={() => setEditingExpense(expense)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(expense._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
