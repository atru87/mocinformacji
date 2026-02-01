# 🚀 AdSense - Quick Start Guide

## ⚡ Najszybsza implementacja (5 kroków)

### Krok 1: Kopiuj pliki ✅
```bash
# Skopiuj te 2 pliki do swojego projektu:
cp /outputs/components/AdSense.tsx ./components/
cp /outputs/app/layout.tsx ./app/
```

### Krok 2: Zmień Publisher ID ✏️
W pliku `components/AdSense.tsx` linia 54:
```tsx
// BYŁO:
data-ad-client="ca-pub-4321819036207321"

// ZMIEŃ NA:
data-ad-client="ca-pub-TWOJ-PRAWDZIWY-ID"
```

### Krok 3: Utwórz sloty w AdSense 🎰
1. Zaloguj się: https://adsense.google.com
2. Ads → By ad unit → Display ads
3. Utwórz minimum 5 slotów:

| Nazwa | Format | Gdzie |
|-------|--------|-------|
| Homepage Hero | Square 300x250 | Strona główna - hero |
| Article Top | Horizontal | Artykuł - po nagłówku |
| Article InArticle | In-article | Artykuł - w treści |
| Sidebar | Vertical 300x600 | Artykuł - sidebar |
| Category Top | Horizontal | Kategoria - po nagłówku |

4. Skopiuj Slot IDs (np. "1234567890")

### Krok 4: Dodaj reklamy do stron 📝

#### A. Strona główna (`app/page.tsx`)
```tsx
import { AdSenseHorizontal, AdSenseSquare } from '@/components/AdSense'

// W hero section:
<AdSenseSquare slot="TWOJ-SLOT-ID-1" />

// Po sekcjach:
<AdSenseHorizontal slot="TWOJ-SLOT-ID-2" />
```

#### B. Strona artykułu (`app/[category]/[slug]/ArticleClient.tsx`)
```tsx
import { AdSenseHorizontal, AdSenseInArticle, AdSenseSidebar } from '@/components/AdSense'

// Po nagłówku:
<AdSenseHorizontal slot="TWOJ-SLOT-ID-3" />

// W treści (co 2-3 sekcje):
<AdSenseInArticle slot="TWOJ-SLOT-ID-4" />

// Sidebar:
<AdSenseSidebar slot="TWOJ-SLOT-ID-5" />
```

#### C. Strona kategorii (`app/category/[category]/page.tsx`)
```tsx
import { AdSenseHorizontal, AdSenseSidebar } from '@/components/AdSense'

// Po nagłówku:
<AdSenseHorizontal slot="TWOJ-SLOT-ID-6" />

// Sidebar:
<AdSenseSidebar slot="TWOJ-SLOT-ID-7" />
```

### Krok 5: Testuj 🧪
```bash
# Development (pokażą się placeholdery):
npm run dev

# Production (prawdziwe reklamy):
npm run build
npm start
```

---

## ✅ Checklist wdrożenia

### Przed wdrożeniem:
- [ ] Mam aktywne konto Google AdSense
- [ ] Moja strona jest dodana w AdSense
- [ ] Mam Publisher ID (ca-pub-XXXXXXXXXX)
- [ ] Stworzyłem minimum 5 slotów reklamowych

### Pliki do wgrania:
- [ ] `components/AdSense.tsx` - skopiowane i zmodyfikowane (Publisher ID)
- [ ] `app/layout.tsx` - skopiowane (ma AdSense script)
- [ ] Przejrzałem przykłady implementacji

### Implementacja per strona:
- [ ] Strona główna - 3-5 reklam
- [ ] Strona kategorii - 2-3 reklamy + sidebar
- [ ] Strona artykułu - 5-7 reklam + sidebar
- [ ] Strona wyszukiwania - 2-3 reklamy

### Po wdrożeniu:
- [ ] Przetestowane w development mode (placeholdery widoczne)
- [ ] Przetestowane w production mode (reklamy działają)
- [ ] Sprawdzony plik `ads.txt` w Google Search Console
- [ ] Pierwsza reklama wyświetliła się poprawnie
- [ ] Brak błędów w konsoli przeglądarki

---

## 📊 Przykładowe rozmieszczenie (zalecane minimum)

### Strona główna (5 reklam):
1. Hero section - Square (desktop) / Horizontal (mobile)
2. Po stats section
3. Po najnowszych artykułach
4. Co drugą kategorię
5. Przed CTA

### Strona artykułu (7 reklam):
1. Po nagłówku
2. Po 1 sekcji treści (25%)
3. Po 2 sekcji treści (50%)
4. Przed FAQ
5. Po FAQ
6. Sidebar #1
7. Sidebar #2

### Strona kategorii (4 reklamy):
1. Po nagłówku
2. Co 6 artykułów
3. Na końcu listy
4. Sidebar sticky

---

## 🎯 Slot IDs - Rekomendowane nazewnictwo

Aby łatwiej zarządzać, użyj opisowych nazw slotów:

