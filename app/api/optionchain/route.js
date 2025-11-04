// app/api/optionchain/route.js
export const dynamic = 'force-dynamic'; // runtime fetch allowed (no static)
const DEFAULT_SYMBOLS = ["NIFTY", "BANKNIFTY", "FINNIFTY"]; // change as needed

// helper to safely get numeric OI from various shapes
function getOI(obj) {
  if (!obj) return 0;
  // common NSE keys: openInterest, openInterestOI, oi
  return Number(obj.openInterest ?? obj.oi ?? obj.OI ?? 0) || 0;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("symbols"); // optional: comma separated symbols
    const symbols = q ? q.split(",").map(s => s.trim().toUpperCase()) : DEFAULT_SYMBOLS;

    const results = [];
    const headers = {
      // try to mimic a browser (sometimes required for nse)
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.nseindia.com/",
    };

    for (const symbol of symbols) {
      const target = `https://www.nseindia.com/api/option-chain-indices?symbol=${encodeURIComponent(symbol)}`;
      // fetch with moderate revalidation so front can show near-live (5 minutes)
      const resp = await fetch(target, { headers, next: { revalidate: 300 } });

      if (!resp.ok) {
        results.push({
          symbol,
          error: `Fetch failed: ${resp.status} ${resp.statusText}`,
        });
        continue;
      }

      const data = await resp.json().catch(() => null);
      const records = data?.records?.data ?? data?.filtered?.data ?? [];

      if (!Array.isArray(records) || records.length === 0) {
        results.push({ symbol, error: "No data", recordsCount: records.length });
        continue;
      }

      let totalCallOI = 0;
      let totalPutOI = 0;
      let lastUpdated = new Date().toISOString();

      for (const r of records) {
        // NSE uses keys 'CE' and 'PE' for call and put in many payloads
        const call = r.CE ?? r.call ?? r.ce ?? null;
        const put = r.PE ?? r.put ?? r.pe ?? null;

        const callOI = getOI(call);
        const putOI = getOI(put);

        totalCallOI += callOI;
        totalPutOI += putOI;
      }

      // PCR (Put/Call) safe calculation
      const pcr = totalCallOI > 0 ? +(totalPutOI / totalCallOI).toFixed(2) : null;

      // Simple trend rule:
      // pcr > 1 => Bullish (more puts than calls), pcr < 0.9 => Bearish, else Neutral
      let trend = "Neutral";
      if (pcr !== null) {
        if (pcr > 1.05) trend = "Bullish";
        else if (pcr < 0.95) trend = "Bearish";
        else trend = "Neutral";
      }

      results.push({
        symbol,
        totalCallOI: Number(totalCallOI.toFixed(3)),
        totalPutOI: Number(totalPutOI.toFixed(3)),
        pcr,
        trend,
        lastUpdated,
        recordsCount: records.length,
      });
    }

    return new Response(JSON.stringify({ data: results }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("optionchain API error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
