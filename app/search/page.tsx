'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'

interface Article {
  Title: string
  MetaDescription: string
  Category: string
  Slug: string
  LastModified: string
}

const categoryInfo: { [key: string]: { name: string; icon: string; color: string } } = {
  finanse: { name: 'Finanse', icon: 'bi-cash-coin', color: '#28a745' },
  prawo: { name: 'Prawo', icon: 'bi-bank', color: '#6f42c1' },
  technologia: { name: 'Technologia', icon: 'bi-cpu', color: '#0dcaf0' },
  zdrowie: { name: 'Zdrowie', icon: 'bi-heart-pulse', color: '#dc3545' },
  biznes: { name: 'Biznes', icon: 'bi-briefcase', color: '#fd7e14' },
  nieruchomosci: { name: 'Nieruchomości', icon: 'bi-house', color: '#20c997' },
  motoryzacja: { name: 'Motoryzacja', icon: 'bi-car-front', color: '#6610f2' },
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    // Symulujemy ładowanie - w rzeczywistości będziemy ładować z API/plików
    setLoading(true)
    
    // Fetch all articles and search
    fetch('/api/search?q=' + encodeURIComponent(query))
      .then(res => res.json())
      .then(data => {
        setResults(data.results || [])
        setLoading(false)
      })
      .catch(() => {
        // Fallback - search locally
        searchLocally(query)
      })
  }, [query])

  const searchLocally = async (q: string) => {
    try {
      // Pobieramy wszystkie artykuły z cache lub plików
      const response = await fetch('/api/articles')
      const articles = await response.json()
      
      const searchTerm = q.toLowerCase()
      const filtered = articles.filter((article: Article) => 
        article.Title.toLowerCase().includes(searchTerm) ||
        article.MetaDescription.toLowerCase().includes(searchTerm)
      )
      
      setResults(filtered)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  if (!query) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <div className="search-empty">
              <i className="bi bi-search search-empty-icon"></i>
              <h2 className="h3 mb-3">Rozpocznij wyszukiwanie</h2>
              <p className="text-muted mb-4">
                Wprowadź słowa kluczowe aby znaleźć interesujące Cię artykuły
              </p>
              
              <form action="/search/" method="get">
                <div className="search-input-wrapper mx-auto" style={{ maxWidth: '600px' }}>
                  <i className="bi bi-search"></i>
                  <input 
                    type="search" 
                    name="q" 
                    placeholder="Czego szukasz?" 
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary">
                    Szukaj
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="search-header mb-5">
            <h1 className="h2 mb-3">
              <i className="bi bi-search text-primary me-2"></i>
              Wyniki wyszukiwania
            </h1>
            <p className="text-muted">
              Szukasz: <strong>"{query}"</strong>
              {!loading && (
                <span className="ms-2">
                  - Znaleziono <strong>{results.length}</strong> {results.length === 1 ? 'artykuł' : 'artykułów'}
                </span>
              )}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Ładowanie...</span>
              </div>
              <p className="text-muted mt-3">Przeszukuję bazę artykułów...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="row g-4">
              {results.map((article) => {
                const info = categoryInfo[article.Category] || {
                  name: article.Category,
                  icon: 'bi-folder',
                  color: '#6c757d'
                }
                
                return (
                  <div key={`${article.Category}-${article.Slug}`} className="col-md-6">
                    <div className="article-card">
                      <div className="article-card-header">
                        <span 
                          className="category-badge" 
                          style={{ backgroundColor: info.color }}
                        >
                          <i className={`bi ${info.icon} me-1`}></i>
                          {info.name}
                        </span>
                        <span className="article-date text-muted small">
                          <i className="bi bi-calendar3 me-1"></i>
                          {new Date(article.LastModified).toLocaleDateString('pl-PL', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <h3 className="article-card-title">
                        <a 
                          href={`/${article.Category}/${article.Slug}/`}
                          className="stretched-link"
                        >
                          {article.Title}
                        </a>
                      </h3>
                      <p className="article-card-description">
                        {article.MetaDescription}
                      </p>
                      <div className="article-card-footer">
                        <span className="read-more">
                          Czytaj więcej <i className="bi bi-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="search-no-results text-center py-5">
              <i className="bi bi-inbox search-empty-icon"></i>
              <h3 className="h4 mb-3">Nie znaleziono wyników</h3>
              <p className="text-muted mb-4">
                Spróbuj innych słów kluczowych lub przejrzyj artykuły po kategoriach
              </p>
              
              <div className="row g-3 mt-4">
                {Object.entries(categoryInfo).map(([slug, info]) => (
                  <div key={slug} className="col-md-4 col-6">
                    <a 
                      href={`/category/${slug}/`}
                      className="btn btn-outline-primary w-100"
                    >
                      <i className={`bi ${info.icon} me-2`}></i>
                      {info.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-5">
            <a href="/" className="btn btn-outline-secondary">
              <i className="bi bi-house me-2"></i> Wróć do strony głównej
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Ładowanie...</span>
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
