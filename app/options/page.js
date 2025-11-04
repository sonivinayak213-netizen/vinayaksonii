'use client';
import { useEffect, useState } from 'react';

export default function OptionsPage() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    const sampleData = [
      { option: 'NIFTY', change: (Math.random() * 2 - 1).toFixed(2) },
      { option: 'BANKNIFTY', change: (Math.random() * 2 - 1).toFixed(2) },
      { option: 'FINNIFTY', change: (Math.random() * 2 - 1).toFixed(2) },
    ];

    const withDetails = sampleData.map((item) => {
      const pcr = (Math.random() * 2).toFixed(2);
      const trend =
        pcr > 1.2
          ? { label: 'Bullish 🟢', color: 'text-green-400' }
          : pcr < 0.8
          ? { label: 'Bearish 🔴', color: 'text-red-400' }
          : { label: 'Neutral 🟡', color: 'text-yellow-400' };
      return { ...item, pcr, trend };
    });

    setData(withDetails);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0f1623] text-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Live Options Dashboard 📊
      </h1>

      <div className="w-full max-w-4xl bg-[#1a2333] rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#232c3e] text-gray-200 text-sm uppercase">
              <th className="px-6 py-4">Option</th>
              <th className="px-6 py-4">Change (%)</th>
              <th className="px-6 py-4">PCR</th>
              <th className="px-6 py-4">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-700 hover:bg-[#283249] transition"
              >
                <td className="px-6 py-4 font-medium text-white">{row.option}</td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    row.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {row.change}%
                </td>
                <td className="px-6 py-4 text-blue-400">{row.pcr}</td>
                <td className={`px-6 py-4 font-semibold ${row.trend.color}`}>
                  {row.trend.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-400 mt-6 text-sm">
        Auto-refresh every 5 minutes ⏱ | Developed by{' '}
        <span className="text-blue-400">@vinayaksonii</span>
      </p>
    </main>
  );
}
