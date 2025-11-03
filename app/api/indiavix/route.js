import fetch from 'node-fetch'
export async function GET(){
  try{
    const url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EINDIAVIX'
    const r = await fetch(url)
    const json = await r.json()
    return new Response(JSON.stringify(json), { status: 200, headers: { 'content-type': 'application/json' } })
  }catch(e){
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
