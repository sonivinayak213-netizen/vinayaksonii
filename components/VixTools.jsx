'use client'
import { useEffect, useState } from 'react'

export default function VixTools() {
  const [vix, setVix] = useState(null)

  useEffect(() => {
    fetch('/api/indiavix')
      .then(r => r.json())
      .then(d => {
        try {
          setVix(d.quoteResponse.result[0].regularMarketPrice)
        } catch (e) {
          setVix(null)
        }
      })
  }, [])

  return (
    <div className='mt-4 card'>
      <div>India VIX: {vix || 'loading'}</div>
      <div className='text-sm text-muted mt-2'>
        Rule: VIX &gt; 20 = Volatile
      </div>
    </div>
  )
}
