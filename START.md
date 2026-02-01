# 🚀 SZYBKI START - MocInformacji.pl

## 📦 Co masz w paczce?

Kompletną stronę w Next.js z:
- ✅ Wszystkimi artykułami (JSON)
- ✅ Skryptami Python do generowania treści
- ✅ Gotowym frontendem (strona główna, kategorie, artykuły)
- ✅ Responsywnym designem (Bootstrap)

## 🎯 JAK URUCHOMIĆ LOKALNIE (WINDOWS)

### KROK 1: Zainstaluj Node.js

1. Wejdź na: **https://nodejs.org/**
2. Pobierz wersję **LTS** (zazwyczaj zielony przycisk)
3. Zainstaluj z domyślnymi ustawieniami
4. Po instalacji otwórz **CMD** lub **PowerShell** i sprawdź:
   ```
   node --version
   npm --version
   ```
   Jeśli widzisz numery wersji - super! ✅

### KROK 2: Rozpakuj projekt

1. Wypakuj ZIP do folderu, np. `C:\mocinformacji-nextjs`
2. Otwórz ten folder w Eksploratorze Plików

### KROK 3: Otwórz terminal w folderze projektu

**Sposób 1 (Windows 10/11):**
- Kliknij prawym przyciskiem w folderze projektu
- Wybierz "Otwórz w terminalu" lub "Otwórz okno PowerShell tutaj"

**Sposób 2:**
- Otwórz CMD
- Przejdź do folderu:
  ```
  cd C:\mocinformacji-nextjs
  ```

### KROK 4: Zainstaluj zależności

W terminalu wpisz:
```
npm install
```

Poczekaj 1-3 minuty, aż pobiorą się wszystkie pakiety.

### KROK 5: Uruchom stronę!

```
npm run dev
```

Otwórz przeglądarkę i wejdź na:
**http://localhost:3000**

🎉 **GOTOWE! Strona działa!**

---

## 🐍 JAK GENEROWAĆ NOWE ARTYKUŁY (OPCJONALNIE)

### KROK 1: Zainstaluj Python

1. Wejdź na: **https://www.python.org/downloads/**
2. Pobierz najnowszą wersję
3. **WAŻNE:** Zaznacz "Add Python to PATH" podczas instalacji!

### KROK 2: Zainstaluj biblioteki

W terminalu (w folderze projektu):
```
pip install anthropic pytrends feedparser requests praw
```

### KROK 3: Dodaj klucz API

1. Skopiuj plik `keys.config.example` → `keys.config`
2. Otwórz `keys.config` w Notatniku
3. Dodaj swój klucz od Anthropic:
   ```
   ANTHROPIC_API_KEY=sk-ant-twoj-klucz-tutaj
   ```
4. Zapisz plik

### KROK 4: Generuj artykuły!

```
python claude_premium_v10.py --count 5
```

Nowe artykuły pojawią się w `public/content/[kategoria]/`

---

## 🌐 JAK WRZUCIĆ NA INTERNET (DARMOWO!)

### OPCJA 1: Vercel (NAJŁATWIEJSZA)

1. Zarejestruj się na **https://vercel.com** (darmowe!)
2. Kliknij "New Project"
3. Przeciągnij folder projektu lub połącz z GitHub
4. Kliknij "Deploy"
5. **GOTOWE!** Dostajesz darmowy adres typu: `twoja-strona.vercel.app`

### OPCJA 2: Netlify

1. Zbuduj stronę lokalnie:
   ```
   npm run build
   ```
2. Wejdź na **https://netlify.com**
3. Przeciągnij folder `out/` na stronę
4. **GOTOWE!**

---

## 🆘 PROBLEMY?

### "npm: command not found"
- Node.js nie jest zainstalowany lub nie ma go w PATH
- Przeinstaluj Node.js i zaznacz "Add to PATH"

### "Port 3000 is already in use"
- Zamknij inne aplikacje używające portu 3000
- Lub uruchom na innym porcie:
  ```
  npm run dev -- -p 3001
  ```

### Strona nie ładuje artykułów
- Sprawdź czy folder `public/content/` istnieje
- Upewnij się że są tam pliki `.json`

### Skrypty Python nie działają
- Sprawdź czy Python jest zainstalowany: `python --version`
- Zainstaluj brakujące biblioteki: `pip install -r requirements.txt`

---

## 📚 PRZYDATNE KOMENDY

```bash
npm run dev          # Uruchom w trybie deweloperskim
npm run build        # Zbuduj wersję produkcyjną
npm start            # Uruchom wersję produkcyjną
python cli.py        # Menu CLI dla generatora
```

---

## 💰 KOSZTY

### Co jest darmowe:
- ✅ Hosting na Vercel/Netlify
- ✅ Certyfikat SSL (HTTPS)
- ✅ Unlimited bandwidth (w podstawowym planie)
- ✅ Automatyczne deploye

### Co kosztuje:
- ❌ Domena .pl: ~20-65 zł/rok
- ❌ API Anthropic: ~$10-20/miesiąc (dla generatora)

**RAZEM: ~20-65 zł/rok + opcjonalnie API** 🎉

---

## 🎓 DALSZE KROKI

1. **Dostosuj kolory** - edytuj `app/globals.css`
2. **Zmień meta tagi** - edytuj `app/layout.tsx`
3. **Dodaj własne artykuły** - stwórz pliki JSON w `public/content/`
4. **Wrzuć na domenę** - kup domenę i podepnij do Vercel

---

## 📞 POTRZEBUJESZ POMOCY?

- Dokumentacja Next.js: https://nextjs.org/docs
- Dokumentacja Python: https://docs.python.org/
- Bootstrap: https://getbootstrap.com/docs/

---

**Powodzenia! 🚀**

_Pytania? Sprawdź README.md w głównym folderze._
