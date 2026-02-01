'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  format?: string
  style?: React.CSSProperties
  responsive?: boolean
  className?: string
}

export default function AdSense({ 
  slot, 
  format = 'auto', 
  style, 
  responsive = true,
  className = ''
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
        className={className}
        style={{
          background: '#f0f0f0',
          border: '2px dashed #ccc',
          padding: '40px 20px',
          textAlign: 'center',
          borderRadius: '8px',
          color: '#666',
          marginBottom: '1rem',
          ...style
        }}
      >
        <i className="bi bi-megaphone" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
        <strong>AdSense Placeholder</strong>
        <br />
        <small>Slot: {slot} | Format: {format}</small>
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-4321819036207321"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  )
}

// Predefined ad components for common placements

export function AdSenseHorizontal({ className = '', slot = '1234567890' }: { className?: string; slot?: string }) {
  return (
    <div className={`my-4 ${className}`}>
      <AdSense
        slot={slot}
        format="horizontal"
        style={{ minHeight: '90px' }}
      />
    </div>
  )
}

export function AdSenseInArticle({ className = '', slot = '2345678901' }: { className?: string; slot?: string }) {
  return (
    <div className={`my-4 ${className}`} style={{ textAlign: 'center' }}>
      <AdSense
        slot={slot}
        format="fluid"
        style={{ minHeight: '250px' }}
      />
    </div>
  )
}

export function AdSenseSidebar({ className = '', slot = '3456789012' }: { className?: string; slot?: string }) {
  return (
    <div className={`sticky-ad ${className}`} style={{ position: 'sticky', top: '80px' }}>
      <AdSense
        slot={slot}
        format="vertical"
        responsive={false}
        style={{ width: '300px', height: '600px' }}
      />
    </div>
  )
}

export function AdSenseSquare({ className = '', slot = '4567890123' }: { className?: string; slot?: string }) {
  return (
    <div className={`my-3 ${className}`}>
      <AdSense
        slot={slot}
        format="rectangle"
        responsive={false}
        style={{ width: '300px', height: '250px' }}
      />
    </div>
  )
}

export function AdSenseStickyBottom({ className = '', slot = '5678901234' }: { className?: string; slot?: string }) {
  return (
    <div 
      className={`d-lg-none ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#fff',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <AdSense
        slot={slot}
        format="horizontal"
        style={{ minHeight: '50px' }}
      />
    </div>
  )
}