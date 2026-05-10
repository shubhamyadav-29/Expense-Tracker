import { useNavigate } from "react-router-dom";

const Navbar = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div
      className={`p-4 flex justify-between items-center shadow-lg ${
        darkMode ? "bg-[#0f172a] text-white" : "bg-black text-white"
      }`}
    >
      <h1 className="text-3xl font-bold">Expense Tracker</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
