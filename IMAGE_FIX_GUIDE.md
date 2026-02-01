# System Automatycznej Naprawy Obrazów

## 🎯 Rozwiązanie problemu

Twój problem: **Unsplash generował linki typu `via.placeholder.com` lub niedziałające obrazy**

### Nasze rozwiązanie - 3 poziomy ochrony:

## 1️⃣ **Frontend Fallback (JavaScript)**
✅ Automatyczne wykrywanie błędów ładowania  
✅ Integracja z Unsplash API (opcjonalnie)  
✅ Statyczne fallbacki dla każdej kategorii  
✅ Zero zmian w plikach JSON

## 2️⃣ **Backend Image Fixer (C# Service)**
✅ Skanuje wszystkie JSON-y  
✅ Sprawdza dostępność obrazów  
✅ Pobiera nowe z Unsplash API  
✅ **Aktualizuje pliki JSON** z nowymi linkami

## 3️⃣ **Admin Panel**
✅ Interfejs webowy do naprawy obrazów  
✅ Raporty z naprawionych plików  
✅ Jednym kliknięciem napraw wszystko

---

## 🚀 Quick Start

### Opcja A: Tylko Frontend (bez Unsplash API)
**Najszybsze rozwiązanie - działa od razu!**

1. Wgraj pliki z `/outputs/`
2. Gotowe! 

**Jak działa:**
- Jeśli obraz się nie załaduje → automatycznie użyje statycznego fallbacka
- Każda kategoria ma dedykowany obraz zastępczy
- Działa w przeglądarce, nie wymaga konfiguracji

### Opcja B: Frontend + Unsplash API
**Lepsze obrazy, automatycznie dopasowane do kategorii**

1. Zarejestruj się: https://unsplash.com/developers
2. Utwórz aplikację → skopiuj "Access Key"
3. Edytuj `_Layout.cshtml`:
```javascript
const UNSPLASH_ACCESS_KEY = 'TUTAJ_TWÓJ_KLUCZ';
const USE_UNSPLASH_API = true; // Zmień na true
```
4. Gotowe!

**Jak działa:**
- Jeśli obraz się nie załaduje → pobierze nowy z Unsplash API
- Automatycznie wyszukuje obrazy pasujące do kategorii
- Losowy obraz za każdym razem (różnorodność)
- Fallback: jeśli API nie działa, użyje statycznego obrazu

### Opcja C: Kompletne rozwiązanie (Backend + API)
**Naprawia JSON-y permanentnie**

1. Skonfiguruj Unsplash API (jak w Opcja B)
2. Edytuj `Services/ImageFixerService.cs`:
```csharp
private const string UNSPLASH_ACCESS_KEY = "TUTAJ_TWÓJ_KLUCZ";
```
3. Zrestartuj aplikację
4. Otwórz: `http://localhost:5000/admin/fix-images`
5. Kliknij "Rozpocznij naprawę obrazów"
6. Gotowe! Wszystkie JSON-y zaktualizowane

**Jak działa:**
- Skanuje wszystkie pliki JSON w `/Content/`
- Sprawdza każdy `FeaturedImage` link
- Jeśli nie działa → pobiera nowy z Unsplash
- **Zapisuje nowy link do pliku JSON**
- Raport pokazuje co zostało naprawione

---

## 📋 Szczegółowa dokumentacja

### Frontend Fallback System

#### Automatyczna detekcja problemów:
```javascript
// Wykrywa:
✅ via.placeholder.com
✅ 404 errors
✅ Timeouty
✅ CORS errors
✅ Broken links
```

#### Fallback images per kategoria:
```javascript
'finanse'     → Złote monety i wykres
'prawo'       → Młotek sędziego
'technologia' → Kod programistyczny
'zdrowie'     → Stetoskop medyczny
'biznes'      → Osoba w stroju biznesowym
'default'     → Krajobraz (uniwersalny)
```

