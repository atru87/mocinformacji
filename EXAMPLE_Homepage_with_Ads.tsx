// PRZYKŁAD IMPLEMENTACJI - app/page.tsx
// Fragment pokazujący gdzie wstawić reklamy

import { AdSenseHorizontal, AdSenseSquare } from '@/components/AdSense'
import Link from 'next/link'

export default function Home() {
  // ... (twój kod do ładowania artykułów)
  
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="hero-title mb-4">
                Odkrywaj <span className="gradient-text">Moc Informacji</span>
              </h1>
              <p className="hero-subtitle mb-4">
                Eksperckie odpowiedzi na pytania z zakresu finansów, prawa, zdrowia i wielu innych.
              </p>
              
              {/* Search Form */}
              <form action="/search/" method="get" className="search-form">
                <input type="search" name="q" placeholder="Czego chcesz się dziś dowiedzieć?" />
                <button type="submit" className="btn btn-primary">Szukaj</button>
              </form>
            </div>
            
            <div className="col-lg-6">
              {/* ✅ REKLAMA 1: Hero - Square na desktop, Horizontal na mobile */}
              <div className="d-none d-lg-block">
                <AdSenseSquare slot="1111111111" />
              </div>
              <div className="d-lg-none">
                <AdSenseHorizontal slot="1111111112" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ REKLAMA 2: Po hero section */}
      <AdSenseHorizontal slot="2222222222" />

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <h3>{totalArticles}+</h3>
              <p>Artykułów</p>
            </div>
            {/* ... inne statystyki */}
          </div>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="container py-5">
        <h2 className="section-title mb-4">Najnowsze artykuły</h2>
        
        <div className="row g-4">
          {latestArticles.slice(0, 6).map((article, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className="article-card">
                <Link href={`/${article.Category}/${article.Slug}`}>
                  <img src={article.FeaturedImage} alt={article.Title} />
                  <h3>{article.Title}</h3>
                  <p>{article.MetaDescription}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ REKLAMA 3: Po pierwszych artykułach */}
      <AdSenseHorizontal slot="3333333333" />

      {/* Categories - pokazuj artykuły z każdej kategorii */}
      <div className="container py-5">
        {Object.entries(categorizedArticles).slice(0, 3).map(([categorySlug, articles], catIndex) => (
          <div key={catIndex} className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="category-title">
                <i className={`bi ${categoryInfo[categorySlug]?.icon}`}></i>{' '}
                {categoryInfo[categorySlug]?.name}
              </h2>
              <Link href={`/category/${categorySlug}`} className="btn btn-outline-primary">
                Zobacz wszystkie →
              </Link>
            </div>
            
            <div className="row g-3">
              {articles.slice(0, 4).map((article, artIndex) => (
                <div className="col-md-6" key={artIndex}>
                  <Link href={`/${article.Category}/${article.Slug}`}>
                    <div className="category-article-card">
                      <h3>{article.Title}</h3>
                      <p className="text-muted small">{article.MetaDescription}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* ✅ REKLAMA 4: Co drugą kategorię (po kategorii 1, 3, 5...) */}
            {catIndex % 2 === 1 && (
              <AdSenseHorizontal slot={`444444444${catIndex}`} />
            )}
          </div>
        ))}
      </div>

      {/* ✅ REKLAMA 5: Przed CTA */}
      <AdSenseHorizontal slot="5555555555" />

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-card text-center p-5">
            <h2 className="mb-3">Nie znalazłeś tego, czego szukasz?</h2>
            <p className="mb-4">
              Skontaktuj się z nami, a my stworzymy artykuł odpowiadający na Twoje pytanie!
            </p>
            <Link href="/kontakt" className="btn btn-light btn-lg">
              <i className="bi bi-envelope me-2"></i> Skontaktuj się
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
