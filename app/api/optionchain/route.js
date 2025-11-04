import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY";

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
        "Accept": "application/json",
        "Referer": "https://www.nseindia.com/",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`NSE API Error: ${res.status}`);
    }

    const data = await res.json();

    // Extracting meaningful data
    const records = data?.records?.data || [];
    if (!records.length) {
      return NextResponse.json({ error: "No data received from NSE" }, { status: 500 });
    }

    let totalCallOI = 0;
    let totalPutOI = 0;

    records.forEach((item) => {
      totalCallOI += item.CE?.openInterest || 0;
      totalPutOI += item.PE?.openInterest || 0;
    });

    const pcr = totalPutOI / totalCallOI;
    let trend =
      pcr > 1.2 ? "Bullish" : pcr < 0.8 ? "Bearish" : "Neutral";

    return NextResponse.json({
      symbol: "NIFTY",
      totalCallOI,
      totalPutOI,
      pcr: pcr.toFixed(2),
      trend,
    });
  } catch (err) {
    console.error("API Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
