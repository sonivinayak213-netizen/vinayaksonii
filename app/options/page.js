// app/options/page.js
'use client';
import { useEffect, useState } from 'react';

function TrendBadge({ sentiment }) {
  const map = {
    Bullish: { label: 'Bullish', color: 'text-green-400' },
    Bearish: { label: 'Bearish', color: 'text-red-400' },
    Neutral: { label: 'Neutral', color: 'text-yellow-400' },
  };
  const s = map[sentiment] || map.Neutral;
  return <span className={`${s.color} font-semibold`}>{s.label} •</span>;
}

export default function OptionsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/optionchain');
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || 'No data');
      setData(j);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(id);
  }, []);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Live Options Dashboard</h1>

      <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <div className="text-slate-300">Auto-refresh every 5 minutes</div>
            <div className="text-sm text-slate-400">{data?.generatedAt ? `Updated: ${new Date(data.generatedAt).toLocaleString()}` : ''}</div>
          </div>
        </div>

        <div className="p-6">
          {loading && <div className="text-center text-slate-300">Loading...</div>}
          {error && <div className="text-center text-red-400">Error: {error}</div>}

          {!loading && !error && data && (
            <>
              <div className="grid grid-cols-4 gap-4 text-slate-300 font-semibold px-2 mb-2">
                <div>Option</div>
                <div className="text-center">Change (%)</div>
                <div className="text-center">PCR</div>
                <div className="text-center">Trend</div>
              </div>

              <div className="divide-y divide-slate-700">
                {data.itemsSample.map((it, idx) => {
                  // picked example values; adapt if keys differ
                  const change = (it.callChangePerc ?? it.putChangePerc ?? 0).toFixed(2);
                  const diff = it.callOI - it.putOI;
                  const trendColor = diff < 0 ? 'text-green-400' : diff > 0 ? 'text-red-400' : 'text-yellow-300';
                  return (
                    <div key={idx} className="py-6 px-4 flex items-center text-slate-200">
                      <div className="w-1/4">{it.strike ?? '—'}</div>
                      <div className="w-1/4 text-center">
                        <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>{(change >= 0 ? '+' : '') + change + '%'}</span>
                      </div>
                      <div className="w-1/4 text-center text-sky-300">
                        {data.totals?.PCR ?? '—'}
                      </div>
                      <div className="w-1/4 text-center">
                        <TrendBadge sentiment={data.marketSentiment} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 text-slate-400 text-sm">
                Totals — Call OI: <span className="text-slate-200">{data.totals.totalCallOI}</span> • Put OI: <span className="text-slate-200">{data.totals.totalPutOI}</span> • PCR: <span className="text-slate-200">{data.totals.PCR}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
