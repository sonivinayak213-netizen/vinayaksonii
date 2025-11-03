'use client'
import { useState } from 'react'
export default function SuggestForm(){
  const [q, setQ] = useState('TCS.NS')
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)
  async function submit(e){
    e.preventDefault()
    setLoading(true); setRes(null)
    try{
      const r = await fetch('/api/suggest', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ query: q }) })
      const j = await r.json()
      setRes(j)
    }catch(err){
      setRes({ error: err.message })
    }
    setLoading(false)
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="input flex-1" />
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Thinking...' : 'Get Suggestion'}</button>
      </div>
      {res && (
        <div className="mt-2 bg-gray-900 p-3 rounded">
          <pre className="whitespace-pre-wrap text-sm">{res.suggestion || JSON.stringify(res)}</pre>
        </div>
      )}
    </form>
  )
}
