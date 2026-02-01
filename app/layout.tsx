import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MocInformacji.pl - Portal Wiedzy',
  description: 'Twoje źródło sprawdzonej wiedzy z zakresu finansów, prawa, technologii i zdrowia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = [
    { name: 'Finanse', slug: 'finanse', icon: 'bi-bank', color: '#10b981' },
    { name: 'Prawo', slug: 'prawo', icon: 'bi-bank', color: '#3b82f6' },
    { name: 'Technologia', slug: 'technologia', icon: 'bi-cpu', color: '#8b5cf6' },
    { name: 'Zdrowie', slug: 'zdrowie', icon: 'bi-heart-pulse', color: '#ef4444' },
    { name: 'Biznes', slug: 'biznes', icon: 'bi-briefcase', color: '#f59e0b' },
    { name: 'Nieruchomości', slug: 'nieruchomosci', icon: 'bi-house', color: '#06b6d4' },
  ]

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
      <body className={inter.className}>
        {/* MODERN NAVBAR */}
        <nav className="navbar navbar-expand-lg navbar-modern">
          <div className="container-fluid">
            <Link href="/" className="navbar-brand logo-text">
              Moc<span className="text-primary">Informacji</span><span className="domain">.pl</span>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {categories.map(cat => (
                  <li className="nav-item" key={cat.slug}>
                    <Link href={`/category/${cat.slug}`} className="nav-link">
                      <i className={`bi ${cat.icon} me-1`}></i>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        
        {/* Content */}
        {children}
        
        {/* FOOTER */}
        <footer className="footer-modern">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>MocInformacji.pl</h5>
                <p>Twoje źródło sprawdzonej wiedzy z zakresu finansów, prawa, technologii i zdrowia.</p>
              </div>
              <div className="col-md-4">
                <h5>Kategorie</h5>
                <ul>
                  {categories.map(cat => (
                    <li key={cat.slug}>
                      <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-4">
                <h5>Informacje</h5>
                <ul>
                  <li><Link href="/polityka-prywatnosci">Polityka prywatności</Link></li>
                  <li><Link href="/kontakt">Kontakt</Link></li>
                  <li><Link href="/o-nas">O nas</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 MocInformacji.pl. Wszelkie prawa zastrzeżone.</p>
            </div>
          </div>
        </footer>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  )
}