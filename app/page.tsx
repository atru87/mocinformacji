import fs from 'fs'
import path from 'path'

// Typy
interface Article {
  Title: string
  H1: string
  MetaDescription: string
  Category: string
  Slug: string
  LastModified: string
  Content: string[]
  FAQ?: Array<{ Question: string; Answer: string }>
}

// Funkcja do wczytania artykułów
function getAllArticles(): Article[] {
  const contentDir = path.join(process.cwd(), 'public', 'content')
  const articles: Article[] = []

  if (!fs.existsSync(contentDir)) {
    return []
  }

  const categories = fs.readdirSync(contentDir).filter(item => {
    return fs.statSync(path.join(contentDir, item)).isDirectory()
  })

  for (const category of categories) {
    const categoryPath = path.join(contentDir, category)
    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json'))

    for (const file of files) {
      try {
        const filePath = path.join(categoryPath, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const article = JSON.parse(fileContent)
        
        article.Category = category
        article.Slug = file.replace('.json', '')
        
        articles.push(article)
      } catch (error) {
        console.error(`Error reading ${file}:`, error)
      }
    }
  }

  return articles.sort((a, b) => {
    const dateA = new Date(a.LastModified || '2024-01-01')
    const dateB = new Date(b.LastModified || '2024-01-01')
    return dateB.getTime() - dateA.getTime()
  })
}

// Funkcja do kategoryzacji artykułów
function categorizeArticles(articles: Article[]) {
  const categorized: { [key: string]: Article[] } = {}
  
  for (const article of articles) {
    if (!categorized[article.Category]) {
      categorized[article.Category] = []
    }
    categorized[article.Category].push(article)
  }
  
  return categorized
}

// Główny komponent strony
export default function Home() {
  const allArticles = getAllArticles()
  const categorizedArticles = categorizeArticles(allArticles)

  const categoryInfo: { [key: string]: { name: string; icon: string; color: string } } = {
    finanse: { name: 'Finanse', icon: 'bi-cash-coin', color: '#28a745' },
    prawo: { name: 'Prawo', icon: 'bi-bank', color: '#6f42c1' },
    technologia: { name: 'Technologia', icon: 'bi-cpu', color: '#0dcaf0' },
    zdrowie: { name: 'Zdrowie', icon: 'bi-heart-pulse', color: '#dc3545' },
    biznes: { name: 'Biznes', icon: 'bi-briefcase', color: '#fd7e14' },
    nieruchomosci: { name: 'Nieruchomości', icon: 'bi-house', color: '#20c997' },
    motoryzacja: { name: 'Motoryzacja', icon: 'bi-car-front', color: '#6610f2' },
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <div className="hero-badge mb-3">
                <i className="bi bi-stars"></i> Wiedza napędzana przez AI
              </div>
              <h1 className="hero-title mb-4">
                Odkrywaj <span className="gradient-text">Moc Informacji</span>
              </h1>
              <p className="hero-subtitle mb-4">
                Eksperckie odpowiedzi na pytania z zakresu finansów, prawa, zdrowia i wielu innych. Wszystko w jednym miejscu.
              </p>
              
              <div className="hero-search">
                <form action="/search/" method="get" className="search-form">
                  <div className="search-input-wrapper">
                    <i className="bi bi-search"></i>
                    <input 
                      type="search" 
                      name="q" 
                      placeholder="Czego chcesz się dziś dowiedzieć?" 
                    />
                    <button type="submit" className="btn btn-primary">
                      Szukaj <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </form>
                <div className="popular-searches mt-3">
                  <span className="text-muted small">Popularne:</span>
                  <a href="/search/?q=kredyt+hipoteczny" className="badge bg-light text-dark">
                    kredyt hipoteczny
                  </a>
                  <a href="/search/?q=rozliczenie+podatkowe" className="badge bg-light text-dark">
                    rozliczenie podatkowe
                  </a>
                  <a href="/search/?q=ubezpieczenie" className="badge bg-light text-dark">
                    ubezpieczenie
                  </a>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="hero-illustration">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=600&fit=crop" 
                  alt="Hero" 
                  className="img-fluid rounded-4 shadow-custom" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="bi bi-file-earmark-text"></i>
                </div>
                <div className="stat-number">{allArticles.length}+</div>
                <div className="stat-label">Artykułów</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="bi bi-folder"></i>
                </div>
                <div className="stat-number">{Object.keys(categorizedArticles).length}+</div>
                <div className="stat-label">Kategorii</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="stat-number">24/7</div>
                <div className="stat-label">Dostępność</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div className="stat-number">100%</div>
                <div className="stat-label">Darmowe</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Kategorie */}
        <div className="mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Przeglądaj po kategoriach</h2>
            <p className="text-muted">Znajdź artykuły w interesującym Cię temacie</p>
          </div>
          
          <div className="row g-4">
            {Object.entries(categorizedArticles).map(([category, articles]) => {
              const info = categoryInfo[category] || { 
                name: category, 
                icon: 'bi-folder', 
                color: '#6c757d' 
              }
              
              return (
                <div key={category} className="col-lg-3 col-md-6">
                  <a href={`/category/${category}/`} className="text-decoration-none">
                    <div className="category-card-mini">
                      <div 
                        className="category-card-mini-icon"
                        style={{ background: info.color }}
                      >
                        <i className={`bi ${info.icon}`}></i>
                      </div>
                      <h3 className="h5 mb-2">{info.name}</h3>
                      <p className="text-muted small mb-0">{articles.length} artykułów</p>
                    </div>
                  </a>
                </div>
              )
            })}
          </div>
        </div>

        {/* Wszystkie artykuły */}
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold mb-0">
              <i className="bi bi-grid text-primary me-2"></i>
              Wszystkie artykuły
            </h2>
            <span className="badge bg-primary-subtle text-primary px-3 py-2">
              {allArticles.length} artykułów
            </span>
          </div>
          
          <div className="row g-4">
            {allArticles.map((article) => {
              const info = categoryInfo[article.Category] || {
                name: article.Category,
                icon: 'bi-folder',
                color: '#6c757d'
              }
              
              return (
                <div key={`${article.Category}-${article.Slug}`} className="col-md-6 col-lg-4">
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
        </div>
      </div>
    </>
  )
}
