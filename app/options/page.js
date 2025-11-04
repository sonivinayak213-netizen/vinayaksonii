'use client';
import { useEffect, useState } from 'react';

function fmt(n) {
  if (n == null) return '-';
  // format with commas and up to 3 decimals
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export default function OptionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/optionchain'); // server route
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Fetch failed');
      setRows(json.data ?? []);
    } catch (e) {
      setError(String(e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Live Options Dashboard</h1>

      <p className="text-center text-gray-400 mb-6">Auto-refresh every 5 minutes</p>

      <div className="max-w-5xl mx-auto bg-slate-800 rounded-lg shadow p-4">
        {loading && <div className="text-center text-gray-300 py-8">Loading...</div>}

        {error && <div className="text-red-400 text-center py-6">Error: {error}</div>}

        {!loading && !error && rows.length === 0 && (
          <div className="text-center text-gray-400 py-8">No data</div>
        )}

        {!loading && !error && rows.length > 0 && (
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="text-sm text-gray-300 border-b border-slate-700">
                <th className="py-4 px-6">Symbol</th>
                <th className="py-4 px-6">Total Call OI</th>
                <th className="py-4 px-6">Total Put OI</th>
                <th className="py-4 px-6">PCR</th>
                <th className="py-4 px-6">Trend</th>
                <th className="py-4 px-6">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-slate-700">
                  <td className="py-4 px-6 font-semibold text-white">{r.symbol}</td>
                  <td className="py-4 px-6 text-gray-200">{fmt(r.totalCallOI)}</td>
                  <td className="py-4 px-6 text-gray-200">{fmt(r.totalPutOI)}</td>
                  <td className="py-4 px-6 text-gray-200">{r.pcr ?? '-'}</td>
                  <td className="py-4 px-6">
                    <span className={
                      r.trend === 'Bullish' ? 'text-green-400 font-semibold' :
                      r.trend === 'Bearish' ? 'text-rose-400 font-semibold' :
                      'text-amber-300 font-semibold'
                    }>
                      {r.trend}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    {r.lastUpdated ? new Date(r.lastUpdated).toLocaleTimeString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
