import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const contentDir = path.join(process.cwd(), 'public', 'content')
    const articles: any[] = []

    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ results: [] })
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
          
          articles.push({
            Title: article.Title,
            MetaDescription: article.MetaDescription,
            Category: article.Category,
            Slug: article.Slug,
            LastModified: article.LastModified || new Date().toISOString()
          })
        } catch (error) {
          console.error(`Error reading ${file}:`, error)
        }
      }
    }

    // Wyszukiwanie
    const searchTerm = query.toLowerCase()
    const results = articles.filter(article => 
      article.Title.toLowerCase().includes(searchTerm) ||
      article.MetaDescription.toLowerCase().includes(searchTerm)
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}
