import axios from "axios";
import { NextResponse } from "next/server";

const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"];

export async function GET() {
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await axios.get(
          `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
              "Accept": "application/json",
            },
          }
        );

        const data = res.data;
        const ceOi = data.filtered.CE?.reduce((a, b) => a + (b.openInterest || 0), 0) || 0;
        const peOi = data.filtered.PE?.reduce((a, b) => a + (b.openInterest || 0), 0) || 0;
        const pcr = peOi / ceOi;

        let trend = "Neutral";
        if (pcr > 1.3) trend = "Bullish";
        else if (pcr < 0.7) trend = "Bearish";

        return {
          symbol,
          totalCallOi: ceOi,
          totalPutOi: peOi,
          pcr: pcr.toFixed(2),
          trend,
        };
      })
    );

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toLocaleTimeString(),
      data: results,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json({ success: false, message: "Fetch failed" });
  }
}
