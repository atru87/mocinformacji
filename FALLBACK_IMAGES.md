# Bezpieczne obrazy Fallback

## Problem
Niektóre linki z Unsplash wygasają lub przestają działać, powodując brak obrazów w artykułach.

## Rozwiązanie
System automatycznie wykrywa niedziałające obrazy i podmienia je na sprawdzone fallbacki dla każdej kategorii.

**NOWOŚĆ:** Każdy artykuł dostaje **unikalny obrazek** na podstawie swojego tytułu!

## 🎨 Jak to działa?

### System haszowania tytułów
```javascript
// Tytuł artykułu → Hash → Wybór obrazu z puli
"Jak spłacić kredyt hipoteczny" → Hash: 123456 → Obraz #3
"Dlaczego warto mieć fundusz"   → Hash: 789012 → Obraz #1
```

**Zalety:**
✅ Różne obrazy dla różnych artykułów  
✅ Ten sam artykuł = zawsze ten sam obraz (konsystencja)  
✅ 5 obrazów per kategoria = różnorodność  
✅ Deterministyczne (przewidywalne)

## 🖼️ Pule obrazów per kategoria

### Finanse (5 obrazów)
```
1. https://images.unsplash.com/photo-1579621970563-ebec7560ff3e (monety i wykres)
2. https://images.unsplash.com/photo-1634128221889-82ed6efebfc3 (banknoty)
3. https://images.unsplash.com/photo-1559526324-593bc073d938 (kalkulator)
4. https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3 (wykres wzrostu)
5. https://images.unsplash.com/photo-1460925895917-afdab827c52f (dane finansowe)
```

---

### Prawo (5 obrazów)
```
1. https://images.unsplash.com/photo-1589829545856-d10d557cf95f (młotek sędziego)
2. https://images.unsplash.com/photo-1505664194779-8beaceb93744 (księgi prawne)
3. https://images.unsplash.com/photo-1436450412740-6b988f486c6b (waga)
4. https://images.unsplash.com/photo-1507679799987-c73779587ccf (biznes/prawo)
5. https://images.unsplash.com/photo-1521587760476-6c12a4b040da (podpis umowy)
```

---

### Technologia (5 obrazów)
```
1. https://images.unsplash.com/photo-1518770660439-4636190af475 (kod)
2. https://images.unsplash.com/photo-1550751827-4bd374c3f58b (laptop)
3. https://images.unsplash.com/photo-1488590528505-98d2b5aba04b (technologia)
4. https://images.unsplash.com/photo-1461749280684-dccba630e2f6 (programowanie)
5. https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5 (AI/tech)
```

---

### Zdrowie (5 obrazów)
```
1. https://images.unsplash.com/photo-1576091160399-112ba8d25d1d (stetoskop)
2. https://images.unsplash.com/photo-1505751172876-fa1923c5c528 (medycyna)
3. https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7 (zdrowie)
4. https://images.unsplash.com/photo-1571772996211-2f02c9727629 (wellness)
5. https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b (fitness)
```

---

### Biznes (5 obrazów)
```
1. https://images.unsplash.com/photo-1507679799987-c73779587ccf (biuro)
2. https://images.unsplash.com/photo-1454165804606-c3d57bc86b40 (laptop biznes)
3. https://images.unsplash.com/photo-1552664730-d307ca884978 (spotkanie)
4. https://images.unsplash.com/photo-1560472355-536de3962603 (zespół)
5. https://images.unsplash.com/photo-1551836022-deb4988cc6c0 (korporacja)
```

---

### Default / Inne (5 obrazów)
```
1. https://images.unsplash.com/photo-1506784983877-45594efa4cbe (krajobraz)
2. https://images.unsplash.com/photo-1557683316-973673baf926 (gradient)
3. https://images.unsplash.com/photo-1579546929518-9e396f3cc809 (abstrakcja)
4. https://images.unsplash.com/photo-1519681393784-d120267933ba (góry)
5. https://images.unsplash.com/photo-1506905925346-21bda4d32df4 (natura)
```

