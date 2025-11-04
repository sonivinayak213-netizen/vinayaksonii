"use client";
import { useEffect, useState } from "react";

export default function OptionsDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
      const results = [];

      for (const sym of symbols) {
        const res = await fetch(`/api/optionchain?symbol=${sym}`);
        const json = await res.json();
        results.push(json);
      }

      setData(results);
      setLastUpdated(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      );
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Live Options Dashboard</h1>
        <button
          onClick={fetchData}
          className={`px-4 py-2 rounded-lg text-sm ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Refreshing..." : "Refresh Now 🔄"}
        </button>
      </div>

      <p className="text-gray-400 mb-6">
        Auto-refresh every 5 minutes · Last updated at {lastUpdated}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-lg">
          <thead className="bg-gray-800">
            <tr>
              <th className="py-3 px-4 text-left">Symbol</th>
              <th className="py-3 px-4 text-right">Total Call OI</th>
              <th className="py-3 px-4 text-right">Total Put OI</th>
              <th className="py-3 px-4 text-right">PCR</th>
              <th className="py-3 px-4 text-center">Trend</th>
              <th className="py-3 px-4 text-right">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="py-3 px-4 font-semibold">{item.symbol}</td>
                  <td className="py-3 px-4 text-right">
                    {item.totalCallOI?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.totalPutOI?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">{item.pcr}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        item.trend === "Bullish"
                          ? "bg-green-900 text-green-300"
                          : item.trend === "Bearish"
                          ? "bg-red-900 text-red-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {item.trend}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    {lastUpdated}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-400 italic"
                >
                  Loading live data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
