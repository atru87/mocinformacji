# 🚀 Przewodnik - Jak generować artykuły

## 📋 Wymagania

### 1. Pliki konfiguracyjne

**`config.json`** - główna konfiguracja
```json
{
  "categories": ["finanse", "prawo", "technologia", "zdrowie", "biznes"],
  "claude_model": "claude-sonnet-4-20250514",
  "quality": "premium"
}
```

**`keys.config`** - klucze API
```json
{
  "claude": {
    "api_key": "sk-ant-TWÓJ_KLUCZ_TUTAJ"
  },
  "unsplash": {
    "access_key": "TWÓJ_KLUCZ_UNSPLASH"
  },
  "budget": {
    "claude_total_budget": 50.0
  }
}
```

### 2. Struktura katalogów

```
projekt/
├── claude_premium_v11_FINAL.py    # Skrypt
├── config.json                     # Konfiguracja
├── keys.config                     # Klucze API
├── public/
│   └── content/                    # Tutaj będą JSON-y
│       ├── finanse/
│       ├── prawo/
│       ├── technologia/
│       ├── zdrowie/
│       └── biznes/
└── MocInformacji/                  # Twoja aplikacja ASP.NET
    ├── Content/                    # Tu skopiujesz JSON-y
    ├── Pages/
    └── ...
```

---

## 🎯 Jak uruchomić

### Opcja 1: Generuj artykuły porównawcze (VS)

```bash
# Wygeneruj 10 artykułów typu "A vs B"
python claude_premium_v11_FINAL.py --vs 10

# Wygeneruj 5 artykułów VS tylko dla finansów
python claude_premium_v11_FINAL.py --vs 5 --category finanse

# Wygeneruj 20 artykułów VS dla wszystkich kategorii
python claude_premium_v11_FINAL.py --vs 20
```

**Przykładowe artykuły VS:**
- Kredyt hipoteczny vs Wynajem mieszkania (finanse)
- iPhone vs Android (technologia)
- Umowa o pracę vs Umowa zlecenie (prawo)
- Dieta keto vs Dieta low-carb (zdrowie)
- B2B vs B2C (biznes)

### Opcja 2: Generuj artykuły z puli słów kluczowych

```bash
# Bez flagi --vs skrypt użyje keywords_pool.json
python claude_premium_v11_FINAL.py

# Dla konkretnej kategorii
python claude_premium_v11_FINAL.py --category finanse
```

---

## ⚙️ Parametry

| Parametr | Opis | Przykład |
|----------|------|----------|
| `--vs N` | Generuj N artykułów porównawczych | `--vs 10` |
| `--category NAZWA` | Tylko dana kategoria | `--category finanse` |
| `--reset` | Resetuj postęp | `--reset` |

---

## 📊 Przykłady użycia

### Scenariusz 1: Start projektu
```bash
# Wygeneruj po 10 artykułów VS dla każdej kategorii (50 total)
python claude_premium_v11_FINAL.py --vs 50
```

### Scenariusz 2: Dogrywka dla finansów
```bash
# Dodaj 5 artykułów VS tylko dla finansów
python claude_premium_v11_FINAL.py --vs 5 --category finanse
```

### Scenariusz 3: Reset i nowy start
```bash
# Wyczyść postęp i zacznij od nowa
python claude_premium_v11_FINAL.py --reset --vs 20
```

---

## 📂 Po wygenerowaniu

### 1. Artykuły są w `public/content/`
```
public/content/
├── finanse/
│   ├── kredyt-hipoteczny-vs-wynajem-mieszkania.json
│   └── oszczedzanie-vs-inwestowanie.json
├── prawo/
│   └── umowa-o-prace-vs-umowa-zlecenie.json
└── ...
```

### 2. Skopiuj do ASP.NET
```bash
# Windows
xcopy /E /I /Y public\content MocInformacji\Content

# Linux/Mac
cp -r public/content/* MocInformacji/Content/
```

### 3. Uruchom aplikację
```bash
cd MocInformacji
dotnet run
```

### 4. Otwórz w przeglądarce
```
http://localhost:5000
```

---

## 🔍 Monitorowanie

