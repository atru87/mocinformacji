// PRZYKŁAD IMPLEMENTACJI - app/[category]/[slug]/ArticleClient.tsx
// Zaimplementuj reklamy zgodnie z tym wzorem

'use client'

import { useEffect, useState } from 'react'
import { AdSenseHorizontal, AdSenseInArticle, AdSenseSidebar, AdSenseStickyBottom } from '@/components/AdSense'
import Link from 'next/link'

interface Article {
  Title: string
  H1: string
  MetaDescription: string
  Category: string
  Slug: string
  LastModified?: string
  Article?: string
  FAQ?: Array<{ 
    Question?: string
    Answer?: string
    q?: string
    a?: string
  }>
  WordCount?: number
}

interface Props {
  article: Article
  categoryMeta: {
    name: string
    icon: string
    color: string
  }
  categorySlug: string
  featuredImage: string
}

interface TocItem {
  id: string
  text: string
  level: number
}

export default function ArticleClient({ article, categoryMeta, categorySlug, featuredImage }: Props) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  const [readProgress, setReadProgress] = useState(0)
  
  // Oblicz czas czytania
  const readingTime = article.WordCount ? Math.ceil(article.WordCount / 225) : 5

  // Podziel artykuł na sekcje (split by <h2>)
  const splitArticleIntoSections = (htmlContent: string): string[] => {
    if (!htmlContent) return []
    
    const sections: string[] = []
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const headings = doc.querySelectorAll('h2')
    
    if (headings.length === 0) {
      // Jeśli brak h2, zwróć całość jako jedna sekcja
      return [htmlContent]
    }
    
    let currentSection = ''
    const allElements = doc.body.children
    
    Array.from(allElements).forEach((element) => {
      if (element.tagName === 'H2') {
        if (currentSection.trim()) {
          sections.push(currentSection)
        }
        currentSection = element.outerHTML
      } else {
        currentSection += element.outerHTML
      }
    })
    
    if (currentSection.trim()) {
      sections.push(currentSection)
    }
    
    return sections
  }

  const articleSections = article.Article ? splitArticleIntoSections(article.Article) : []

  // Extract TOC
  useEffect(() => {
    const extractHeadings = () => {
      const headings: TocItem[] = []
      const contentElement = document.querySelector('.article-content')
      
      if (contentElement) {
        const h2Elements = contentElement.querySelectorAll('h2')
        h2Elements.forEach((h2, index) => {
          if (!h2.id || h2.id === '') {
            const id = `section-${index}`
            h2.id = id
          }
          headings.push({
            id: h2.id,
            text: h2.textContent || '',
            level: 2
          })
        })
      }
      
      setTocItems(headings)
    }

    setTimeout(extractHeadings, 150)
  }, [article])

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = (scrolled / documentHeight) * 100
      setReadProgress(Math.min(progress, 100))

      const sections = tocItems.map(item => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  return (
    <>
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${readProgress}%`,
          height: '3px',
          backgroundColor: categoryMeta.color,
          zIndex: 9999,
          transition: 'width 0.1s'
        }}
      />

      {/* Featured Image */}
      <div className="featured-image" style={{ maxHeight: '400px', overflow: 'hidden' }}>
        <img src={featuredImage} alt={article.Title} style={{ width: '100%', objectFit: 'cover' }} />
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Main Content - 8 kolumn */}
          <div className="col-lg-8">
            {/* Article Header */}
            <header className="article-header mb-4">
              <nav className="breadcrumb">
                <Link href="/">Strona główna</Link>
                {' / '}
                <Link href={`/category/${categorySlug}`}>{categoryMeta.name}</Link>
                {' / '}
                <span>{article.Title}</span>
              </nav>
              
              <span className="badge" style={{ backgroundColor: categoryMeta.color, color: '#fff', marginBottom: '1rem', display: 'inline-block' }}>
                <i className={`bi ${categoryMeta.icon} me-1`}></i>
                {categoryMeta.name}
              </span>
              
              <h1 className="display-4 mb-3">{article.H1}</h1>
              
              <div className="article-meta text-muted">
                <span className="me-3">
                  <i className="bi bi-calendar3"></i>{' '}
                  {article.LastModified ? new Date(article.LastModified).toLocaleDateString('pl-PL') : 'Niedawno'}
                </span>
                <span className="me-3">
                  <i className="bi bi-clock"></i> {readingTime} min czytania
                </span>
                {article.WordCount && (
                  <span>
                    <i className="bi bi-file-text"></i> {article.WordCount} słów
                  </span>
                )}
              </div>
            </header>

            {/* ✅ REKLAMA 1: Po nagłówku, przed treścią */}
            <AdSenseHorizontal slot="8888888881" />

            {/* Article Content z reklamami IN-ARTICLE */}
            <div className="article-content">
              {articleSections.length > 0 ? (
                <>
                  {/* Sekcja 1 */}
                  <div dangerouslySetInnerHTML={{ __html: articleSections[0] }} />
                  
                  {/* ✅ REKLAMA 2: Po 1 sekcji (około 25% artykułu) */}
                  {articleSections.length > 1 && (
                    <AdSenseInArticle slot="8888888882" />
                  )}

                  {/* Sekcja 2 */}
                  {articleSections[1] && (
                    <div dangerouslySetInnerHTML={{ __html: articleSections[1] }} />
                  )}

                  {/* ✅ REKLAMA 3: Po 2 sekcji (około 50% artykułu) */}
                  {articleSections.length > 2 && (
                    <AdSenseInArticle slot="8888888883" />
                  )}

                  {/* Pozostałe sekcje bez reklam */}
                  {articleSections.slice(2).map((section, idx) => (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: section }} />
                  ))}
                </>
              ) : article.Article ? (
                <div dangerouslySetInnerHTML={{ __html: article.Article }} />
              ) : (
                <p>Brak treści artykułu.</p>
              )}
            </div>

            {/* ✅ REKLAMA 4: Po treści, przed FAQ */}
            <AdSenseHorizontal slot="8888888884" />

            {/* FAQ Section */}
            {article.FAQ && article.FAQ.length > 0 && (
              <div className="faq-section mt-5">
                <h2 id="faq-heading" className="mb-4">
                  <i className="bi bi-question-circle text-primary me-2"></i>
                  Najczęściej zadawane pytania
                </h2>
                
                <div className="accordion" id="faqAccordion">
                  {article.FAQ.map((faq, index) => (
                    <div className="accordion-item" key={index}>
                      <h3 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq-${index}`}
                        >
                          {faq.Question || faq.q}
                        </button>
                      </h3>
                      <div
                        id={`faq-${index}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          {faq.Answer || faq.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ REKLAMA 5: Po FAQ */}
            <AdSenseHorizontal slot="8888888885" />

            {/* Social Share */}
            <div className="social-share mt-4">
              <h5>Podziel się:</h5>
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm">
                  <i className="bi bi-facebook"></i> Facebook
                </button>
                <button className="btn btn-info btn-sm">
                  <i className="bi bi-twitter"></i> Twitter
                </button>
                <button className="btn btn-success btn-sm">
                  <i className="bi bi-whatsapp"></i> WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - 4 kolumny (desktop only) */}
          <div className="col-lg-4 d-none d-lg-block">
            {/* Table of Contents (sticky) */}
            {tocItems.length > 0 && (
              <div className="toc-wrapper" style={{ position: 'sticky', top: '80px' }}>
                <h5 className="mb-3">
                  <i className="bi bi-list-ul me-2"></i>
                  Spis treści
                </h5>
                <ul className="list-unstyled">
                  {tocItems.map(item => (
                    <li key={item.id} className="mb-2">
                      <a 
                        href={`#${item.id}`}
                        className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                        style={{
                          color: activeSection === item.id ? categoryMeta.color : '#666',
                          textDecoration: 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ REKLAMA SIDEBAR 1: Pod TOC */}
            <div className="mt-4">
              <AdSenseSidebar slot="9999999991" />
            </div>

            {/* Newsletter Box */}
            <div className="mt-4 p-4 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
              <h5 className="mb-3">📧 Newsletter</h5>
              <p className="small text-muted">Otrzymuj najnowsze artykuły prosto na swoją skrzynkę!</p>
              <input type="email" className="form-control mb-2" placeholder="Twój email" />
              <button className="btn btn-primary w-100">Zapisz się</button>
            </div>

            {/* ✅ REKLAMA SIDEBAR 2: Pod newsletter */}
            <div className="mt-4">
              <AdSenseSidebar slot="9999999992" />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ REKLAMA STICKY BOTTOM: Mobile only */}
      <AdSenseStickyBottom slot="0000000001" />
    </>
  )
}