#### Flow diagram:
```
Strona się ładuje
    ↓
Czy img.src zawiera "placeholder"?
    ↓ TAK                    ↓ NIE
Natychmiast podmień     Czekaj na error event
    ↓                         ↓
    └─────────────────────────┘
              ↓
    Czy USE_UNSPLASH_API = true?
        ↓ TAK              ↓ NIE
    Fetch z API        Użyj static fallback
        ↓
    Czy API zwróciło obraz?
        ↓ TAK              ↓ NIE
    Użyj z API        Użyj static fallback
        ↓
    Wyświetl obraz + dodaj klasę .fallback-image
```

---

### Backend Image Fixer Service

#### Funkcje:
```csharp
✅ IsImageAccessibleAsync() - Sprawdza HTTP HEAD request
✅ GetNewImageFromUnsplashAsync() - Pobiera z API
✅ UpdateImageInJson() - Aktualizuje plik JSON
✅ FixAllImagesAsync() - Naprawia wszystkie pliki
```

#### Proces naprawy:
```
1. Skanuj /Content/ rekursywnie
2. Dla każdego *.json:
   a. Parsuj JSON
   b. Sprawdź FeaturedImage
   c. HTTP HEAD request do obrazu
   d. Jeśli 404/timeout:
      - Pobierz nowy z Unsplash API
      - Zaktualizuj JSON
      - Zapisz plik
3. Zwróć raport (fixed/skipped/errors)
```

#### Przykładowy raport:
```
Fixed: 23
Skipped: 45 (obrazy OK)
Errors: 2

Naprawione pliki:
- jak-splacic-kredyt.json
  Old: via.placeholder.com/1200x630
  New: https://images.unsplash.com/photo-1579621970563-ebec7560ff3e
  
- fundusz-awaryjny.json
  Old: https://broken-link.com/image.jpg
  New: https://images.unsplash.com/photo-1518770660439-4636190af475
```

---

## 🔑 Unsplash API - Setup Guide

### 1. Rejestracja
1. Idź na: https://unsplash.com/developers
2. Zaloguj się / Zarejestruj
3. Kliknij "New Application"

### 2. Konfiguracja aplikacji
```
Application name: MocInformacji Blog
Description: Portal edukacyjny z artykułami
```

### 3. Skopiuj klucze
```
Access Key: xxxxxxxxxxxxxxxxxxxx (ten potrzebujesz)
Secret Key: xxxxxxxxxxxxxxxxxxxx (nie potrzebny)
```

### 4. Limity (Free tier)
```
50 requests / hour
Unlimited views
Demo mode (podczas development)
```

### 5. Produkcja
```
Wypełnij formularz aplikacji
Poczekaj na approval (~1-2 dni)
Otrzymasz 5000 requests/hour
```

### 6. Rate Limits - Handling
```javascript
// System automatycznie fallbackuje na static images
// jeśli przekroczysz limit API

try {
    const image = await fetchUnsplashImage();
} catch (RateLimitError) {
    // Użyje statycznego fallbacka
    return fallbackImages[category];
}
```

---

## 📊 Monitoring & Debugging

### Console Logs (F12 w przeglądarce)

#### Frontend:
```javascript
// Sukces - Frontend fallback
"Image replaced for category: finanse"
{ original: "via.placeholder.com", new: "Static fallback" }

// Sukces - Unsplash API
"Image replaced for category: technologia"
{ original: "broken-link.jpg", new: "Unsplash API" }
```

#### Backend (podczas FixAllImages):
```
[INFO] Fixing image for: jak-splacic-kredyt.json
[INFO] Fixed: jak-splacic-kredyt.json
       Old: via.placeholder.com
       New: https://images.unsplash.com/photo-xxx
```

### Network Tab
```
Sprawdź czy obrazy się ładują:
1. F12 → Network
2. Filtruj: Img
3. Szukaj statusów 404/500
4. Te wymagają naprawy
```

---

## 🎨 Customization

### Zmiana statycznych fallbacków

