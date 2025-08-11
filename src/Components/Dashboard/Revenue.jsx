import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const api = import.meta.env.VITE_BASE_URL;


const Revenue = () => {
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueTotals, setRevenueTotals] = useState({
    today: 0,
    week: 0,
    month: 0,
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${api}/api/revenue`, {
          withCredentials: true, // ✅ send cookies automatically
        });

        const formatted = res.data.chartData.map((item) => ({
          day: item.day,
          revenue: item.total,
          orders: item.count,
        }));

        setChartData(formatted);
        setSummary(formatted);
        setRevenueTotals({
          today: res.data.today,
          week: res.data.week,
          month: res.data.month,
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Revenue fetch failed:", err);
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);


  if (loading) return <p className="text-center text-gray-500">Loading revenue data...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📈 Revenue & Orders Report</h2>

      {/* Chart */}
      <div className="w-full h-[400px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" name="Revenue (₹)" fill="#4f46e5" />
            <Bar dataKey="orders" name="Orders" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Written Summary */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">🧾 Daily Summary:</h3>
        {summary.map((item) => (
          <p key={item.day} className="text-gray-700">
            On <span className="font-medium">{item.day}</span>, you earned{" "}
            <span className="text-green-600 font-semibold">₹{item.revenue}</span> from{" "}
            <span className="text-blue-600 font-semibold">{item.orders}</span> order{item.orders > 1 ? "s" : ""}.
          </p>
        ))}
      </div>

      {/* Overall Totals */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h4 className="font-bold mb-2">📊 Overall Summary:</h4>
        <p>🟢 Today’s Revenue: ₹{revenueTotals.today}</p>
        <p>🔵 This Week’s Revenue: ₹{revenueTotals.week}</p>
        <p>🟣 This Month’s Revenue: ₹{revenueTotals.month}</p>
      </div>
    </div>
  );
};

export default Revenue;
