export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "NIFTY").toUpperCase();

  const target = `https://www.nseindia.com/api/option-chain-indices?symbol=${encodeURIComponent(symbol)}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; VinayakTrader/1.0)",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.nseindia.com/",
    "Accept-Language": "en-US,en;q=0.9"
  };

  try {
    const res = await fetch(target, { headers, cache: "no-store" });
    if (!res.ok) {
      // fallback note for proxy:
      return new Response(JSON.stringify({ error: `NSE fetch failed: ${res.status}` }), { status: 502 });
    }
    const json = await res.json();
    const rows = json?.records?.data ?? json?.filtered?.data ?? [];
    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "No option-chain rows" }), { status: 502 });
    }

    let totalCallOI = 0;
    let totalPutOI = 0;
    for (const r of rows) {
      const ce = r.CE ?? r.ce ?? r.call ?? {};
      const pe = r.PE ?? r.pe ?? r.put ?? {};
      const callOI = Number(ce.openInterest ?? ce.totalOpenInterest ?? ce.oi ?? 0) || 0;
      const putOI = Number(pe.openInterest ?? pe.totalOpenInterest ?? pe.oi ?? 0) || 0;
      totalCallOI += callOI;
      totalPutOI += putOI;
    }

    const pcr = totalCallOI === 0 ? null : +(totalPutOI / totalCallOI).toFixed(2);
    const trend = pcr === null ? "Unknown" : pcr > 1 ? "Bullish" : "Bearish";

    return new Response(JSON.stringify({
      symbol,
      totalCallOI,
      totalPutOI,
      pcr,
      trend,
      rowsCount: rows.length,
      timestamp: new Date().toISOString()
    }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