---

## 🔧 Jak to działa

### 1. Automatyczna detekcja
```javascript
img.addEventListener('error', function() {
    // Wykryj kategorię z data-attribute
    let category = this.getAttribute('data-category');
    
    // Pobierz tytuł artykułu z alt
    let title = this.getAttribute('alt');
    
    // Wygeneruj hash z tytułu
    let hash = hashString(title); // np. 123456
    
    // Wybierz obraz z puli (5 obrazów per kategoria)
    let imageIndex = hash % 5; // np. 123456 % 5 = 1
    
    // Ustaw unikalny obraz
    this.src = fallbackImagesPool[category][imageIndex];
});
```

### 2. Przykład w praktyce
```
Kategoria: "finanse"
Tytuł: "Jak spłacić kredyt hipoteczny szybciej"

↓ Hash tytułu
Hash: 1847292847

↓ Modulo 5 (liczba obrazów w puli)
Index: 2

↓ Wybór obrazu
fallbackImagesPool['finanse'][2] = photo-1559526324-593bc073d938
```

**Rezultat:** Każdy artykuł o kredycie hipotecznym zawsze dostanie obraz #2 z puli finansów

### 3. Konsystencja
- Ten sam tytuł → ten sam hash → ten sam obraz
- Zmiana tytułu → inny hash → inny obraz
- 5 artykułów bez obrazu → 5 różnych obrazów (statystycznie)

## 📝 Kiedy używać własnych obrazów

Jeśli chcesz używać własnych obrazów zamiast Unsplash:

### Opcja 1: Lokalne pliki
```csharp
// Umieść obrazy w wwwroot/images/
"FeaturedImage": "/images/finanse/kredyt-hipoteczny.jpg"
```

### Opcja 2: CDN
```csharp
// Użyj stabilnego CDN
"FeaturedImage": "https://cdn.twojadomena.pl/images/article-123.jpg"
```

### Opcja 3: Pexels (alternatywa dla Unsplash)
```
https://images.pexels.com/photos/[ID]/pexels-photo-[ID].jpeg?w=800&h=500
```

### Opcja 4: Pixabay
```
https://pixabay.com/get/[IMAGE_ID].jpg?w=800&h=500
```

## 🎯 Zalecenia

### Najlepsze praktyki:
1. **Zawsze sprawdzaj linki** - przed zapisaniem JSON upewnij się, że obraz działa
2. **Używaj małych rozmiarów** - `?w=800&h=500` dla optymalnej wydajności
3. **Dodaj parametr `q=80`** - kompresja JPEG dla szybszego ładowania
4. **Testuj regularnie** - linki mogą wygasać po czasie

### Sprawdzenie linku:
```bash
# Curl - sprawdź czy link działa
curl -I "https://images.unsplash.com/photo-xxx"

# Odpowiedź 200 = OK
# Odpowiedź 404 = Nie działa
```

## 🔄 Aktualizacja fallbacków

Jeśli chcesz zmienić domyślne fallbacki, edytuj plik `_Layout.cshtml`:

```javascript
const fallbackImages = {
    'finanse': 'TWÓJ_NOWY_LINK',
    'prawo': 'TWÓJ_NOWY_LINK',
    // ...
};
```

## 📊 Monitoring

W konsoli przeglądarki (F12) zobaczysz:
```
Image failed to load, using fallback for category: finanse
```

To pomaga śledzić, które artykuły mają problemy z obrazami.

## 🚀 Przyszłe usprawnienia

- [ ] Automatyczne skanowanie JSON w poszukiwaniu niedziałających linków
- [ ] Skrypt do masowej wymiany złych linków
- [ ] Integracja z lokalnym storage obrazów
- [ ] Webhook do sprawdzania statusu obrazów
- [ ] Panel admina do zarządzania fallbackami
