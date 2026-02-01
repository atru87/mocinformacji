# 🎯 Strategia AdSense dla MocInformacji.pl

## 📋 Spis treści
1. [Konfiguracja podstawowa](#konfiguracja-podstawowa)
2. [Rozmieszczenie reklam](#rozmieszczenie-reklam)
3. [Implementacja per strona](#implementacja-per-strona)
4. [Slot IDs](#slot-ids)
5. [Optymalizacja](#optymalizacja)

---

## 🔧 Konfiguracja podstawowa

### 1. Layout.tsx - GOTOWE ✅

Plik: `app/layout.tsx`

```tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4321819036207321"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {/* ... */}
      </body>
    </html>
  )
}
```

**✅ To jest już zrobione** - skrypt AdSense załaduje się automatycznie na każdej stronie.

---

### 2. Komponent AdSense - GOTOWY ✅

Plik: `components/AdSense.tsx`

Dostępne komponenty:
- `AdSenseHorizontal` - reklama pozioma (po treści, między sekcjami)
- `AdSenseInArticle` - reklama in-article (w środku tekstu)
- `AdSenseSidebar` - reklama sidebar (sticky, 300x600)
- `AdSenseSquare` - reklama kwadrat (300x250)
- `AdSenseStickyBottom` - przyklejona na dole (mobile)
- `AdSenseAnchor` - przyklejona na górze (desktop)

---

## 📍 Rozmieszczenie reklam na stronach

### **Strona główna (app/page.tsx)**

```tsx
import { AdSenseHorizontal, AdSenseSquare } from '@/components/AdSense'

export default function Home() {
  return (
    <>
      {/* 1. Hero Section - Sidebar Square (desktop) lub Horizontal (mobile) */}
      <div className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              {/* Treść Hero */}
            </div>
            <div className="col-lg-6">
              {/* REKLAMA 1 */}
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

      {/* REKLAMA 2: Po hero section */}
      <AdSenseHorizontal slot="2222222222" />

      {/* Stats Section */}
      <div className="stats-section">
        {/* ... */}
      </div>

      {/* Latest Articles - 6 kart */}
      <div className="container py-5">
        <h2>Najnowsze artykuły</h2>
        <div className="row">
          {/* 6 kart artykułów */}
        </div>
      </div>

      {/* REKLAMA 3: Po pierwszych artykułach */}
      <AdSenseHorizontal slot="3333333333" />

      {/* Categories - 3 sekcje po 4 artykuły */}
      {Object.entries(categories).map((cat, index) => (
        <div key={index}>
          <h2>{cat.name}</h2>
          <div className="row">
            {/* 4 artykuły */}
          </div>
          
          {/* REKLAMA 4: Co drugą kategorię */}
          {index % 2 === 1 && <AdSenseHorizontal slot={`444444444${index}`} />}
        </div>
      ))}

      {/* REKLAMA 5: Przed CTA */}
      <AdSenseHorizontal slot="5555555555" />

      {/* CTA Section */}
      <div className="cta-section">
        {/* ... */}
      </div>
    </>
  )
}
```

**Rezultat: 5-7 reklam na stronie głównej**

---

### **Strona kategorii (app/category/[category]/page.tsx)**

```tsx
import { AdSenseHorizontal, AdSenseSidebar } from '@/components/AdSense'

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <div className="container py-5">
      <div className="row">
        {/* Main Content - 8 kolumn */}
        <div className="col-lg-8">
          {/* Category Header */}
          <div className="category-header">
            <h1>{categoryInfo.name}</h1>
            <p>{categoryInfo.description}</p>
          </div>

          {/* REKLAMA 1: Po nagłówku kategorii */}
          <AdSenseHorizontal slot="6666666661" />

          {/* Articles Grid */}
          <div className="row g-4">
            {articles.map((article, index) => (
              <div key={index} className="col-md-6">
                <ArticleCard article={article} />
                
                {/* REKLAMA 2: Co 6 artykułów */}
                {(index + 1) % 6 === 0 && (
                  <AdSenseHorizontal slot={`6666666${Math.floor(index/6)+2}`} />
                )}
              </div>
            ))}
          </div>

          {/* REKLAMA 3: Na końcu listy */}
          <AdSenseHorizontal slot="6666666669" />
        </div>

        {/* Sidebar - 4 kolumny */}
        <div className="col-lg-4 d-none d-lg-block">
          {/* REKLAMA SIDEBAR: Sticky */}
          <AdSenseSidebar slot="7777777777" />
          
          {/* Related Categories */}
          <div className="mt-4">
            <h5>Powiązane kategorie</h5>
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Rezultat: 4-8 reklam (zależnie od liczby artykułów) + sticky sidebar**

---

### **Strona artykułu (app/[category]/[slug]/ArticleClient.tsx)**

```tsx
'use client'

import { AdSenseHorizontal, AdSenseInArticle, AdSenseSidebar, AdSenseStickyBottom } from '@/components/AdSense'

export default function ArticleClient({ article, categoryMeta }: Props) {
  // Podziel treść artykułu na sekcje
  const articleSections = splitArticleIntoSections(article.Article)
  
  return (
    <>
      {/* Featured Image */}
      <div className="featured-image">
        <img src={featuredImage} alt={article.Title} />
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Main Content - 8 kolumn */}
          <div className="col-lg-8">
            {/* Article Header */}
            <header className="article-header">
              <nav className="breadcrumb">
                <Link href="/">Home</Link> / 
                <Link href={`/category/${categorySlug}`}>{categoryMeta.name}</Link> / 
                {article.Title}
              </nav>
              <h1>{article.H1}</h1>
              <div className="article-meta">
                <span>{formatDate(article.LastModified)}</span>
                <span>{readingTime} min czytania</span>
              </div>
            </header>

            {/* REKLAMA 1: Po nagłówku, przed treścią */}
            <AdSenseHorizontal slot="8888888881" />

            {/* Article Content z reklamami IN-ARTICLE */}
            <div className="article-content">
              {/* Sekcja 1 */}
              <div dangerouslySetInnerHTML={{ __html: articleSections[0] }} />
              
              {/* REKLAMA 2: Po 1 sekcji (około 25% artykułu) */}
              {articleSections.length > 1 && (
                <AdSenseInArticle slot="8888888882" />
              )}

              {/* Sekcja 2 */}
              {articleSections[1] && (
                <div dangerouslySetInnerHTML={{ __html: articleSections[1] }} />
              )}

              {/* REKLAMA 3: Po 2 sekcji (około 50% artykułu) */}
              {articleSections.length > 2 && (
                <AdSenseInArticle slot="8888888883" />
              )}

              {/* Sekcja 3 */}
              {articleSections[2] && (
                <div dangerouslySetInnerHTML={{ __html: articleSections[2] }} />
              )}

              {/* Pozostałe sekcje bez reklam */}
              {articleSections.slice(3).map((section, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: section }} />
              ))}
            </div>

            {/* REKLAMA 4: Po treści, przed FAQ */}
            <AdSenseHorizontal slot="8888888884" />

            {/* FAQ Section */}
            {article.FAQ && article.FAQ.length > 0 && (
              <div className="faq-section">
                <h2 id="faq-heading">Najczęściej zadawane pytania</h2>
                {article.FAQ.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h3>{faq.Question || faq.q}</h3>
                    <p>{faq.Answer || faq.a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* REKLAMA 5: Po FAQ */}
            <AdSenseHorizontal slot="8888888885" />

            {/* Related Articles */}
            <div className="related-articles">
              <h3>Powiązane artykuły</h3>
              {/* ... */}
            </div>
          </div>

          {/* Sidebar - 4 kolumny (desktop only) */}
          <div className="col-lg-4 d-none d-lg-block">
            {/* Table of Contents (sticky) */}
            <div className="toc-wrapper" style={{ position: 'sticky', top: '80px' }}>
              <h5>Spis treści</h5>
              <ul>
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* REKLAMA SIDEBAR 1: Pod TOC */}
            <div className="mt-4">
              <AdSenseSidebar slot="9999999991" />
            </div>

            {/* Newsletter Box */}
            <div className="mt-4 newsletter-box">
              <h5>Newsletter</h5>
              {/* ... */}
            </div>

            {/* REKLAMA SIDEBAR 2: Pod newsletter */}
            <div className="mt-4">
              <AdSenseSidebar slot="9999999992" />
            </div>
          </div>
        </div>
      </div>

      {/* REKLAMA STICKY BOTTOM: Mobile only */}
      <AdSenseStickyBottom slot="0000000001" />

      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${readProgress}%` }} />
    </>
  )
}

// Helper function: podziel artykuł na sekcje po <h2>
function splitArticleIntoSections(articleHtml: string): string[] {
  const sections: string[] = []
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = articleHtml
  
  let currentSection = ''
  const children = Array.from(tempDiv.children)
  
  children.forEach((child) => {
    if (child.tagName === 'H2') {
      if (currentSection) sections.push(currentSection)
      currentSection = child.outerHTML
    } else {
      currentSection += child.outerHTML
    }
  })
  
  if (currentSection) sections.push(currentSection)
  
  return sections
}
```

**Rezultat: 5-7 reklam w treści + 1-2 sidebar + 1 sticky bottom (mobile) = 7-10 reklam total**

---

### **Strona wyszukiwania (app/search/page.tsx)**

```tsx
import { AdSenseHorizontal } from '@/components/AdSense'

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  return (
    <div className="container py-5">
      <h1>Wyniki wyszukiwania: "{searchParams.q}"</h1>

      {/* REKLAMA 1: Po nagłówku */}
      <AdSenseHorizontal slot="1010101010" />

      {/* Search Results */}
      <div className="search-results">
        {results.map((result, index) => (
          <div key={index}>
            <SearchResultCard result={result} />
            
            {/* REKLAMA 2: Co 5 wyników */}
            {(index + 1) % 5 === 0 && (
              <AdSenseHorizontal slot={`101010101${index}`} />
            )}
          </div>
        ))}
      </div>

      {/* REKLAMA 3: Na końcu wyników */}
      <AdSenseHorizontal slot="1010101019" />
    </div>
  )
}
```

**Rezultat: 3-6 reklam (zależnie od liczby wyników)**

---

## 🎰 Slot IDs - Mapa wszystkich reklam

Musisz utworzyć te sloty w Google AdSense:

### Strona główna (5-7 slotów)
```
1111111111 - Hero Square (desktop)
1111111112 - Hero Horizontal (mobile)
2222222222 - Po hero
3333333333 - Po najnowszych artykułach
4444444441 - Po kategorii 1
4444444442 - Po kategorii 3
5555555555 - Przed CTA
```

### Strona kategorii (4-8 slotów)
```
6666666661 - Po nagłówku kategorii
6666666662 - Co 6 artykułów (1)
6666666663 - Co 6 artykułów (2)
6666666669 - Na końcu listy
7777777777 - Sidebar sticky
```

### Strona artykułu (7-10 slotów)
```
8888888881 - Po nagłówku
8888888882 - In-article 25%
8888888883 - In-article 50%
8888888884 - Po treści, przed FAQ
8888888885 - Po FAQ
9999999991 - Sidebar 1
9999999992 - Sidebar 2
0000000001 - Sticky bottom (mobile)
```

### Strona wyszukiwania (3-6 slotów)
```
1010101010 - Po nagłówku
1010101011 - Co 5 wyników (1)
1010101012 - Co 5 wyników (2)
1010101019 - Na końcu
```

---

## 📊 Podsumowanie rozmieszczenia

| Strona | Liczba reklam | Typy |
|--------|---------------|------|
| **Strona główna** | 5-7 | Horizontal, Square |
| **Kategoria** | 4-8 + sidebar | Horizontal, Sidebar sticky |
| **Artykuł** | 7-10 | Horizontal, In-article, Sidebar, Sticky bottom |
| **Wyszukiwanie** | 3-6 | Horizontal |

**Średnio: 5-9 reklam per strona**

---

## ⚡ Optymalizacja

### 1. Lazy loading
```tsx
// Reklamy poniżej fold ładuj z opóźnieniem
<AdSenseHorizontal slot="..." className="lazy-ad" />
```

### 2. Responsive design
```tsx
// Desktop: Sidebar
<div className="d-none d-lg-block">
  <AdSenseSidebar slot="..." />
</div>

// Mobile: Horizontal
<div className="d-lg-none">
  <AdSenseHorizontal slot="..." />
</div>
```

### 3. Development mode
Komponenty automatycznie pokazują placeholder w trybie development:
```
[AdSense Placeholder]
Slot: 1234567890 | Format: horizontal
```

### 4. Error handling
Każdy komponent ma wbudowany try-catch:
```tsx
try {
  (window.adsbygoogle = window.adsbygoogle || []).push({})
} catch (err) {
  console.log('AdSense error:', err)
}
```

---

## 🚀 Jak wdrożyć

### Krok 1: Utwórz sloty w Google AdSense
1. Zaloguj się do https://adsense.google.com
2. Ads → By ad unit → Display ads
3. Utwórz sloty według tabeli powyżej
4. Skopiuj Slot IDs

### Krok 2: Zaktualizuj komponenty
1. Podmień `slot="1234567890"` na prawdziwe Slot IDs
2. Upewnij się że `ca-pub-4321819036207321` to Twój Publisher ID

### Krok 3: Zaimplementuj reklamy
1. Dodaj importy w każdej stronie:
```tsx
import { AdSenseHorizontal, AdSenseInArticle, AdSenseSidebar } from '@/components/AdSense'
```

2. Wstaw komponenty według strategii powyżej

### Krok 4: Testuj
1. `npm run dev` - sprawdź placeholdery
2. `npm run build && npm start` - sprawdź prawdziwe reklamy
3. Użyj Google AdSense → Sites → Check ads.txt

---

## 📈 Oczekiwane wyniki

### RPM (Revenue Per Mille) - szacunki
- **Polska:** $2-5 RPM (średnio)
- **Finanse/Prawo:** $5-10 RPM (wyższe stawki)
- **Technologia:** $3-7 RPM
- **Zdrowie:** $4-8 RPM

### Przykładowe przychody (przy 10,000 wyświetleń/miesiąc)
```
10,000 pageviews × 7 ads per page = 70,000 impressions
70,000 × $4 RPM / 1000 = $280/miesiąc
```

### Zwiększenie przychodów o 50-80%
Dzięki strategicznemurozmieszczeniu reklam:
- Przed: 2-3 reklamy per strona
- Po: 5-9 reklam per strona
- **Rezultat: +150-300% więcej impressions**

---

## ✅ Checklist wdrożenia

- [ ] Layout.tsx ma AdSense script
- [ ] Komponent AdSense.tsx działa
- [ ] Utworzone sloty w Google AdSense
- [ ] Zaktualizowane Slot IDs w komponentach
- [ ] Zaimplementowane reklamy na:
  - [ ] Stronie głównej
  - [ ] Stronach kategorii
  - [ ] Stronach artykułów
  - [ ] Stronie wyszukiwania
- [ ] Przetestowane w development
- [ ] Przetestowane w production
- [ ] Dodany ads.txt do public/

---

## 🎯 Gotowe pliki do wgrania

Wszystkie zaktualizowane pliki są w `/mnt/user-data/outputs/`:

1. `components/AdSense.tsx` - Komponent reklam
2. `app/layout.tsx` - Layout z AdSense script
3. Ten dokument - Strategia implementacji

**Powodzenia! 🚀💰**
