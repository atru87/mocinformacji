'use client'

import { useEffect, useState } from 'react'

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pobierz i zwiększ licznik
    const incrementViews = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
        })
        const data = await response.json()
        setViews(data.views)
      } catch (error) {
        console.error('Error fetching views:', error)
      } finally {
        setLoading(false)
      }
    }

    incrementViews()
  }, [])

  if (loading) {
    return (
      <div className="view-counter">
        <i className="bi bi-eye me-2"></i>
        <span>Ładowanie...</span>
      </div>
    )
  }

  return (
    <div className="view-counter">
      <i className="bi bi-eye me-2"></i>
      <span>
        <strong>{views?.toLocaleString('pl-PL')}</strong> unikalnych odwiedzin
      </span>
    </div>
  )
}
