import { NextResponse } from "next/server";

export async function GET() {
  try {
    // NSE Option Chain ka live data URL
    const url = "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY";

    // NSE site ke liye headers zaruri hain warna data nahi milega
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.nseindia.com/",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data from NSE");
    }

    const data = await res.json();
    const records = data?.records?.data || [];

    let items = [];
    let totalCallOI = 0;
    let totalPutOI = 0;

    for (const r of records) {
      const call = r.CE || {};
      const put = r.PE || {};

      const callOI = call.openInterest ?? 0;
      const putOI = put.openInterest ?? 0;
      const callChangePerc = call.changeinOpenInterest ?? 0;
      const putChangePerc = put.changeinOpenInterest ?? 0;
      const callPrice = call.lastPrice ?? 0;
      const putPrice = put.lastPrice ?? 0;

      totalCallOI += callOI;
      totalPutOI += putOI;

      items.push({
        strike: r.strikePrice ?? r.strike ?? ((call.strikePrice || put.strikePrice) ?? null),
        callOI,
        putOI,
        callChangePerc,
        putChangePerc,
        callPrice,
        putPrice,
      });
    }

    // PCR (Put Call Ratio) calculation
    const pcr = totalCallOI ? (totalPutOI / totalCallOI).toFixed(2) : "0.00";
    const sentiment =
      pcr > 1.2 ? "Bullish 🟢" : pcr < 0.8 ? "Bearish 🔴" : "Neutral ⚪";

    return NextResponse.json({
      timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      totalCallOI,
      totalPutOI,
      pcr,
      sentiment,
      items,
    });
  } catch (error) {
    console.error("Error fetching option chain:", error);
    return NextResponse.json(
      { error: "Failed to load option chain data" },
      { status: 500 }
    );
  }
}
