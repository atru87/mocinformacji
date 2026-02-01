# 💰 MONETYZACJA - Przewodnik po reklamach

## Najlepsze opcje dla Twojej strony:

### 1. **Google AdSense** ⭐ NAJLEPSZA OPCJA
**Zalecane dla: Początkujących i średnio zaawansowanych**

#### Zalety:
- ✅ Najprostsze w implementacji
- ✅ Automatyczne dopasowanie reklam
- ✅ Wypłaty od 100$
- ✅ Sprawdzone i bezpieczne
- ✅ Płaci najlepiej dla polskiego ruchu

#### Wady:
- ❌ Wymaga akceptacji (review 1-2 tygodnie)
- ❌ Potrzebujesz ~1000 odwiedzin/dzień dla dobrych zarobków

#### Jak zaimplementować:
1. Zarejestruj się na https://adsense.google.com
2. Dodaj domenę i poczekaj na akceptację
3. Skopiuj kod AdSense
4. Wklej do `app/layout.tsx` w sekcji `<head>`
5. Dodaj miejsca na reklamy w artykułach

#### Przewidywane zarobki (Polska):
- 1,000 odwiedzin/dzień: ~$3-10/dzień (~100-300 zł/miesiąc)
- 5,000 odwiedzin/dzień: ~$15-50/dzień (~500-1500 zł/miesiąc)
- 10,000 odwiedzin/dzień: ~$30-100/dzień (~1000-3000 zł/miesiąc)

---

### 2. **PropellerAds** ⭐ ALTERNATYWA
**Zalecane dla: Mniejszych stron, akceptują szybko**

#### Zalety:
- ✅ Akceptują prawie każdego
- ✅ Wypłaty od 5$
- ✅ Push notifications
- ✅ Szybka akceptacja (24h)

#### Wady:
- ❌ Mniej płacą niż AdSense
- ❌ Bardziej nachalne reklamy
- ❌ Gorsza jakość reklam

---

### 3. **Ezoic** ⭐⭐ DLA WIĘKSZYCH STRON
**Zalecane dla: 10,000+ odwiedzin/miesiąc**

#### Zalety:
- ✅ AI optymalizuje zarobki
- ✅ Płaci więcej niż AdSense (często 2x)
- ✅ Zaawansowana analityka
- ✅ Partner Google

#### Wady:
- ❌ Wymaga minimum 10k sesji/miesiąc
- ❌ Bardziej skomplikowana integracja
- ❌ Dodaje własny DNS

---

### 4. **Affiliate Marketing** 💰 OPCJONALNIE
**Polecane programy dla Twojej tematyki:**

#### Finanse:
- **Revolut** - 15-50 PLN za polecenie
- **Allegro** - prowizja 1-8%
- **Booking.com** - 25-40% prowizji

#### Technologia:
- **Amazon Associates** - 1-10% prowizji
- **AliExpress** - 3-10% prowizji
- **Morele.net** - prowizje do 5%

#### Zdrowie:
- **iHerb** - 5-10% prowizji
- **Sferis.pl** - 3-7% prowizji

---

## 📋 IMPLEMENTACJA KROK PO KROKU

### Google AdSense - ZALECANE!

#### 1. Zarejestruj się i czekaj na akceptację

#### 2. Po akceptacji, dodaj kod do `app/layout.tsx`:

```typescript
<head>
  {/* ... inne tagi */}
  
  {/* Google AdSense */}
  <script 
    async 
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-TWOJ-KOD-TUTAJ"
    crossOrigin="anonymous"
  />
</head>
```

#### 3. Stwórz komponent reklamy: `components/AdSense.tsx`

```typescript
'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  format?: string
  style?: React.CSSProperties
}

export default function AdSense({ slot, format = 'auto', style }: AdSenseProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (err) {
      console.log('AdSense error:', err)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-TWOJ-KOD-TUTAJ"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
```

#### 4. Dodaj reklamy w artykułach: `app/[category]/[slug]/ArticleClient.tsx`

```typescript
import AdSense from '@/components/AdSense'

// Na początku artykułu (po obrazku):
<div className="my-4">
  <AdSense slot="1234567890" />
</div>

// W środku treści (po 3 paragrafach):
<div className="my-4">
  <AdSense slot="0987654321" />
</div>

// Na końcu artykułu:
<div className="my-4">
  <AdSense slot="1122334455" format="rectangle" />
</div>
```

#### 5. Dodaj reklamy na stronie głównej:

```typescript
// Po kategorii (co 6 artykułów):
{index % 6 === 5 && (
  <div className="col-12 my-4">
    <AdSense slot="5544332211" />
  </div>
)}
```

---

## 💡 NAJLEPSZE PRAKTYKI

### 1. Miejsca na reklamy (od najlepszych):
1. ⭐⭐⭐ **Nad treścią** - zaraz po featured image
2. ⭐⭐⭐ **W sidebar** - sticky podczas scrollowania
3. ⭐⭐ **W środku artykułu** - po 2-3 paragrafach
4. ⭐⭐ **Na końcu artykułu** - przed FAQ
5. ⭐ **W liście artykułów** - co 6 artykułów

### 2. Nie przesadzaj!
- ❌ Maksymalnie 3-4 reklamy na stronę
- ❌ Unikaj reklam przed treścią
- ✅ Użyj `ad-placeholder` podczas developmentu

### 3. Optymalizuj:
- Użyj lazy loading dla reklam
- Testuj różne miejsca (A/B testing w AdSense)
- Monitoruj CTR (Click-Through Rate)

---

## 📊 OCZEKIWANE ZAROBKI

### Scenariusz realny dla Polski:

**Mała strona** (500 odwiedzin/dzień):
- AdSense: ~50-150 zł/miesiąc
- + Affiliate: ~50-100 zł/miesiąc
- **RAZEM: ~100-250 zł/miesiąc**

**Średnia strona** (2,000 odwiedzin/dzień):
- AdSense: ~300-600 zł/miesiąc
- + Affiliate: ~200-400 zł/miesiąc
- **RAZEM: ~500-1000 zł/miesiąc**

**Duża strona** (10,000 odwiedzin/dzień):
- AdSense: ~1500-3000 zł/miesiąc
- + Ezoic (zamiast AdSense): ~3000-6000 zł/miesiąc
- + Affiliate: ~1000-2000 zł/miesiąc
- **RAZEM: ~4000-8000 zł/miesiąc**

---

## 🚀 ZACZNIJ OD TEGO:

1. ✅ Zbuduj traffic (minimum 500 odwiedzin/dzień)
2. ✅ Aplikuj do Google AdSense
3. ✅ Czekaj na akceptację (1-2 tygodnie)
4. ✅ Implementuj reklamy (użyj powyższego kodu)
5. ✅ Monitoruj i optymalizuj
6. ✅ Po 10k odwiedzin/miesiąc - rozważ Ezoic

---

## 📞 POMOC

### Gdzie szukać pomocy:
- Google AdSense Help Center
- Forum AdSense na Reddit
- Grupy Facebook dla wydawców

### Wskazówki:
- Nie klikaj własnych reklam (ban!)
- Nie proś innych o klikanie (ban!)
- Czytaj policy AdSense

---

**Powodzenia z monetyzacją! 💰**

_P.S. Zacznij od AdSense. Jak będziesz miał 10k+ odwiedzin/dzień, to przejdź na Ezoic._
