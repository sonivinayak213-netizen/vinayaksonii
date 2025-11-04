// ===============================
// ✅ route.js (Final Fix for Vercel / Dynamic Fetch)
// ===============================

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "NIFTY";

  try {
    const res = await axios.get(
      `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.nseindia.com/",
        },
        withCredentials: true,
      }
    );

    const records =
      res.data?.records?.data ||
      res.data?.filtered?.data ||
      res.data?.data ||
      [];

    const ceOi = res.data?.records?.CE?.totOI || 0;
    const peOi = res.data?.records?.PE?.totOI || 0;
    const pcr = peOi && ceOi ? (peOi / ceOi).toFixed(2) : null;

    return Response.json({
      symbol,
      pcr,
      totalCallOi: ceOi,
      totalPutOi: peOi,
      records,
      updatedAt: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    console.error("⚠️ NSE API fetch error:", error.message);
    return Response.json(
      { error: "Failed to fetch data from NSE", details: error.message },
      { status: 500 }
    );
  }
}
