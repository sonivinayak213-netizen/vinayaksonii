'use client'
import { useEffect, useState } from 'react'
export default function Card({ title, symbol }){
  const [quote,setQuote] = useState(null)
  useEffect(()=>{
    if(!symbol) return
    fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`)
      .then(r=>r.json()).then(d=>{ try{ setQuote(d.quoteResponse.result[0]) }catch(e){ setQuote(null) } }).catch(()=>{})
  },[symbol])
  return (<div className="card"><h3 className="font-semibold">{title}</h3><div style={{height:100}} className="flex items-center justify-center bg-gray-900 rounded mt-2">{quote ? (<div className='text-center'><div className='font-bold'>{quote.shortName||quote.symbol}</div><div className='text-sm'>{quote.regularMarketPrice} {quote.currency}</div></div>) : <div className='text-sm text-muted'>Live loading...</div>}</div></div>)
}
