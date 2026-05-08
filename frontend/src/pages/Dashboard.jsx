import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Charts from "../components/Charts";

const Dashboard = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);

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

  const refreshDashboard = async () => {
  await fetchExpenses();
  await fetchAnalytics();
};

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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-gray-500">Total Expense</h2>

            <p className="text-3xl font-bold mt-2">₹{totalExpense}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-gray-500">Transactions</h2>

            <p className="text-3xl font-bold mt-2">{expenses.length}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-gray-500">Top Category</h2>

            <p className="text-3xl font-bold mt-2">
              {summaryData[0]?._id || "N/A"}
            </p>
          </div>
        </div>

        <Charts summaryData={summaryData} monthlyData={monthlyData} />
        <ExpenseForm
         fetchExpenses={refreshDashboard}
          editingExpense={editingExpense}
          setEditingExpense={setEditingExpense}
        />
        <ExpenseList
          expenses={expenses}
          fetchExpenses={fetchExpenses}
          setEditingExpense={setEditingExpense}
        />
      </div>
    </div>
  );
};

export default Dashboard;
