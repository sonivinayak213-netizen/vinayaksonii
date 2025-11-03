'use client'
import { useState } from 'react'
export default function FundamentalTools(){
  const [symbol,setSymbol] = useState('TCS.NS')
  const [data,setData] = useState(null)
  async function fetchIt(){ const r = await fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`); const j = await r.json(); setData(j.quoteResponse?.result?.[0]||null) }
  return (<div className='mt-4 card'><div className='flex gap-2'><input className='input' value={symbol} onChange={e=>setSymbol(e.target.value)} /><button className='btn' onClick={fetchIt}>Fetch</button></div>{data && (<div className='mt-3'><div>Price: {data.regularMarketPrice}</div><div>PE (fwd): {data.forwardPE||'N/A'}</div></div>)}</div>)
}
