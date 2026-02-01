import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Article {
  Title: string
  H1: string
  MetaDescription: string
  Slug: string
  LastModified?: string
}

interface PageProps {
  params: {
    category: string
  }
}

function getCategoryArticles(category: string): Article[] {
  const categoryPath = path.join(process.cwd(), 'public', 'content', category)

  if (!fs.existsSync(categoryPath)) {
    return []
  }

  const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json'))
  const articles: Article[] = []

  for (const file of files) {
    try {
      const filePath = path.join(categoryPath, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const article = JSON.parse(fileContent)
      
      articles.push({
        Title: article.Title,
        H1: article.H1,
        MetaDescription: article.MetaDescription,
        Slug: file.replace('.json', ''),
        LastModified: article.LastModified
      })
    } catch (error) {
      console.error(`Error reading ${file}:`, error)
    }
  }

  return articles.sort((a, b) => {
    const dateA = new Date(a.LastModified || '2024-01-01')
    const dateB = new Date(b.LastModified || '2024-01-01')
    return dateB.getTime() - dateA.getTime()
  })
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'public', 'content')
  
  if (!fs.existsSync(contentDir)) {
    return []
  }

  const categories = fs.readdirSync(contentDir).filter(item => {
    return fs.statSync(path.join(contentDir, item)).isDirectory()
  })

  return categories.map(category => ({
    category
  }))
}

const categoryInfo: { [key: string]: { name: string; icon: string; color: string; description: string } } = {
  finanse: { 
    name: 'Finanse', 
    icon: 'bi-cash-coin', 
    color: '#28a745',
    description: 'Poradniki finansowe, inwestycje, oszczędzanie i zarządzanie budżetem'
  },
  prawo: { 
    name: 'Prawo', 
    icon: 'bi-scales', 
    color: '#6f42c1',
    description: 'Porady prawne, procedury, dokumenty i przepisy'
  },
  technologia: { 
    name: 'Technologia', 
    icon: 'bi-cpu', 
    color: '#0dcaf0',
    description: 'Nowinki technologiczne, poradniki IT i cyberbezpieczeństwo'
  },
  zdrowie: { 
    name: 'Zdrowie', 
    icon: 'bi-heart-pulse', 
    color: '#dc3545',
    description: 'Zdrowy styl życia, medycyna i dobre samopoczucie'
  },
  biznes: { 
    name: 'Biznes', 
    icon: 'bi-briefcase', 
    color: '#fd7e14',
    description: 'Przedsiębiorczość, zarządzanie i rozwój firmy'
  },
  nieruchomosci: { 
    name: 'Nieruchomości', 
    icon: 'bi-house', 
    color: '#20c997',
    description: 'Kupno, sprzedaż, wynajem i inwestycje w nieruchomości'
  },
  motoryzacja: { 
    name: 'Motoryzacja', 
    icon: 'bi-car-front', 
    color: '#6610f2',
    description: 'Samochody, porady motoryzacyjne i konserwacja'
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const info = categoryInfo[params.category]
  
  if (!info) {
    return {
      title: 'Kategoria nie znaleziona',
    }
  }

  return {
    title: `${info.name} - Artykuły i Poradniki | MocInformacji.pl`,
    description: info.description,
  }
}

export default function CategoryPage({ params }: PageProps) {
  const articles = getCategoryArticles(params.category)
  const info = categoryInfo[params.category]
  
  if (!info || articles.length === 0) {
    notFound()
  }

  return (
    <>
      <div 
        className="article-header"
        style={{
          background: `linear-gradient(135deg, ${info.color} 0%, ${info.color}dd 100%)`
        }}
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Strona główna</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {info.name}
              </li>
            </ol>
          </nav>
          
          <div className="text-center py-4">
            <div className="category-icon mb-3" style={{ fontSize: '4rem' }}>
              <i className={`bi ${info.icon}`}></i>
            </div>
            <h1 className="display-4 fw-bold mb-3">{info.name}</h1>
            <p className="lead">{info.description}</p>
            <div className="mt-3">
              <span className="badge bg-white text-dark fs-6 px-3 py-2">
                {articles.length} artykułów
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {articles.map((article) => (
            <div key={article.Slug} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <a 
                      href={`/${params.category}/${article.Slug}/`}
                      className="text-decoration-none text-dark"
                    >
                      {article.Title}
                    </a>
                  </h5>
                  <p className="card-text text-muted small mb-3">
                    {article.MetaDescription}
                  </p>
                  {article.LastModified && (
                    <div className="text-muted small">
                      <i className="bi bi-calendar"></i>{' '}
                      {new Date(article.LastModified).toLocaleDateString('pl-PL')}
                    </div>
                  )}
                  <a 
                    href={`/${params.category}/${article.Slug}/`}
                    className="btn btn-sm btn-outline-primary mt-3"
                  >
                    Czytaj więcej <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <a href="/" className="btn btn-outline-secondary">
            <i className="bi bi-house"></i> Wróć do strony głównej
          </a>
        </div>
      </div>
    </>
  )
}
