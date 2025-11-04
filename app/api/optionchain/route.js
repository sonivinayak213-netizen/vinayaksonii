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

    let totalCE = 0,
      totalPE = 0;

    for (const item of records) {
      if (item.CE) totalCE += item.CE.openInterest || 0;
      if (item.PE) totalPE += item.PE.openInterest || 0;
    }

    const pcr = (totalPE / totalCE).toFixed(2);
    const trend =
      pcr > 1.3 ? "Bullish" : pcr < 0.7 ? "Bearish" : "Neutral";

    return Response.json({
      symbol,
      totalCallOI: totalCE / 3,
      totalPutOI: totalPE / 3,
      pcr,
      trend,
    });
  } catch (err) {
    console.error("Error fetching NSE data:", err.message);
    return Response.json(
      { error: "Unable to fetch data from NSE. Try again later." },
      { status: 500 }
    );
  }
}
