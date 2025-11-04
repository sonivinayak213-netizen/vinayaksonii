export const dynamic = 'force-dynamic';
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
      }
    );

    const records = res.data?.records?.data;
    if (!records || records.length === 0) {
      return Response.json({ error: "No data" }, { status: 500 });
    }

    // Calculate Total Call & Put OI
    const totalCallOI = records.reduce((sum, item) => sum + (item?.CE?.openInterest || 0), 0);
    const totalPutOI = records.reduce((sum, item) => sum + (item?.PE?.openInterest || 0), 0);
    const pcr = (totalPutOI / totalCallOI).toFixed(2);
    const trend = pcr > 1 ? "Bullish" : "Bearish";

    return Response.json({
      symbol,
      totalCallOI,
      totalPutOI,
      pcr,
      trend,
      lastUpdated: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
