# MocInformacji.pl - Next.js

Portal informacyjny z artykułami generowanymi przez AI. Teraz w wersji Next.js ze statycznym exportem!

## 🚀 Cechy

- ✅ **Darmowy hosting** - Deploy na Vercel/Netlify za darmo!
- ✅ **Skrypty Python** - Automatyczne generowanie artykułów przez AI
- ✅ **Zero bazy danych** - Wszystko w plikach JSON
- ✅ **SEO-friendly** - Statyczny HTML dla lepszego SEO
- ✅ **Ultra szybki** - Statyczna strona ładuje się błyskawicznie
- ✅ **Responsive** - Działa na wszystkich urządzeniach

## 📋 Wymagania

### Dla strony (Next.js):
- Node.js 18+ (pobierz z https://nodejs.org/)
- npm lub yarn

### Dla generatora artykułów (Python):
- Python 3.8+
- pip (menadżer pakietów Python)

## 🔧 Instalacja lokalnie (krok po kroku)

### 1. Zainstaluj Node.js
Pobierz i zainstaluj Node.js LTS z: https://nodejs.org/
Sprawdź czy zainstalowane:
```bash
node --version
npm --version
```

### 2. Pobierz projekt
Wypakuj ZIP lub sklonuj repozytorium.

### 3. Zainstaluj zależności Next.js
Otwórz terminal w folderze projektu i wykonaj:
```bash
npm install
```

### 4. Zainstaluj Python (jeśli chcesz generować artykuły)
Pobierz z: https://www.python.org/downloads/

Zainstaluj wymagane biblioteki:
```bash
pip install anthropic pytrends feedparser requests praw
```

### 5. Konfiguracja kluczy API (dla generatora)
Skopiuj `keys.config.example` do `keys.config` i dodaj swoje klucze:
```
ANTHROPIC_API_KEY=sk-ant-twoj-klucz
```

## 🎯 Uruchamianie lokalnie

### Tryb deweloperski (z hot reload):
```bash
npm run dev
```
Otwórz: http://localhost:3000

### Tryb produkcyjny (build + preview):
```bash
npm run build
npm start
```

## 🤖 Generowanie artykułów

### Użyj skryptów Python aby wygenerować nowe artykuły:

```bash
# Generuj 10 artykułów
python claude_premium_v10.py --count 10

# Lub użyj CLI
python cli.py generate --count 5 --category finanse
```

Nowe artykuły pojawią się w `public/content/[kategoria]/`

## 📦 Deploy na Vercel (DARMOWY!)

### Sposób 1: Przez GitHub (ZALECANY)
1. Wrzuć kod na GitHub
2. Idź na https://vercel.com
3. Zaimportuj swoje repo z GitHub
4. Vercel automatycznie zbuduje i wdroży!

### Sposób 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Sposób 3: Netlify
1. Zbuduj lokalnie: `npm run build`
2. Folder `out/` wyślij na Netlify
3. Gotowe!

## 📂 Struktura projektu

```
mocinformacji-nextjs/
├── app/                      # Strony Next.js
│   ├── layout.tsx           # Layout główny (navbar, footer)
│   ├── page.tsx             # Strona główna
│   ├── [category]/[slug]/   # Dynamiczne strony artykułów
│   └── category/[category]/ # Strony kategorii
├── public/
│   └── content/             # Artykuły w JSON
│       ├── finanse/
│       ├── prawo/
│       ├── technologia/
│       └── ...
├── *.py                     # Skrypty generujące (Python)
├── package.json             # Konfiguracja Node.js
└── next.config.js           # Konfiguracja Next.js
```

## 🛠️ Dodawanie nowych artykułów ręcznie

Stwórz plik JSON w `public/content/[kategoria]/[slug].json`:

```json
{
  "Title": "Tytuł artykułu",
  "H1": "Nagłówek H1",
  "MetaDescription": "Opis meta",
  "LastModified": "2024-01-29",
  "Content": [
    "## Wprowadzenie",
    "Pierwszy paragraf...",
    "## Sekcja 1",
    "Treść sekcji 1...",
    "- Punkt 1",
    "- Punkt 2"
  ],
  "FAQ": [
    {
      "Question": "Pytanie 1?",
      "Answer": "Odpowiedź 1"
    }
  ]
}
```

Przebuduj stronę:
```bash
npm run build
```

## 🎨 Customizacja

### Zmiana kolorów kategorii
Edytuj `app/page.tsx` i `app/category/[category]/page.tsx`:
```typescript
const categoryInfo = {
  finanse: { name: 'Finanse', icon: 'bi-cash-coin', color: '#28a745' },
  // ... zmień kolory tutaj
}
```

### Zmiana stylów
Edytuj `app/globals.css`

## 🔍 SEO

Projekt automatycznie generuje:
- ✅ Meta tagi dla każdej strony
- ✅ Sitemap.xml (po deploy)
- ✅ Robots.txt
- ✅ Semantyczny HTML
- ✅ Open Graph tags

## 💰 Koszty

### Hosting strony: **0 zł**
- Vercel: Darmowy plan
- Netlify: Darmowy plan

### Domena: **~20-65 zł/rok**
- Rejestracja: ~17-25 zł
- Odnowienie: ~50-65 zł

### RAZEM: **20-65 zł/rok!** 🎉

## 🐛 Rozwiązywanie problemów

### "Cannot find module 'next'"
```bash
npm install
```

### "Port 3000 is already in use"
```bash
# Znajdź i zabij proces:
# Windows:
netstat -ano | findstr :3000
taskkill /PID [numer_procesu] /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Błąd podczas buildu
```bash
# Wyczyść cache i przebuduj:
rm -rf .next
rm -rf out
npm run build
```

## 📞 Wsparcie

Problemy? Pytania?
- Sprawdź dokumentację Next.js: https://nextjs.org/docs
- Python issues: Sprawdź czy masz wszystkie biblioteki (`pip list`)

## 📜 Licencja

Twój projekt - rób z nim co chcesz! 🚀

---

**Zrobione z ❤️ przy użyciu Next.js, Python i AI**
