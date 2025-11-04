"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const res = await fetch(`/api/optionchain?symbol=${symbol}`);
          return res.json();
        })
      );
      setData(results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // auto-refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-300">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">Live Options Dashboard</h1>
      <p className="text-center text-gray-400 mb-6">Auto-refresh every 5 minutes</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Total Call OI</th>
              <th className="px-6 py-3">Total Put OI</th>
              <th className="px-6 py-3">PCR</th>
              <th className="px-6 py-3">Trend</th>
              <th className="px-6 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="px-6 py-3 font-semibold">{item.symbol}</td>
                <td className="px-6 py-3">{item.totalCallOI.toLocaleString()}</td>
                <td className="px-6 py-3">{item.totalPutOI.toLocaleString()}</td>
                <td className="px-6 py-3">{item.pcr}</td>
                <td
                  className={`px-6 py-3 font-bold ${
                    item.trend === "Bullish" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.trend}
                </td>
                <td className="px-6 py-3">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
