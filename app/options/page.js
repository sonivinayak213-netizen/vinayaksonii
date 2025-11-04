'use client';
import { useEffect, useState } from 'react';

export default function OptionsPage() {
  const [data, setData] = useState([]);

  // Function to simulate fetching option data
  const fetchData = () => {
    const sampleData = [
      {
        index: 'NIFTY',
        callOI: Math.floor(Math.random() * 100000),
        putOI: Math.floor(Math.random() * 100000),
      },
      {
        index: 'BANKNIFTY',
        callOI: Math.floor(Math.random() * 100000),
        putOI: Math.floor(Math.random() * 100000),
      },
    ];

    const withPCR = sampleData.map((item) => {
      const pcr = (item.putOI / item.callOI).toFixed(2);
      const sentiment = pcr > 1 ? 'Bullish 🟢' : 'Bearish 🔴';
      return { ...item, pcr, sentiment };
    });

    setData(withPCR);
  };

  // Fetch on load + every 5 minutes
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Options & PCR Overview</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase">
            <tr>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Call OI</th>
              <th className="px-4 py-3">Put OI</th>
              <th className="px-4 py-3">PCR</th>
              <th className="px-4 py-3">Sentiment</th>
              <th className="px-4 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-4 py-3 font-semibold">{row.index}</td>
                <td className="px-4 py-3">{row.callOI.toLocaleString()}</td>
                <td className="px-4 py-3">{row.putOI.toLocaleString()}</td>
                <td className="px-4 py-3">{row.pcr}</td>
                <td className="px-4 py-3 font-medium">{row.sentiment}</td>
                <td className="p
