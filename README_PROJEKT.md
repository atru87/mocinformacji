# 📦 MocInformacji.pl - Projekt z AdSense

## 🎉 Co jest w tym archiwum?

To kompletny projekt Next.js z pełną integracją Google AdSense + wszystkie dodatki (ASP.NET, skrypty generowania artykułów, dokumentacja).

## 📂 Struktura projektu

```
mocinformacji-with-adsense/
├── app/                          # Next.js App Router (GŁÓWNY PROJEKT)
│   ├── layout.tsx               # ✅ Layout z AdSense script
│   ├── page.tsx                 # Strona główna
│   ├── [category]/[slug]/       # Strony artykułów
│   ├── category/[category]/     # Strony kategorii
│   └── search/                  # Strona wyszukiwania
│
├── components/                   # Komponenty React
│   └── AdSense.tsx              # ✅ Komponent AdSense (GOTOWY!)
│
├── public/content/              # Artykuły w JSON
│   ├── biznes/                  # 14 artykułów
│   ├── finanse/                 # 18 artykułów
│   ├── prawo/                   # 7 artykułów
│   ├── technologia/             # 15 artykułów
│   ├── zdrowie/                 # 20 artykułów
│   └── nieruchomosci/           # 7 artykułów
│
├── Pages/                       # ASP.NET Razor Pages (BONUS)
│   ├── Shared/_Layout.cshtml   # Layout z fallback images
│   ├── Index.cshtml             # Strona główna ASP.NET
│   ├── DynamicContent.cshtml    # Strona artykułu ASP.NET
│   └── ...
│
├── claude_premium_v11_FINAL.py  # Generator artykułów AI
├── config.json                  # Konfiguracja generatora
├── package.json                 # Dependencies Next.js
│
└── DOKUMENTACJA:
    ├── QUICKSTART_ADSENSE.md    # 🚀 START TUTAJ!
    ├── ADSENSE_STRATEGY.md      # Pełna strategia reklam
    ├── JAK_GENEROWAC_ARTYKULY.md # Guide do generatora
    ├── EXAMPLE_*.tsx            # Przykłady implementacji
    └── README.md                # Ten plik
```

**RAZEM: 81+ artykułów gotowych do publikacji!**

---

## 🚀 Quick Start - Next.js (15 minut)

### 1. Rozpakuj i zainstaluj
```bash
unzip mocinformacji-with-adsense.zip
cd mocinformacji-with-adsense

npm install
```

### 2. Skonfiguruj AdSense
Edytuj `components/AdSense.tsx` (linia 54):
```tsx
// Zmień:
data-ad-client="ca-pub-4321819036207321"

// Na:
data-ad-client="ca-pub-TWOJ-PRAWDZIWY-ID"
```

### 3. Utwórz sloty w Google AdSense
1. Zaloguj się: https://adsense.google.com
2. Utwórz minimum 5 slotów reklamowych
3. Skopiuj Slot IDs

### 4. Dodaj reklamy do stron
Zobacz `QUICKSTART_ADSENSE.md` dla szczegółów.

Krótko:
```tsx
import { AdSenseHorizontal, AdSenseInArticle } from '@/components/AdSense'

// W komponencie:
<AdSenseHorizontal slot="1234567890" />
```

### 5. Uruchom!
```bash
# Development (placeholdery reklam):
npm run dev

# Production (prawdziwe reklamy):
npm run build
npm start
```

Otwórz: http://localhost:3000

---

## 📊 Co już działa?

### ✅ Next.js (app/):
- [x] Routing artykułów (`/[category]/[slug]`)
- [x] Strony kategorii (`/category/[category]`)
- [x] Wyszukiwarka (`/search?q=...`)
- [x] 81+ gotowych artykułów w JSON
- [x] Responsive design
- [x] SEO meta tags
- [x] Bootstrap 5

### ✅ AdSense:
- [x] Script w layout.tsx
- [x] Komponent AdSense.tsx
- [x] 6 typów reklam (Horizontal, InArticle, Sidebar, Square, Sticky, Anchor)
- [x] Development placeholdery
- [x] Responsive ads

### ✅ Bonus - ASP.NET (Pages/):
- [x] Razor Pages (alternatywny backend)
- [x] System fallback obrazów
- [x] Czas czytania zamiast word count
- [x] FAQ accordion
- [x] Breadcrumbs

### ✅ Generator artykułów AI:
- [x] `claude_premium_v11_FINAL.py`
- [x] Generuje artykuły VS (porównawcze)
- [x] Integracja z Claude API
- [x] Obrazy z Unsplash
- [x] FAQ automatyczne

