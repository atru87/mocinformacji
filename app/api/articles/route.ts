import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'public', 'content')
    const articles: any[] = []

    if (!fs.existsSync(contentDir)) {
      return NextResponse.json([])
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
          
          articles.push({
            Title: article.Title,
            MetaDescription: article.MetaDescription,
            Category: category,
            Slug: file.replace('.json', ''),
            LastModified: article.LastModified || new Date().toISOString()
          })
        } catch (error) {
          console.error(`Error reading ${file}:`, error)
        }
      }
    }

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Articles API error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
