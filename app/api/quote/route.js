import fetch from 'node-fetch'
export async function GET(req){
  try{
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get('symbol') || 'RELIANCE.NS'
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`
    const r = await fetch(url)
    const json = await r.json()
    return new Response(JSON.stringify(json), { status: 200, headers: { 'content-type': 'application/json' } })
  }catch(e){
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
