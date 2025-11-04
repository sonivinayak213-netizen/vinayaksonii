// ===============================
// ✅ route.js (Final Working Version)
// ===============================

export const dynamic = "force-dynamic";
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
          Connection: "keep-alive",
        },
        withCredentials: true,
      }
    );

    // ✅ NSE API ka response structure kabhi-kabhi change hota hai
    const records =
      res.data?.records?.data ||
      res.data?.filtered?.data ||
      res.data?.data ||
      [];

    // Debug log (optional)
    console.log("Fetched records count:", records.length);

    if (!records || records.length === 0) {
      return Response.json({ error: "No data received from NSE" }, { status: 500 });
    }

    // ✅ PCR aur other useful fields extract karne ke liye example
    const ceOi = res.data?.records?.CE?.totOI || 0;
    const peOi = res.data?.records?.PE?.totOI || 0;
    const pcr = peOi && ceOi ? (peOi / ceOi).toFixed(2) : null;

    return Response.json({
      symbol,
      pcr,
      records,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("⚠️ NSE API fetch error:", error.message);
    return Response.json(
      { error: "Failed to fetch option chain", details: error.message },
      { status: 500 }
    );
  }
}
