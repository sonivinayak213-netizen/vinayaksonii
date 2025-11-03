'use client'
import { useState } from 'react'
export default function OptionsTools(){
  const [symbol,setSymbol]=useState('NIFTY')
  const [data,setData]=useState(null)
  async function load(){ const r = await fetch(`/api/optionchain?symbol=${encodeURIComponent(symbol)}`); const j = await r.json(); setData(j) }
  return (<div className='mt-4 card'><div className='flex gap-2'><input className='input' value={symbol} onChange={e=>setSymbol(e.target.value)} /><button className='btn' onClick={load}>Load Option Chain</button></div><div className='mt-3 text-sm'>{data ? 'Option chain loaded (see console for structure)' : 'No data'}</div></div>)
}
