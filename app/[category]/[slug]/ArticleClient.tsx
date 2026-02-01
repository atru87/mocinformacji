'use client'

import { useEffect, useState } from 'react'

interface Article {
  Title: string
  H1: string
  MetaDescription: string
  Category: string
  Slug: string
  LastModified?: string
  Content?: string[]
  Sections?: string[]
  Article?: string
  FAQ?: Array<{ 
    Question?: string
    Answer?: string
    q?: string
    a?: string
  }>
  ComparisonType?: string  // "vs" for comparison articles
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
  
  const isVsArticle = article.ComparisonType === 'vs'

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
            headings.push({
              id,
              text: h2.textContent || '',
              level: 2
            })
          } else if (h2.id === 'faq-heading') {
            headings.push({
              id: h2.id,
              text: h2.textContent || '',
              level: 2
            })
          }
        })
      }
      
      setTocItems(headings)
    }

    setTimeout(extractHeadings, 150)
  }, [article])

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
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offsetTop = element.offsetTop - 100
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <div 
        className="article-header"
        style={{
          background: `linear-gradient(135deg, ${categoryMeta.color} 0%, ${categoryMeta.color}dd 100%)`
        }}
      >
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Strona główna</a>
              </li>
              <li className="breadcrumb-item">
                <a href={`/category/${categorySlug}/`}>{categoryMeta.name}</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {article.Title}
              </li>
            </ol>
          </nav>
          
          <h1 className="display-4 fw-bold mb-3">{article.H1}</h1>
          
          <div className="article-meta">
            <div className="article-meta-item">
              <i className={`bi ${categoryMeta.icon}`}></i>
              <span>{categoryMeta.name}</span>
            </div>
            {article.LastModified && (
              <div className="article-meta-item">
                <i className="bi bi-calendar"></i>
                <span>{new Date(article.LastModified).toLocaleDateString('pl-PL')}</span>
              </div>
            )}
            {isVsArticle && (
              <div className="article-meta-item">
                <i className="bi bi-arrows-expand"></i>
                <span>Porównanie</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <img 
          src={featuredImage} 
          alt={article.Title}
          className="article-featured-image"
        />
      </div>

      <div className="container py-5">
        <div className="row">
          {tocItems.length > 0 && (
            <div className="col-lg-3 d-none d-lg-block">
              <div className="toc-sidebar">
                <div className="article-progress">
                  <div className="article-progress-label">Postęp czytania</div>
                  <div className="article-progress-bar">
                    <div 
                      className="article-progress-fill" 
                      style={{ width: `${readProgress}%` }}
                    ></div>
                  </div>
                  <div className="article-progress-percent">{Math.round(readProgress)}%</div>
                </div>

                <div className="toc-title">
                  <i className="bi bi-list-ul"></i>
                  Spis treści
                </div>
                <ul className="toc-list">
                  {tocItems.map((item) => (
                    <li key={item.id} className="toc-item">
                      <a
                        href={`#${item.id}`}
                        className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToSection(item.id)
                        }}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className={tocItems.length > 0 ? 'col-lg-9' : 'col-lg-8 mx-auto'}>
            <article className="article-content">
              {(() => {
                if (article.Article) {
                  return (
                    <div dangerouslySetInnerHTML={{ __html: article.Article }} />
                  )
                }
                
                const content = article.Content || article.Sections || []
                
                if (content.length === 0) {
                  return (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle"></i> Treść artykułu jest w trakcie przygotowania.
                    </div>
                  )
                }
                
                if (!article.Content && article.Sections) {
                  return (
                    <div>
                      <h2>Spis treści</h2>
                      <ul>
                        {article.Sections.map((section, index) => (
                          <li key={index}>{section}</li>
                        ))}
                      </ul>
                      <div className="alert alert-info mt-4">
                        <i className="bi bi-info-circle"></i> Pełna treść artykułu będzie wkrótce dostępna.
                      </div>
                    </div>
                  )
                }
                
                return content.map((section, index) => {
                  if (section.startsWith('## ')) {
                    return <h2 key={index}>{section.replace('## ', '')}</h2>
                  } else if (section.startsWith('### ')) {
                    return <h3 key={index}>{section.replace('### ', '')}</h3>
                  } else if (section.includes('\n- ') || section.startsWith('- ')) {
                    const items = section.split('\n').filter(line => line.trim().startsWith('- '))
                    return (
                      <ul key={index}>
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/^- /, '')}</li>
                        ))}
                      </ul>
                    )
                  } else if (section.includes('\n1. ') || section.match(/^\d+\. /)) {
                    const items = section.split('\n').filter(line => line.trim().match(/^\d+\. /))
                    return (
                      <ol key={index}>
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                        ))}
                      </ol>
                    )
                  } else {
                    return <p key={index}>{section}</p>
                  }
                })
              })()}

              {/* FAQ ONLY dla zwykłych artykułów (nie VS) */}
              {!isVsArticle && article.FAQ && article.FAQ.length > 0 && (
                <div className="mt-5" id="faq-section">
                  <h2 className="mb-4" id="faq-heading">
                    <i className="bi bi-question-circle text-primary"></i> Najczęściej zadawane pytania
                  </h2>
                  <div className="accordion" id="faqAccordion">
                    {article.FAQ.map((faq, index) => {
                      const question = faq.Question || faq.q || 'Pytanie'
                      const answer = faq.Answer || faq.a || 'Odpowiedź'
                      
                      return (
                        <div className="accordion-item" key={index}>
                          <h3 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#faq${index}`}
                              aria-expanded="false"
                            >
                              {question}
                            </button>
                          </h3>
                          <div
                            id={`faq${index}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#faqAccordion"
                          >
                            <div className="accordion-body">
                              {answer}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </article>

            <div className="d-flex justify-content-between mt-5 pt-4 border-top">
              <a href={`/category/${categorySlug}/`} className="btn btn-outline-primary">
                <i className="bi bi-arrow-left"></i> Wróć do kategorii
              </a>
              <a href="/" className="btn btn-outline-secondary">
                <i className="bi bi-house"></i> Strona główna
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