```
Homepage_Hero_Square
Homepage_AfterStats
Homepage_AfterLatest
Article_Top_Horizontal
Article_InContent_25percent
Article_InContent_50percent
Article_Sidebar_Top
Article_Sidebar_Bottom
Category_Top_Horizontal
Category_Sidebar
Search_Top_Horizontal
```

W kodzie:
```tsx
<AdSenseHorizontal slot="1234567890" /> // Homepage_Hero_Square
<AdSenseInArticle slot="2345678901" />  // Article_InContent_25percent
```

---

## 🔥 Pro Tips

### 1. Nie przesadzaj
- **Minimum:** 3-5 reklam per strona
- **Optymalnie:** 5-7 reklam per strona
- **Maksimum:** 10 reklam per strona (nie przekraczaj!)

### 2. Responsive design
```tsx
{/* Desktop: Square */}
<div className="d-none d-lg-block">
  <AdSenseSquare slot="..." />
</div>

{/* Mobile: Horizontal */}
<div className="d-lg-none">
  <AdSenseHorizontal slot="..." />
</div>
```

### 3. In-article ads
Najlepiej działają gdy są:
- Po 20-30% treści
- Po 50% treści
- Między naturalnymi przerwami (po sekcji/nagłówku)

### 4. Sticky sidebar
```tsx
<div style={{ position: 'sticky', top: '80px' }}>
  <AdSenseSidebar slot="..." />
</div>
```

### 5. Development mode
Automatyczne placeholdery - nie musisz nic robić!
```
[AdSense Placeholder]
Slot: 1234567890 | Format: horizontal
```

---

## ⚠️ Częste błędy

### ❌ Błąd 1: Brak AdSense script w layout
```tsx
// ❌ ŹLE - brak scriptu
<html>
  <body>{children}</body>
</html>

// ✅ DOBRZE - script w <head>
<html>
  <head>
    <Script src="..." />
  </head>
  <body>{children}</body>
</html>
```

### ❌ Błąd 2: Zły Publisher ID
```tsx
// ❌ ŹLE
data-ad-client="ca-pub-4321819036207321" // przykładowy

// ✅ DOBRZE
data-ad-client="ca-pub-1234567890123456" // twój prawdziwy
```

### ❌ Błąd 3: Duplikaty slot ID
```tsx
// ❌ ŹLE - ten sam slot 2x
<AdSenseHorizontal slot="1111111111" />
<AdSenseHorizontal slot="1111111111" />

// ✅ DOBRZE - różne sloty
<AdSenseHorizontal slot="1111111111" />
<AdSenseHorizontal slot="2222222222" />
```

### ❌ Błąd 4: Brak importu
```tsx
// ❌ ŹLE
export default function Page() {
  return <AdSenseHorizontal /> // undefined!
}

// ✅ DOBRZE
import { AdSenseHorizontal } from '@/components/AdSense'

export default function Page() {
  return <AdSenseHorizontal slot="..." />
}
```

---

## 📈 Oczekiwane rezultaty

### Po 1 tygodniu:
- Reklamy wyświetlają się poprawnie
- Pierwsze kilka centów w AdSense
- Brak błędów w Policy Center

### Po 1 miesiącu (przy 10,000 pageviews):
- **Impressions:** ~50,000-70,000 (5-7 ads per page)
- **RPM:** $2-5 (Polska, mixed content)
- **Przychody:** $100-350/miesiąc

### Po 3 miesiącach:
- Optymalizacja placement (A/B testing)
- RPM wzrasta do $4-8
- Stabilne przychody

---

## 🆘 Pomoc

### Reklamy się nie wyświetlają?
1. Sprawdź Console (F12) - są błędy?
2. Sprawdź czy Publisher ID jest poprawny
3. Sprawdź czy sloty istnieją w AdSense
4. Poczekaj 24h (nowe sloty potrzebują czasu)

### Placeholdery w production?
```bash
# Sprawdź czy buildowałeś:
npm run build
npm start

# NIE:
npm run dev
```

### Niskie RPM?
- Dodaj więcej reklam (5-7 per page)
- Użyj Auto Ads jako dodatek
- Testuj różne formaty
- Sprawdź czy treść jest "advertiser-friendly"

---

## 📚 Pliki pomocnicze

W folderze `/outputs/` znajdziesz:

1. **ADSENSE_STRATEGY.md** - Pełna strategia (czytaj to!)
2. **components/AdSense.tsx** - Komponent reklam
3. **app/layout.tsx** - Layout z AdSense script
4. **EXAMPLE_ArticleClient_with_Ads.tsx** - Przykład artykułu
5. **EXAMPLE_Homepage_with_Ads.tsx** - Przykład strony głównej
6. **EXAMPLE_CategoryPage_with_Ads.tsx** - Przykład kategorii
7. **QUICKSTART.md** - Ten plik

---

## 🎉 Gotowe!

Mając te pliki, możesz wdrożyć AdSense w **15 minut**:

1. Kopiuj `AdSense.tsx` i `layout.tsx`
2. Zmień Publisher ID
3. Utwórz sloty
4. Dodaj komponenty do stron
5. Deploy!

**Powodzenia! 💰📈**
