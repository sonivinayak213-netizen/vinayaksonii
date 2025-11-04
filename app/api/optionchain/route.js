// app/api/optionchain/route.js
import fetch from 'node-fetch';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cache = { ts: 0, data: null };

async function fetchWithRetry(url, opts = {}, retries = 3, backoff = 500) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000); // 10s
      const res = await fetch(url, {
        ...opts,
        signal: controller.signal,
        headers: {
          // browser-like headers to reduce blocking
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'en-US,en;q=0.9',
          ...(opts.headers || {}),
        },
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, backoff * (i + 1)));
    }
  }
}

function computeFromOptionChain(raw, opts = {}) {
  // This fn assumes the structure contains records with fields
  // callOI / putOI OR some similar keys. Adapt to your API's shape.
  // We'll try to be defensive.
  const items = []; // will push {symbol, callOI, putOI, changePercent, ...}
  let totalCallOI = 0, totalPutOI = 0;

  // Example shapes: raw.records.data OR raw.filtered OR raw.optionChain
  const rows = raw?.records?.data || raw?.data || raw?.filtered || raw?.optionChain?.records || [];
  for (const r of rows) {
    // adapt to your JSON keys:
    const call = r.CE || r.call || r.callData || {};
    const put = r.PE || r.put || r.putData || {};

    const callOI = Number(call.openInterest ?? call.oi ?? 0);
    const putOI = Number(put.openInterest ?? put.oi ?? 0);
    const callChangePerc = Number(call.chgInOpenInterestPct ?? call.changePct ?? 0);
    const putChangePerc = Number(put.chgInOpenInterestPct ?? put.changePct ?? 0);

    totalCallOI += callOI;
    totalPutOI += putOI;

    items.push({
      strike: r.strikePrice ?? r.strike ?? (call.strikePrice || put.strikePrice) || null,
      callOI,
      putOI,
      callChangePerc,
      putChangePerc,
      callLastPrice: Number(call.lastPrice ?? 0),
      putLastPrice: Number(put.lastPrice ?? 0),
    });
  }

  const PCR = totalCallOI === 0 ? null : +(totalPutOI / totalCallOI).toFixed(2);
  // Simple signal rule: PCR > 1 => Bullish (more puts?), but often PCR interpretation varies.
  // We'll use a combined rule: if PCR > 1.1 => Bearish, <0.9 => Bullish, else Neutral
  let marketSentiment = 'Neutral';
  if (PCR !== null) {
    if (PCR > 1.1) marketSentiment = 'Bearish';
    else if (PCR < 0.9) marketSentiment = 'Bullish';
  }

  // Example top-of-book summary: pick ATM-ish strikes or aggregate top 3 diffs
  // We'll compute top 3 largest |put-call| diff
  const diffs = items.map(it => ({ ...it, diff: it.callOI - it.putOI }));
  diffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const topDiffs = diffs.slice(0, 5);

  return {
    generatedAt: new Date().toISOString(),
    totals: { totalCallOI, totalPutOI, PCR },
    marketSentiment,
    topDiffs,
    itemsSample: items.slice(0, 20), // small sample
    rawMeta: { rowsCount: items.length },
  };
}

export async function GET() {
  try {
    const now = Date.now();
    // return cache if fresh
    if (cache.data && now - cache.ts < CACHE_TTL) {
      return new Response(JSON.stringify({ ok: true, cached: true, ...cache.data }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // endpoint from env (so you can swap source easily)
    const url = process.env.OPTIONCHAIN_URL || 'https://your-optionchain-endpoint.example/api';
    const raw = await fetchWithRetry(url);

    const computed = computeFromOptionChain(raw);

    cache = { ts: now, data: computed };
    return new Response(JSON.stringify({ ok: true, cached: false, ...computed }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // fallback to cached data if exists
    if (cache.data) {
      return new Response(JSON.stringify({ ok: false, error: err.message, cached_fallback: true, ...cache.data }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
