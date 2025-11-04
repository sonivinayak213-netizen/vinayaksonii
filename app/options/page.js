'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState([]);

  // Dummy options data (simulate real-time update)
  const fetchData = () => {
    const sampleData = [
      {
        option: 'NIFTY 22500 CE',
        change: (Math.random() * 5 - 2.5).toFixed(2),
        pcr: (Math.random() * 1.5 + 0.5).toFixed(2),
      },
      {
        option: 'NIFTY 22500 PE',
        change: (Math.random() * 5 - 2.5).toFixed(2),
        pcr: (Math.random() * 1.5 + 0.5).toFixed(2),
      },
      {
        option: 'BANKNIFTY 48000 CE',
        change: (Math.random() * 5 - 2.5).toFixed(2),
        pcr: (Math.random() * 1.5 + 0.5).toFixed(2),
      },
    ];

    // Calculate trend based on PCR
    const updated = sampleData.map(item => ({
      ...item,
      trend:
        item.pcr > 1.0
          ? 'Bullish 🟢'
          : item.pcr < 0.8
          ? 'Bearish 🔴'
          : 'Neutral 🟡',
    }));

    setData(updated);
  };

  // Fetch data every 5 minutes
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Live Options Dashboard 📊
      </h2>

      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Option</th>
            <th className="py-3 px-4 text-left font-semibold">Change (%)</th>
            <th className="py-3 px-4 text-left font-semibold">PCR</th>
            <th className="py-3 px-4 text-left font-semibold">Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={idx}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">{item.option}</td>
              <td
                className={`py-3 px-4 ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {item.change}%
              </td>
              <td className="py-3 px-4">{item.pcr}</td>
              <td
                className={`py-3 px-4 ${
                  item.trend.includes('Bullish')
                    ? 'text-green-600'
                    : item.trend.includes('Bearish')
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}
              >
                {item.trend}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-center text-sm text-gray-500 mt-6">
        Auto-refresh every 5 minutes ⏱️ | Developed by @vinayaksonii
      </p>
    </main>
  );
}
