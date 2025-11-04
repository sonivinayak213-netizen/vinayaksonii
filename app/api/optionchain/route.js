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

    let totalCallOI = 0;
    let totalPutOI = 0;

    for (const item of records) {
      if (item.CE?.openInterest) totalCallOI += item.CE.openInterest;
      if (item.PE?.openInterest) totalPutOI += item.PE.openInterest;
    }

    const pcr = totalPutOI / totalCallOI;
    let trend = "Neutral";
    if (pcr > 1.3) trend = "Bullish";
    else if (pcr < 0.7) trend = "Bearish";

    return Response.json({
      symbol,
      totalCallOI,
      totalPutOI,
      pcr: pcr.toFixed(2),
      trend,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
