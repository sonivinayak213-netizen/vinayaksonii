import fetch from 'node-fetch'
export async function GET(req){
  try{
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get('symbol') || 'NIFTY'
    const url = `https://www.nseindia.com/api/option-chain-indices?symbol=${encodeURIComponent(symbol)}`
    const headers = { 'Accept': 'application/json, text/plain, */*', 'User-Agent': 'Mozilla/5.0' }
    const r = await fetch(url, { headers })
    const text = await r.text()
    try{ const json = JSON.parse(text); return new Response(JSON.stringify(json), { status: 200, headers: { 'content-type': 'application/json' } }) }catch(err){ return new Response(JSON.stringify({ error: 'parse_failed', raw: text.slice(0,1000) }), { status: 502, headers: { 'content-type': 'application/json' } }) }
  }catch(e){
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
