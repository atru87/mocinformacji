# 📊 Google Analytics - Konfiguracja

## ✅ **Dlaczego Google Analytics zamiast własnego licznika?**

### **Własny licznik (usunęliśmy):**
- ❌ Wymaga zapisu do pliku na serwerze
- ❌ Vercel ma read-only filesystem (nie działa)
- ❌ Potrzebny zewnętrzny database
- ❌ Trudny w utrzymaniu

### **Google Analytics:**
- ✅ Darmowe
- ✅ Zaawansowane statystyki
- ✅ Brak konieczności zapisu na serwerze
- ✅ Real-time dashboard
- ✅ Raporty, demografia, źródła ruchu

---

## 🚀 **Konfiguracja (5 minut):**

### **Krok 1: Utwórz konto Google Analytics**

1. Wejdź na: https://analytics.google.com
2. Kliknij **"Rozpocznij mierzenie"**
3. Podaj nazwę konta: `MocInformacji`
4. Kliknij **"Dalej"**

### **Krok 2: Dodaj właściwość**

1. Nazwa właściwości: `MocInformacji.pl`
2. Strefa czasowa: `Poland (GMT+01:00)`
3. Waluta: `PLN`
4. Kliknij **"Dalej"**

### **Krok 3: Wybierz typ strumienia danych**

1. Wybierz: **"Sieć"**
2. URL witryny: `https://mocinformacji.pl`
3. Nazwa strumienia: `MocInformacji Web`
4. Kliknij **"Utwórz strumień"**

### **Krok 4: Skopiuj Measurement ID**

Po utworzeniu zobaczysz coś takiego:
```
Identyfikator pomiaru
G-XXXXXXXXXX
```

**Skopiuj ten ID!** (np. `G-ABC1234567`)

### **Krok 5: Wklej do kodu**

Otwórz `app/layout.tsx` i znajdź te linie:

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

**Zamień `G-XXXXXXXXXX` na swoje ID** (w dwóch miejscach):

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-ABC1234567"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC1234567');
  `}
</Script>
```

### **Krok 6: Deploy**

```bash
git add app/layout.tsx
git commit -m "Add Google Analytics"
git push origin main
```

---

## 📈 **Sprawdź czy działa:**

### **Metoda 1: Real-time raport**
1. Wejdź na: https://analytics.google.com
2. Kliknij **"Raporty"** → **"Czas rzeczywisty"**
3. Otwórz swoją stronę: https://mocinformacji.pl
4. Po ~10 sekundach powinno pokazać: **1 użytkownik aktywny**

### **Metoda 2: Browser Console**
1. Otwórz stronę: https://mocinformacji.pl
2. Naciśnij F12 → zakładka **"Console"**
3. Wpisz: `dataLayer`
4. Jeśli zobaczysz array z danymi = działa! ✅

---

## 🎯 **Co możesz śledzić?**

### **Podstawowe:**
- Liczba użytkowników (dziennie, miesięcznie)
- Wyświetlenia stron
- Średni czas na stronie
- Współczynnik odrzuceń

### **Zaawansowane:**
- Skąd przychodzą użytkownicy (Google, social media, bezpośrednio)
- Jakie urządzenia używają (desktop, mobile, tablet)
- Geografia (kraj, miasto)
- Najpopularniejsze strony
- Demografia (wiek, płeć)

---

## 📊 **Dashboard - Co zobaczysz:**

```
┌─────────────────────────────────────────┐
│  Google Analytics 4                     │
├─────────────────────────────────────────┤
│                                         │
│  Użytkownicy (ostatnie 7 dni):         │
│  ████████████████ 1,234                 │
│                                         │
│  Wyświetlenia stron:                    │
│  ████████████████████ 3,456             │
│                                         │
│  Średni czas sesji:                     │
│  2m 34s                                 │
│                                         │
│  Najpopularniejsze strony:              │
│  1. /finanse/kredyt... (234 wizyt)      │
│  2. /zdrowie/dieta... (189 wizyt)       │
│  3. / (156 wizyt)                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔒 **Prywatność (RODO):**

### **Musisz dodać do Polityki Prywatności:**

Edytuj stronę `/polityka-prywatnosci` i dodaj:

```
## Pliki cookie i analytics

Nasza strona używa Google Analytics do zbierania 
anonimowych statystyk odwiedzin. Google Analytics 
używa plików cookie aby śledzić użytkowników.

Więcej informacji:
- Polityka prywatności Google: 
  https://policies.google.com/privacy
```

### **Banner cookie (opcjonalnie):**

Możesz dodać prosty banner:

```tsx
// components/CookieBanner.tsx
'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted')
    if (!accepted) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="cookie-banner">
      <p>
        Ta strona używa ciasteczek (cookies) 
        w celu poprawy jakości usług.
      </p>
      <button onClick={accept}>Akceptuję</button>
    </div>
  )
}
```

---

## ⚡ **Quick Setup:**

```bash
# 1. Zmień G-XXXXXXXXXX na swoje ID w app/layout.tsx
# 2. Deploy:
git add .
git commit -m "Configure Google Analytics"
git push origin main

# 3. Sprawdź w dashboardzie:
# https://analytics.google.com → Raporty → Czas rzeczywisty
```

---

## ❓ **FAQ:**

**Q: Kiedy zobaczę dane?**  
A: Real-time: od razu. Pełne raporty: po 24-48h.

**Q: Czy to darmowe?**  
A: Tak, całkowicie darmowe.

**Q: Czy muszę mieć konto Google?**  
A: Tak, potrzebujesz Gmail/Google account.

**Q: Czy mogę zobaczyć konkretnych użytkowników?**  
A: Nie, dane są anonimowe (IP zanonimizowane).

---

**Gotowe! Teraz masz profesjonalne śledzenie statystyk! 📊✨**
