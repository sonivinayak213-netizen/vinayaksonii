'use client'
import { useState } from 'react'
export default function MFTools(){
  const [sips, setSips] = useState({amount:5000,rate:12,years:10})
  function calc(){ const r = sips.rate/100; const n = 12; const t = sips.years; const fv = sips.amount*((Math.pow(1 + r/n, n*t)-1)/(r/n)) ; return Math.round(fv) }
  return (<div className='mt-4 card'><div className='flex gap-2'><input className='input' value={sips.amount} onChange={e=>setSips({...sips,amount:Number(e.target.value)})} /><input className='input' value={sips.rate} onChange={e=>setSips({...sips,rate:Number(e.target.value)})} /><input className='input' value={sips.years} onChange={e=>setSips({...sips,years:Number(e.target.value)})} /><button className='btn' onClick={()=>alert('Future value: '+calc())}>Calculate SIP FV</button></div></div>) }