### Podczas generowania zobaczysz:
```
🚀 CLAUDE PREMIUM AUTOPILOT v11.0 FINAL
======================================================================
📂 Existing articles: 23
💰 Budget: $50.00
📍 Output: /path/to/public/content
======================================================================

🎯 Generating VS articles (target: 10)...

[1/10] 📝 kredyt-hipoteczny-vs-wynajem-mieszkania
      Category: finanse | Priority: 10
      ✅ Success | 2561 words | $0.45
      📁 Saved: public/content/finanse/kredyt-hipoteczny-vs-wynajem-mieszkania.json

[2/10] 📝 iphone-vs-android
      Category: technologia | Priority: 10
      ✅ Success | 2384 words | $0.42
      📁 Saved: public/content/technologia/iphone-vs-android.json

...
```

### Po zakończeniu:
```
✨ COMPLETE
======================================================================
📊 Generated: 10/10
✅ Success rate: 10/10
📝 Avg words: 2456
💰 Total cost: $4.23
📁 Location: /path/to/public/content
======================================================================
```

---

## ⚠️ Troubleshooting

### Problem: "CLAUDE_API_KEY missing"
**Rozwiązanie:**
```json
// W keys.config dodaj:
{
  "claude": {
    "api_key": "sk-ant-TWÓJ_KLUCZ"
  }
}
```
Pobierz klucz z: https://console.anthropic.com/

### Problem: "Error 404"
**Rozwiązanie:** Klucz API jest nieprawidłowy lub wygasł
1. Sprawdź czy zaczyna się od `sk-ant-`
2. Wygeneruj nowy klucz w konsoli Anthropic

### Problem: Brak `public/content/`
**Rozwiązanie:** Skrypt automatycznie utworzy folder przy pierwszym uruchomieniu

### Problem: Duplikaty artykułów
**Rozwiązanie:** Skrypt sprawdza istniejące slug-i i pomija duplikaty automatycznie

---

## 💡 Wskazówki

### Optymalizacja kosztów:
```bash
# Zacznij od małej partii do testów
python claude_premium_v11_FINAL.py --vs 3 --category finanse

# Jeśli wszystko OK, zwiększ
python claude_premium_v11_FINAL.py --vs 20
```

### Różnorodność treści:
```bash
# Generuj artykuły dla różnych kategorii stopniowo
python claude_premium_v11_FINAL.py --vs 5 --category finanse
python claude_premium_v11_FINAL.py --vs 5 --category technologia
python claude_premium_v11_FINAL.py --vs 5 --category zdrowie
```

### Monitoring budżetu:
- Jeden artykuł ≈ $0.40-0.50
- 10 artykułów ≈ $4-5
- 50 artykułów ≈ $20-25
- 100 artykułów ≈ $40-50

---

## 📈 Lista artykułów VS (wbudowanych)

### Finanse (13 par)
- Kredyt hipoteczny vs Wynajem mieszkania
- Lokata vs Obligacje skarbowe
- Fundusz inwestycyjny vs ETF
- Leasing vs Kredyt samochodowy
- Karta kredytowa vs Pożyczka gotówkowa
- ... i więcej

### Technologia (10 par)
- iPhone vs Android
- Windows vs macOS
- SSD vs HDD
- VPN darmowy vs VPN płatny
- ... i więcej

### Zdrowie (10 par)
- Dieta keto vs Dieta low-carb
- Trening siłowy vs Trening cardio
- Białko serwatkowe vs Białko roślinne
- ... i więcej

### Biznes (8 par)
- B2B vs B2C
- E-commerce vs Sklep stacjonarny
- Facebook Ads vs Google Ads
- ... i więcej

### Prawo (5 par)
- Umowa o pracę vs Umowa zlecenie
- Rozwód vs Separacja
- ... i więcej

---

## 🎓 Najlepsze praktyki

1. **Zawsze rób backup** przed generowaniem dużej partii
2. **Testuj na małej liczbie** artykułów najpierw
3. **Monitoruj koszty** - ustaw rozsądny budget w `keys.config`
4. **Sprawdzaj jakość** pierwszych artykułów przed generowaniem więcej
5. **Kopiuj regularnie** wygenerowane JSON-y do aplikacji ASP.NET

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Ustaw klucz API w keys.config
# 2. Uruchom:
python claude_premium_v11_FINAL.py --vs 10

# 3. Skopiuj JSONy:
cp -r public/content/* MocInformacji/Content/

# 4. Uruchom aplikację:
cd MocInformacji && dotnet run

# 5. Otwórz: http://localhost:5000
```

**That's it! 🎉**
