// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const Charts = ({ summaryData, monthlyData }) => {
//   return (
//     <div className="grid md:grid-cols-2 gap-6 mb-6">
//       {/* Pie Chart */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Category Spending</h2>

//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
            
//               data={summaryData}
//               dataKey="total"
//               nameKey="_id"
//               outerRadius={100}
//               label
//             >
//               {summaryData.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>

//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Line Chart */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>

//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={monthlyData}>
//             <CartesianGrid strokeDasharray="3 3" />

//             <XAxis
//               dataKey="_id"
//               tickFormatter={(month) => {
//                 const months = [
//                   "",
//                   "Jan",
//                   "Feb",
//                   "Mar",
//                   "Apr",
//                   "May",
//                   "Jun",
//                   "Jul",
//                   "Aug",
//                   "Sep",
//                   "Oct",
//                   "Nov",
//                   "Dec",
//                 ];

//                 return months[month];
//               }}
//             />

//             <YAxis />

//             <Tooltip />

//             <Line
//               type="monotone"
//               dataKey="total"
//               stroke="#8884d8"
//               strokeWidth={3}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Charts;

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const Charts = ({
  summaryData,
  monthlyData,
  darkMode,
}) => {

  const monthlyChartData =
    monthlyData.map((item) => ({
      month: new Date(
        2025,
        item._id - 1
      ).toLocaleString("default", {
        month: "short",
      }),
      total: item.total,
    }));

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">

      {/* PIE CHART */}
      <div
        className={`p-6 rounded-xl shadow-lg ${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        }`}
      >

        <h2 className="text-2xl font-bold mb-4">
          Category Spending
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={summaryData}
              dataKey="total"
              nameKey="_id"
              outerRadius={100}
              label
            >

              {summaryData.map(
                (entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* LINE CHART */}
      <div
        className={`p-6 rounded-xl shadow-lg ${
          darkMode
            ? "bg-gray-800"
            : "bg-white"
        }`}
      >

        <h2 className="text-2xl font-bold mb-4">
          Monthly Expenses
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart
            data={monthlyChartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={
                darkMode
                  ? "#555"
                  : "#ccc"
              }
            />

            <XAxis
              dataKey="month"
              stroke={
                darkMode
                  ? "#fff"
                  : "#000"
              }
            />

            <YAxis
              stroke={
                darkMode
                  ? "#fff"
                  : "#000"
              }
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default Charts;