---

## 🎯 Co musisz zrobić?

### Obowiązkowe:
1. [ ] Zmień Publisher ID w `components/AdSense.tsx`
2. [ ] Utwórz sloty reklamowe w Google AdSense
3. [ ] Dodaj komponenty AdSense do stron (zobacz przykłady)
4. [ ] Deploy na hosting (Vercel/Netlify)

### Opcjonalne:
1. [ ] Wygeneruj więcej artykułów (`JAK_GENEROWAC_ARTYKULY.md`)
2. [ ] Dodaj własne kategorie
3. [ ] Dostosuj kolory/style (`app/globals.css`)
4. [ ] Dodaj Analytics
5. [ ] Skonfiguruj domenę

---

## 📚 Dokumentacja

### Przeczytaj w tej kolejności:

1. **`QUICKSTART_ADSENSE.md`** ⭐ - Jak wdrożyć reklamy (15 min)
2. **`ADSENSE_STRATEGY.md`** - Pełna strategia rozmieszczenia
3. **`EXAMPLE_ArticleClient_with_Ads.tsx`** - Przykład artykułu z reklamami
4. **`EXAMPLE_HomePage_with_Ads.tsx`** - Przykład strony głównej
5. **`JAK_GENEROWAC_ARTYKULY.md`** - Jak generować nowe artykuły

---

## 🎨 Customizacja

### Zmiana kolorów:
Edytuj `app/globals.css`:
```css
:root {
  --primary-color: #2563eb;  /* Główny kolor */
  --secondary-color: #0ea5e9;
}
```

### Dodanie kategorii:
1. Utwórz folder: `public/content/nowa-kategoria/`
2. Dodaj do `app/layout.tsx`:
```tsx
const categories = [
  // ... istniejące
  { name: 'Nowa Kategoria', slug: 'nowa-kategoria', icon: 'bi-star', color: '#ff0000' },
]
```

### Zmiana logo:
Edytuj `app/layout.tsx` (linia 36):
```tsx
<Link href="/" className="navbar-brand logo-text">
  TwojaNazwa<span className="text-primary">.pl</span>
</Link>
```

---

## 🚀 Deployment

### Vercel (zalecane - DARMOWE):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify:
```bash
# Build command:
npm run build

# Publish directory:
.next
```

### Własny VPS:
```bash
npm run build
npm start

# Lub z PM2:
pm2 start npm --name "mocinformacji" -- start
```

---

## 📈 Oczekiwane przychody (AdSense)

### Przy 10,000 pageviews/miesiąc:
- **Bez reklam:** $0
- **2-3 reklamy/strona:** ~$80-120/miesiąc
- **5-7 reklam/strona (z tym projektem):** ~$200-350/miesiąc

### Przy 50,000 pageviews/miesiąc:
- **5-7 reklam/strona:** ~$1000-1750/miesiąc

**ROI:** ~150-300% więcej przychodów vs standardowe 2-3 reklamy!

---

## 🆘 Pomoc

### Problem: Reklamy się nie wyświetlają
1. Sprawdź Publisher ID w `components/AdSense.tsx`
2. Sprawdź czy sloty istnieją w Google AdSense
3. Poczekaj 24h (nowe sloty potrzebują aktywacji)
4. Sprawdź Console (F12) - są błędy?

### Problem: Brak artykułów
```bash
# Sprawdź czy folder istnieje:
ls -la public/content/

# Powinno być 81+ plików .json
```

### Problem: Błędy kompilacji Next.js
```bash
# Wyczyść cache:
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📞 Support

- **Dokumentacja Next.js:** https://nextjs.org/docs
- **Google AdSense:** https://support.google.com/adsense
- **Bootstrap:** https://getbootstrap.com/docs/5.3

---

## 🎉 Ready to go!

Masz wszystko czego potrzebujesz:
- ✅ Gotowy projekt Next.js
- ✅ 81+ artykułów
- ✅ Pełna integracja AdSense
- ✅ Generator artykułów AI
- ✅ Dokumentacja
- ✅ Przykłady kodu

**Zaczynajmy zarabiać! 💰**

---

## 📜 License

MIT License - możesz robić z tym co chcesz!

## 🙏 Credits

- Next.js by Vercel
- Bootstrap 5
- Google AdSense
- Claude AI by Anthropic (generator artykułów)

---

**Powodzenia! 🚀**

Masz pytania? Sprawdź dokumentację w plikach `*.md`!
