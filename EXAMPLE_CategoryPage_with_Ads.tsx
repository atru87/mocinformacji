// PRZYKŁAD IMPLEMENTACJI - app/category/[category]/page.tsx
// Fragment pokazujący gdzie wstawić reklamy

import { AdSenseHorizontal, AdSenseSidebar } from '@/components/AdSense'
import Link from 'next/link'

export default function CategoryPage({ params }: { params: { category: string } }) {
  // ... (twój kod do ładowania artykułów z kategorii)
  
  const categoryInfo = {
    finanse: { name: 'Finanse', icon: 'bi-cash-coin', description: 'Wszystko o finansach osobistych, inwestycjach i oszczędzaniu' },
    prawo: { name: 'Prawo', icon: 'bi-scales', description: 'Praktyczne porady prawne dla każdego' },
    technologia: { name: 'Technologia', icon: 'bi-cpu', description: 'Nowości technologiczne i poradniki IT' },
    // ... reszta kategorii
  }
  
  const currentCategory = categoryInfo[params.category]
  
  return (
    <div className="container py-5">
      <div className="row">
        {/* Main Content - 8 kolumn */}
        <div className="col-lg-8">
          {/* Category Header */}
          <div className="category-header mb-5">
            <nav className="breadcrumb">
              <Link href="/">Strona główna</Link> / {currentCategory.name}
            </nav>
            
            <h1 className="display-4 mb-3">
              <i className={`bi ${currentCategory.icon} me-3`}></i>
              {currentCategory.name}
            </h1>
            <p className="lead text-muted">{currentCategory.description}</p>
            
            <div className="category-stats mt-3">
              <span className="badge bg-light text-dark me-2">
                <i className="bi bi-file-text"></i> {articlesCount} artykułów
              </span>
              <span className="badge bg-light text-dark">
                <i className="bi bi-calendar"></i> Aktualizowane codziennie
              </span>
            </div>
          </div>

          {/* ✅ REKLAMA 1: Po nagłówku kategorii */}
          <AdSenseHorizontal slot="6666666661" />

          {/* Articles Grid */}
          <div className="row g-4">
            {articles.map((article, index) => (
              <div key={index} className="col-md-6">
                <Link href={`/${article.Category}/${article.Slug}`}>
                  <div className="category-article-card h-100">
                    {article.FeaturedImage && (
                      <div className="article-image">
                        <img src={article.FeaturedImage} alt={article.Title} />
                      </div>
                    )}
                    
                    <div className="article-body p-3">
                      <h3 className="h5 mb-2">{article.Title}</h3>
                      <p className="text-muted small mb-2">{article.MetaDescription?.substring(0, 100)}...</p>
                      
                      <div className="article-meta small text-muted">
                        <span className="me-3">
                          <i className="bi bi-clock"></i> {calculateReadingTime(article.WordCount)} min
                        </span>
                        <span>
                          <i className="bi bi-calendar3"></i>{' '}
                          {new Date(article.LastModified).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* ✅ REKLAMA 2: Co 6 artykułów */}
                {(index + 1) % 6 === 0 && (
                  <AdSenseHorizontal slot={`6666666${Math.floor(index / 6) + 2}`} />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                {/* ... pagination links */}
              </ul>
            </nav>
          )}

          {/* ✅ REKLAMA 3: Na końcu listy */}
          <AdSenseHorizontal slot="6666666669" />
        </div>

        {/* Sidebar - 4 kolumny (desktop only) */}
        <div className="col-lg-4 d-none d-lg-block">
          {/* ✅ REKLAMA SIDEBAR: Sticky na górze */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <AdSenseSidebar slot="7777777777" />
          </div>
          
          {/* Related Categories */}
          <div className="mt-4 p-4 border rounded">
            <h5 className="mb-3">
              <i className="bi bi-folder2 me-2"></i>
              Powiązane kategorie
            </h5>
            <ul className="list-unstyled">
              {relatedCategories.map((cat, index) => (
                <li key={index} className="mb-2">
                  <Link href={`/category/${cat.slug}`} className="text-decoration-none">
                    <i className={`bi ${cat.icon} me-2`}></i>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Articles */}
          <div className="mt-4 p-4 border rounded">
            <h5 className="mb-3">
              <i className="bi bi-fire me-2"></i>
              Popularne artykuły
            </h5>
            <ul className="list-unstyled">
              {popularArticles.slice(0, 5).map((article, index) => (
                <li key={index} className="mb-3 pb-3 border-bottom">
                  <Link href={`/${article.Category}/${article.Slug}`} className="text-decoration-none">
                    <h6 className="small mb-1">{article.Title}</h6>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {calculateReadingTime(article.WordCount)} min czytania
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="mt-4 p-4 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
            <h5 className="mb-3">📧 Newsletter</h5>
            <p className="small text-muted mb-3">
              Otrzymuj najlepsze artykuły z kategorii {currentCategory.name} prosto na swoją skrzynkę!
            </p>
            <input type="email" className="form-control mb-2" placeholder="Twój email" />
            <button className="btn btn-primary w-100">Zapisz się</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function
function calculateReadingTime(wordCount: number): number {
  return wordCount ? Math.ceil(wordCount / 225) : 5
}
