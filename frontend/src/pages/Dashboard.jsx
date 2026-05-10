import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Charts from "../components/Charts";

const Dashboard = () => {
  const navigate = useNavigate();

  // dark mode
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

  // expenses state
  const [expenses, setExpenses] = useState([]);

  // analytics state
  const [summaryData, setSummaryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  // edit state
  const [editingExpense, setEditingExpense] = useState(null);

  // filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // categories state
  const [categories, setCategories] = useState([
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
  ]);

  // save theme
  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // fetch expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(res.data);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  // fetch analytics
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const summaryRes = await API.get("/expenses/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const monthlyRes = await API.get("/expenses/monthly", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const totalRes = await API.get("/expenses/total", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummaryData(summaryRes.data);
      setMonthlyData(monthlyRes.data);
      setTotalExpense(totalRes.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  // refresh dashboard
  const refreshDashboard = async () => {
    await fetchExpenses();
    await fetchAnalytics();
  };

  // filter logic
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.notes
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || expense.category === selectedCategory;

    const matchesMonth =
      selectedMonth === "" ||
      new Date(expense.date).getMonth() + 1 === Number(selectedMonth);

    return matchesSearch && matchesCategory && matchesMonth;
  });

  // auth check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchExpenses();
      fetchAnalytics();
    }
  }, []);

  return (
    <div
      className={`min-h-screen transition duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Navbar darkMode={darkMode} />

      {/* dark mode toggle */}
      <div className="max-w-6xl mx-auto pt-6 px-6 flex justify-end">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg shadow transition ${
            darkMode ? "bg-yellow-400 text-black" : "bg-black text-white"
          }`}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* FILTERS */}
        <div
          className={`p-6 rounded-xl shadow-lg mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Search & Filters</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* search */}
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`border p-3 rounded ${
                darkMode
                  ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            />

            {/* category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`border p-3 rounded ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="">All Categories</option>

              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* month filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`border p-3 rounded ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="">All Months</option>

              <option value="1">January</option>

              <option value="2">February</option>

              <option value="3">March</option>

              <option value="4">April</option>

              <option value="5">May</option>

              <option value="6">June</option>

              <option value="7">July</option>

              <option value="8">August</option>

              <option value="9">September</option>

              <option value="10">October</option>

              <option value="11">November</option>

              <option value="12">December</option>
            </select>
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div
            className={`p-6 rounded-xl shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-gray-500">Total Expense</h2>

            <p className="text-3xl font-bold mt-2">₹{totalExpense}</p>
          </div>

          <div
            className={`p-6 rounded-xl shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-gray-500">Transactions</h2>

            <p className="text-3xl font-bold mt-2">{filteredExpenses.length}</p>
          </div>

          <div
            className={`p-6 rounded-xl shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-gray-500">Top Category</h2>

            <p className="text-3xl font-bold mt-2">
              {summaryData[0]?._id || "N/A"}
            </p>
          </div>
        </div>

        {/* CHARTS */}
        <Charts
          summaryData={summaryData}
          monthlyData={monthlyData}
          darkMode={darkMode}
        />

        {/* FORM */}
        <ExpenseForm
          fetchExpenses={refreshDashboard}
          editingExpense={editingExpense}
          setEditingExpense={setEditingExpense}
          categories={categories}
          setCategories={setCategories}
          darkMode={darkMode}
        />

        {/* EXPENSE LIST */}
        <ExpenseList
          expenses={filteredExpenses}
          fetchExpenses={refreshDashboard}
          setEditingExpense={setEditingExpense}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default Dashboard;
