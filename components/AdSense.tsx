'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  format?: string
  style?: React.CSSProperties
  responsive?: boolean
}

export default function AdSense({ 
  slot, 
  format = 'auto', 
  style, 
  responsive = true 
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (err) {
      console.log('AdSense error:', err)
    }
  }, [])

  // W trybie development pokazuj placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        style={{
          background: '#f0f0f0',
          border: '2px dashed #ccc',
          padding: '40px 20px',
          textAlign: 'center',
          borderRadius: '8px',
          color: '#666',
          ...style
        }}
      >
        <i className="bi bi-megaphone" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
        <strong>AdSense Placeholder</strong>
        <br />
        <small>Slot: {slot}</small>
      </div>
    )
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-TWOJ-KOD-TUTAJ"  // ZMIEŃ TO!
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  )
}
