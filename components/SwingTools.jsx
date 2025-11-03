'use client'
import { useState } from 'react'
const TOP100 = ['RELIANCE.NS','INFY.NS','TCS.NS','HDFCBANK.NS'] // sample
export default function SwingTools(){
  const [filters,setFilters] = useState({pe:20, de:1, adx:25})
  const [result,setResult]=useState([])
  async function run(){
    // dummy: fetch quotes and apply simple filter on PE if available
    const out=[]
    for(const s of TOP100){
      try{
        const r = await fetch(`/api/quote?symbol=${encodeURIComponent(s)}`)
        const j = await r.json()
        const q = j.quoteResponse?.result?.[0]
        const pe = q?.forwardPE || q?.trailingPE || 9999
        if(pe < filters.pe) out.push({symbol:s,price:q?.regularMarketPrice,pe})
      }catch(e){}
    }
    setResult(out)
  }
  return (<div className='mt-4 card'><div className='flex gap-2'><input className='input' value={filters.pe} onChange={e=>setFilters({...filters,pe:Number(e.target.value)})} /><button className='btn' onClick={run}>Run Screener</button></div><div className='mt-3'>{result.length?result.map(r=>(<div key={r.symbol} className='p-2 border-b border-gray-800'>{r.symbol} — {r.price} — PE: {r.pe}</div>)):'No results yet'}</div></div>) }
