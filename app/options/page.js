"use client";
import { useEffect, useState } from "react";

export default function OptionsDashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
      const results = [];

      for (const sym of symbols) {
        const res = await fetch(`/api/optionchain?symbol=${sym}`);
        const json = await res.json();
        results.push(json);
      }

      setData(results);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load live data.");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Live Options Dashboard
      </h1>
      <p className="text-center mb-4 text-gray-400">
        Auto-refresh every 5 minutes
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
            {error ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-red-400">
                  {error}
                </td>
              </tr>
            ) : data.length > 0 ? (
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
                  <td
                    className={`py-3 px-4 text-center font-bold ${
                      item.trend === "Bullish"
                        ? "text-green-400"
                        : item.trend === "Bearish"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {item.trend}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    {new Date().toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
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
