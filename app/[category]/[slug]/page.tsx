import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ArticleClient from './ArticleClient'

interface Article {
  Title: string
  H1: string
  MetaDescription: string
  Category: string
  Slug: string
  LastModified?: string
  Content?: string[]
  Sections?: string[]
  Article?: string  // HTML jako string
  FAQ?: Array<{ 
    Question?: string
    Answer?: string
    q?: string
    a?: string
  }>
}

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

// Funkcja do pobrania artykułu
function getArticle(category: string, slug: string): Article | null {
  const filePath = path.join(
    process.cwd(),
    'public',
    'content',
    category,
    `${slug}.json`
  )

  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const article = JSON.parse(fileContent)
    article.Category = category
    article.Slug = slug
    return article
  } catch (error) {
    console.error('Error reading article:', error)
    return null
  }
}

// Funkcja do pobrania wszystkich artykułów (dla generateStaticParams)
function getAllArticles() {
  const contentDir = path.join(process.cwd(), 'public', 'content')
  const articles: Array<{ category: string; slug: string }> = []

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
      articles.push({
        category,
        slug: file.replace('.json', '')
      })
    }
  }

  return articles
}

// Generowanie statycznych ścieżek
export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(article => ({
    category: article.category,
    slug: article.slug
  }))
}

// Generowanie metadanych
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticle(params.category, params.slug)
  
  if (!article) {
    return {
      title: 'Nie znaleziono artykułu',
    }
  }

  return {
    title: `${article.Title} | MocInformacji.pl`,
    description: article.MetaDescription,
    openGraph: {
      title: article.Title,
      description: article.MetaDescription,
      type: 'article',
    },
  }
}

const categoryInfo: { [key: string]: { name: string; icon: string; color: string } } = {
  finanse: { name: 'Finanse', icon: 'bi-cash-coin', color: '#28a745' },
  prawo: { name: 'Prawo', icon: 'bi-scales', color: '#6f42c1' },
  technologia: { name: 'Technologia', icon: 'bi-cpu', color: '#0dcaf0' },
  zdrowie: { name: 'Zdrowie', icon: 'bi-heart-pulse', color: '#dc3545' },
  biznes: { name: 'Biznes', icon: 'bi-briefcase', color: '#fd7e14' },
  nieruchomosci: { name: 'Nieruchomości', icon: 'bi-house', color: '#20c997' },
  motoryzacja: { name: 'Motoryzacja', icon: 'bi-car-front', color: '#6610f2' },
}

// Komponent strony artykułu
export default function ArticlePage({ params }: PageProps) {
  const article = getArticle(params.category, params.slug)
  
  if (!article) {
    notFound()
  }

  const categoryMeta = categoryInfo[params.category] || {
    name: params.category,
    icon: 'bi-folder',
    color: '#6c757d'
  }

  // Obrazki z Unsplash dla każdej kategorii
  const categoryImages: { [key: string]: string } = {
    finanse: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=600&fit=crop',
    prawo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=600&fit=crop',
    technologia: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
    zdrowie: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=600&fit=crop',
    biznes: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=600&fit=crop',
    nieruchomosci: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
    motoryzacja: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=600&fit=crop',
  }

  const featuredImage = categoryImages[params.category] || categoryImages.technologia

  return (
    <ArticleClient 
      article={article}
      categoryMeta={categoryMeta}
      categorySlug={params.category}
      featuredImage={featuredImage}
    />
  )
}