Edytuj `_Layout.cshtml`:
```javascript
const fallbackImages = {
    'finanse': 'TWÓJ_NOWY_LINK',
    'prawo': 'TWÓJ_NOWY_LINK',
    // ...
};
```

### Zmiana search terms dla Unsplash

Edytuj `_Layout.cshtml`:
```javascript
const categorySearchTerms = {
    'finanse': ['money', 'coins', 'banking', 'TWÓJ_TERM'],
    // ...
};
```

### Własne źródło obrazów

Edytuj `ImageFixerService.cs`:
```csharp
private async Task<string> GetNewImageFromCustomSourceAsync(string category)
{
    // Twoja własna logika
    // Może być: Pexels, Pixabay, własny CDN, itp.
    return "https://twoje-cdn.com/images/xyz.jpg";
}
```

---

## ⚠️ Troubleshooting

### Problem: Obrazy nadal się nie ładują
**Rozwiązanie:**
1. Sprawdź konsole (F12) czy są błędy
2. Sprawdź czy JavaScript się wykonał
3. Wymuś refresh (Ctrl+Shift+R)

### Problem: Unsplash API nie działa
**Rozwiązanie:**
1. Sprawdź czy klucz API jest poprawny
2. Sprawdź limity (50 req/hour)
3. System automatycznie użyje static fallbacks

### Problem: Backend nie aktualizuje JSON-ów
**Rozwiązanie:**
1. Sprawdź uprawnienia do zapisu w `/Content/`
2. Sprawdź logi aplikacji
3. Uruchom ponownie z `/admin/fix-images`

### Problem: Niektóre obrazy są szare/mgliste
**To celowe!** Klasa `.fallback-image` dodaje:
```css
.fallback-image {
    opacity: 0.95;
    filter: grayscale(10%);
}
```

Możesz to usunąć w `_Layout.cshtml` jeśli nie chcesz tego efektu.

---

## 🚀 Production Checklist

- [ ] Skonfiguruj Unsplash API key
- [ ] Uruchom `/admin/fix-images` i napraw wszystkie JSONy
- [ ] Sprawdź raporty - czy wszystko OK
- [ ] Usuń access do `/admin/fix-images` (dodaj autoryzację)
- [ ] Monitoruj logi przez pierwsze dni
- [ ] Skonfiguruj regularny cron job do sprawdzania obrazów
- [ ] Rozważ hosting lokalny dla krytycznych obrazów

---

## 📚 Dodatkowe zasoby

- Unsplash API Docs: https://unsplash.com/documentation
- Alternative: Pexels API: https://www.pexels.com/api/
- Alternative: Pixabay API: https://pixabay.com/api/docs/
- Image optimization: https://imageoptim.com/

---

## 💡 Tips & Best Practices

1. **Zawsze testuj nowe obrazy** przed zapisaniem do JSON
2. **Używaj CDN** dla lepszej wydajności
3. **Kompresuj obrazy** (`?w=800&h=500&q=80`)
4. **Backup JSON** przed uruchomieniem Image Fixer
5. **Monitoruj koszty** jeśli używasz płatnego API
6. **Cache obrazy** w przeglądarce (już zaimplementowane)
7. **Lazy loading** dla lepszej wydajności (już zaimplementowane)

---

## 🎯 Podsumowanie

### Co masz teraz:
✅ Automatyczne wykrywanie złych obrazów  
✅ Trzy poziomy fallbacków (API → Static → Placeholder)  
✅ Backend do permanentnej naprawy JSON-ów  
✅ Admin panel do zarządzania  
✅ Dokumentację i monitoring  

### Co możesz zrobić:
1. **Szybkie rozwiązanie:** Wgraj pliki i zapomnij (Opcja A)
2. **Lepsze obrazy:** Dodaj Unsplash API (Opcja B)
3. **Permanentna naprawa:** Użyj Backend Fixera (Opcja C)

**Wszystko działa "out of the box" - wybierz opcję która Ci pasuje!** 🎉
