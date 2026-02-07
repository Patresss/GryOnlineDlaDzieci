# Plan Implementacji - Strona z Grami dla Dzieci (3-7 lat)

## 1. Inicjalizacja Projektu

### 1.1 Utworzenie projektu React
- Użycie Vite jako bundlera (`npm create vite@latest . -- --template react`)
- Konfiguracja w istniejącym katalogu (nadpisanie `package.json` i `index.js`)

### 1.2 Instalacja zależności
```
Produkcyjne:
- react, react-dom (z Vite template)
- react-router-dom (routing między menu a grami)

Devowe:
- eslint, prettier (opcjonalnie)
```

### 1.3 Struktura katalogów
```
src/
├── main.jsx                    # Punkt wejścia
├── App.jsx                     # Router
├── App.css                     # Globalne style
├── assets/
│   ├── images/
│   │   ├── letters/            # Obrazki do gry z literkami (balon.png, auto.png, ...)
│   │   ├── numbers/            # Obrazki do gry z cyframi (2-ptaki.png, 3-jabłka.png, ...)
│   │   ├── menu/               # Ikony kafelków menu
│   │   └── ui/                 # Elementy UI (myszka, serek, strzałka powrotu)
│   └── sounds/
│       ├── letters/            # Dźwięki "A jak Auto", "B jak Balon", ...
│       ├── numbers/            # Dźwięki "1", "2", "3", ...
│       ├── success.mp3         # Dźwięk poprawnej odpowiedzi
│       ├── error.mp3           # Dźwięk błędnej odpowiedzi
│       └── win.mp3             # Dźwięk wygranej
├── components/
│   ├── BackButton.jsx          # Strzałka powrotu do menu
│   ├── ProgressBar.jsx         # Pasek postępu (myszka -> serek)
│   └── WinScreen.jsx           # Ekran "Wygrałeś!" z przyciskiem "Zagraj ponownie"
├── pages/
│   ├── MainMenu.jsx            # Strona główna z kafelkami
│   ├── LetterGame.jsx          # Gra zgadywania literek
│   └── NumberGame.jsx          # Gra zgadywania cyfr
├── data/
│   ├── letters.js              # Dane: litera, obrazek, dźwięk
│   └── numbers.js              # Dane: cyfra, obrazek, dźwięk
└── hooks/
    └── useKeyboardListener.js  # Hook nasłuchiwania klawiszy
```

---

## 2. Routing (App.jsx)

### 2.1 Konfiguracja React Router
- `/` - Strona główna (MainMenu)
- `/gra/literki` - Gra z literkami (LetterGame)
- `/gra/cyferki` - Gra z cyframi (NumberGame)

### 2.2 Implementacja
```jsx
// Struktura App.jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<MainMenu />} />
    <Route path="/gra/literki" element={<LetterGame />} />
    <Route path="/gra/cyferki" element={<NumberGame />} />
  </Routes>
</BrowserRouter>
```

---

## 3. Strona Główna - Menu Kafelkowe (MainMenu.jsx)

### 3.1 Layout
- Pełnoekranowy layout z kolorowym tłem (gradient lub wzór dziecięcy)
- Na górze: duży, kolorowy tytuł strony (z ikonką/animacją zamiast tekstu, bo dzieci nie czytają)
- Na środku: siatka kafelków (CSS Grid, 2 kolumny na dużych ekranach, 1 na mobile)

### 3.2 Kafelki
- Każdy kafelek to duży, kolorowy przycisk (min. 200x200px)
- Kafelek zawiera:
  - Dużą ikonę gry (np. litera "ABC" dla gry z literkami, "123" dla gry z cyframi)
  - Krótki tekst pod spodem (opcjonalnie, ale głównie ikona mówi za siebie)
- Efekt hover: lekkie powiększenie (scale) + cień
- Efekt kliknięcia: lekkie "wciśnięcie" (scale down)
- Kliknięcie nawiguje do odpowiedniej gry przez `<Link>` z react-router

### 3.3 Stylowanie
- Zaokrąglone rogi (border-radius: 20px+)
- Duże, czytelne elementy (dzieci klikają palcami na tablecie)
- Jasne, wesołe kolory (żółty, zielony, niebieski, różowy)
- Bez małych elementów UI, bez tekstu wymagającego czytania

---

## 4. Komponent Strzałki Powrotu (BackButton.jsx)

### 4.1 Opis
- Duża strzałka w lewym górnym rogu (ikona SVG, np. ← lub domek)
- Stała pozycja (position: fixed lub absolute w kontenerze gry)
- Nawiguje do `/` po kliknięciu
- Min. 48x48px (dostępność dotykowa)
- Kolorowa, z hover efektem

---

## 5. Pasek Postępu - Myszka i Serek (ProgressBar.jsx)

### 5.1 Opis
- Poziomy pasek na górze ekranu gry (pod strzałką powrotu)
- Po lewej stronie: obrazek myszki
- Po prawej stronie: obrazek serka
- Między nimi: ścieżka/tor (kolorowy pasek)
- Myszka przesuwa się w prawo po każdej poprawnej odpowiedzi

### 5.2 Logika
- Props: `current` (0-10), `total` (domyślnie 10)
- Pozycja myszki: `(current / total) * 100%` od lewej krawędzi
- Animacja przesuwania: CSS transition (transform/left, ~0.5s ease)

### 5.3 Implementacja
```jsx
// Struktura
<div className="progress-bar">
  <img className="mouse" style={{ left: `${(current/total)*100}%` }} />
  <div className="track" />
  <img className="cheese" />
</div>
```

---

## 6. Ekran Wygranej (WinScreen.jsx)

### 6.1 Opis
- Overlay na pełny ekran (z lekkim blur tła)
- Duży napis "Brawo!" / emoji gwiazdek / animacja confetti
- Animacja (np. gwiazdki, konfetti CSS)
- Duży przycisk "Zagraj ponownie" (z ikonką odświeżenia/replay)
- Dźwięk wygranej (`win.mp3`) odtwarzany przy wyświetleniu

### 6.2 Props
- `onPlayAgain` - callback do zresetowania gry

---

## 7. Hook useKeyboardListener

### 7.1 Opis
- Custom hook nasłuchujący naciśnięć klawiszy
- Używa `useEffect` z `keydown` event listenerem
- Normalizuje klawisz do uppercase
- Zwraca ostatnio naciśnięty klawisz

### 7.2 API
```jsx
const lastKey = useKeyboardListener();
// lastKey = "B" po naciśnięciu klawisza B
```

---

## 8. Gra - Zgadywanie Literek (LetterGame.jsx)

### 8.1 Dane (data/letters.js)
```js
// Tablica obiektów z danymi dla każdej literki
const letters = [
  { letter: "A", word: "Auto",   image: "/images/letters/auto.png",   sound: "/sounds/letters/a.mp3" },
  { letter: "B", word: "Balon",  image: "/images/letters/balon.png",  sound: "/sounds/letters/b.mp3" },
  { letter: "C", word: "Cytryna", image: "/images/letters/cytryna.png", sound: "/sounds/letters/c.mp3" },
  // ... reszta alfabetu (dobieramy proste, rozpoznawalne słowa dla dzieci)
  // Minimum 10 liter na start, docelowo cały alfabet
];
```

Proponowane słowa (proste, rozpoznawalne dla dzieci 3-7 lat):
- A - Auto, B - Balon, C - Cytryna, D - Dom, E - Ekran/Elephant
- F - Flaga, G - Gruszka, H - Helikopter, I - Igloo
- J - Jabłko, K - Kot, L - Lew, M - Motyl
- N - Nożyczki, O - Okno, P - Pies, R - Rakieta
- S - Słońce, T - Tęcza, U - Usta, W - Wąż
- Z - Zamek

### 8.2 Stan gry (useState)
```
- currentRound: number (0-9, aktualna runda)
- currentLetter: object (losowy element z letters[])
- isCorrect: boolean | null (null = brak odpowiedzi, true = poprawna, false = błędna)
- score: number (liczba poprawnych odpowiedzi, do progress bara)
- isWon: boolean (czy gra zakończona)
- usedLetters: Set (zbiór już użytych liter, aby nie powtarzać)
```

### 8.3 Layout ekranu gry
```
┌─────────────────────────────────────────┐
│ [←]                                      │  <- BackButton
│                                          │
│ 🐭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🧀     │  <- ProgressBar
│                                          │
│   ┌──────────┐      ┌──────────┐        │
│   │          │      │          │        │
│   │  OBRAZEK │      │    B     │        │
│   │ (Balon)  │      │          │        │
│   │          │      │          │        │
│   └──────────┘      └──────────┘        │
│                                          │
│         Naciśnij literkę B!              │  <- Podpowiedź (opcjonalna)
│                                          │
└─────────────────────────────────────────┘
```

### 8.4 Logika gry (krok po kroku)
1. **Start gry**: Losowanie 10 unikalnych liter z tablicy `letters`
2. **Wyświetlenie rundy**:
   - Po lewej: duży obrazek (np. balon)
   - Po prawej: duża litera (np. "B") w kolorowym kwadracie
   - Odtworzenie dźwięku: "B jak Balon"
3. **Nasłuchiwanie klawiatury** (useKeyboardListener):
   - Jeśli naciśnięty klawisz === wyświetlona litera:
     - Podświetlenie litery na **zielono**
     - Odtworzenie dźwięku sukcesu
     - Zwiększenie `score` o 1
     - Po ~1.5s: przejście do następnej rundy (nowa litera)
   - Jeśli naciśnięty klawisz !== wyświetlona litera:
     - Podświetlenie litery na **czerwono** (animacja "shake")
     - Odtworzenie dźwięku błędu
     - Litera wraca do normalnego koloru po ~0.5s
     - Gracz próbuje ponownie (ta sama litera)
4. **Po 10 poprawnych odpowiedziach**:
   - Myszka dociera do serka (animacja)
   - Wyświetlenie WinScreen
5. **"Zagraj ponownie"**: Reset stanu, losowanie nowych 10 liter

### 8.5 Animacje
- Pojawienie się nowej literki: fade-in + scale (CSS animation)
- Poprawna odpowiedź: pulse zielony + myszka przesuwa się
- Błędna odpowiedź: shake czerwony
- Przejście między rundami: crossfade

---

## 9. Gra - Zgadywanie Cyfr (NumberGame.jsx)

### 9.1 Dane (data/numbers.js)
```js
const numbers = [
  { number: 1, word: "ptak",     image: "/images/numbers/1-ptak.png",     sound: "/sounds/numbers/1.mp3" },
  { number: 2, word: "ptaki",    image: "/images/numbers/2-ptaki.png",    sound: "/sounds/numbers/2.mp3" },
  { number: 3, word: "jabłka",   image: "/images/numbers/3-jablka.png",   sound: "/sounds/numbers/3.mp3" },
  { number: 4, word: "motyle",   image: "/images/numbers/4-motyle.png",   sound: "/sounds/numbers/4.mp3" },
  { number: 5, word: "gwiazd",   image: "/images/numbers/5-gwiazd.png",   sound: "/sounds/numbers/5.mp3" },
  { number: 6, word: "kwiatów",  image: "/images/numbers/6-kwiatow.png",  sound: "/sounds/numbers/6.mp3" },
  { number: 7, word: "balonów",  image: "/images/numbers/7-balonow.png",  sound: "/sounds/numbers/7.mp3" },
  { number: 8, word: "chmur",    image: "/images/numbers/8-chmur.png",    sound: "/sounds/numbers/8.mp3" },
  { number: 9, word: "serc",     image: "/images/numbers/9-serc.png",     sound: "/sounds/numbers/9.mp3" },
];
```

### 9.2 Layout ekranu gry
```
┌─────────────────────────────────────────┐
│ [←]                                      │
│                                          │
│ 🐭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🧀     │
│                                          │
│   ┌──────────┐      ┌──────────┐        │
│   │  🐦 🐦   │      │          │        │
│   │          │      │    2     │        │
│   │ (2 ptaki)│      │          │        │
│   │          │      │          │        │
│   └──────────┘      └──────────┘        │
│                                          │
└─────────────────────────────────────────┘
```

### 9.3 Logika gry
- Identyczna jak w LetterGame, ale:
  - Zamiast liter - cyfry 1-9
  - Zamiast obrazków przedmiotów na literę - obrazki z odpowiednią liczbą obiektów
  - Nasłuchiwanie klawiszy cyfr (1-9) zamiast liter
  - Losowanie 10 rund z powtórzeniami (bo mamy tylko 9 cyfr - jedna cyfra powtórzy się raz)
  - Dźwięk np. "2 - dwa ptaki"

### 9.4 Stan gry
- Taki sam jak w LetterGame (można wydzielić wspólny hook `useGameLogic`)

---

## 10. Assety - Obrazki i Dźwięki

### 10.1 Obrazki
- **Styl**: Kreskówkowy/flat design, kolorowy, przyjazny dzieciom
- **Format**: PNG z przezroczystym tłem lub SVG
- **Rozmiar**: Min. 300x300px dla obrazków w grze
- **Źródło**: Wygenerowane przez AI (DALL-E/Midjourney) lub darmowe zasoby (OpenClipart, undraw.co)
- **Na start**: Można użyć emoji jako placeholder (np. renderowane jako duże SVG)

### 10.2 Dźwięki
- **Format**: MP3 (kompatybilność) + opcjonalnie OGG
- **Dźwięki liter**: Nagrania TTS (Text-to-Speech) - np. Web Speech API lub pre-nagrany polski lektor
- **Efekty**: Krótkie dźwięki (success, error, win) - darmowe z freesound.org
- **Implementacja**: `new Audio(src).play()` lub dedykowany hook `useSound`

### 10.3 Strategia dla assetów na start (MVP)
- Emoji jako obrazki (renderowane dużymi fontami lub jako SVG)
- Web Speech API (`speechSynthesis`) do generowania dźwięków liter/cyfr w locie
- Proste dźwięki efektów z darmowych zasobów

---

## 11. Stylowanie

### 11.1 Podejście
- Czyste CSS (CSS Modules lub zwykłe pliki `.css` per komponent)
- Brak bibliotek UI (prostota, pełna kontrola nad wyglądem)
- Zmienne CSS dla palety kolorów

### 11.2 Paleta kolorów
```css
:root {
  --color-bg:        #FFF8E7;  /* Ciepły kremowy */
  --color-primary:   #FF6B6B;  /* Koralowy czerwony */
  --color-secondary: #4ECDC4;  /* Turkusowy */
  --color-accent:    #FFE66D;  /* Słoneczny żółty */
  --color-success:   #51CF66;  /* Zielony - poprawna odpowiedź */
  --color-error:     #FF6B6B;  /* Czerwony - błędna odpowiedź */
  --color-text:      #2D3436;  /* Ciemny tekst */
  --color-blue:      #74B9FF;  /* Niebieski - kafelki */
  --color-purple:    #A29BFE;  /* Fioletowy - kafelki */
  --border-radius:   20px;     /* Zaokrąglone rogi wszędzie */
}
```

### 11.3 Typografia
- Font: `'Fredoka One'` lub `'Bubblegum Sans'` (Google Fonts, dziecięcy styl)
- Rozmiary: duże (min. 24px dla tekstu, 72px+ dla liter/cyfr w grze)

### 11.4 Responsywność
- Mobile-first (dzieci często grają na tabletach)
- Breakpoints: 480px (telefon), 768px (tablet), 1024px+ (desktop)
- Touch-friendly: min. 48x48px dla elementów klikalnych

### 11.5 Animacje CSS
```css
/* Przykładowe animacje */
@keyframes shake    { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
@keyframes pulse    { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
@keyframes fadeIn   { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@keyframes confetti { /* animacja konfetti na WinScreen */ }
```

---

## 12. Kolejność Implementacji (kroki)

### Faza 1: Szkielet projektu
1. Inicjalizacja Vite + React
2. Instalacja react-router-dom
3. Konfiguracja routingu (App.jsx)
4. Stworzenie pustych stron (MainMenu, LetterGame, NumberGame)
5. Dodanie Google Fonts

### Faza 2: Menu główne
6. Layout i stylowanie MainMenu
7. Kafelki z nawigacją do gier
8. BackButton (komponent)
9. Stylowanie tła, kolorów, animacji hover

### Faza 3: Wspólne komponenty gier
10. ProgressBar (myszka -> serek)
11. WinScreen (overlay z "Brawo!" i przyciskiem replay)
12. useKeyboardListener (hook)

### Faza 4: Gra z literkami
13. Dane letters.js (litery + placeholder obrazki/emoji)
14. Layout LetterGame (obrazek + litera)
15. Logika gry (losowanie, sprawdzanie, score)
16. Integracja z ProgressBar i WinScreen
17. Dźwięki (Web Speech API na start)
18. Animacje (shake na błąd, pulse na sukces, fadeIn nowa litera)
19. Stylowanie

### Faza 5: Gra z cyframi
20. Dane numbers.js
21. Layout NumberGame
22. Logika gry (analogiczna do LetterGame)
23. Integracja z ProgressBar i WinScreen
24. Dźwięki i animacje
25. Stylowanie

### Faza 6: Polish
26. Testy manualne na różnych urządzeniach
27. Optymalizacja wydajności (lazy loading stron)
28. Poprawa dostępności (aria labels, focus management)
29. Podmiana emoji na prawdziwe obrazki (jeśli dostępne)
30. Finalne poprawki wizualne

---

## 13. Kluczowe Zasady UX dla Dzieci 3-7 lat

1. **Brak tekstu** - Wszystko komunikowane wizualnie (ikony, kolory, animacje)
2. **Duże elementy** - Minimum 48px klikalne, docelowo 80px+
3. **Natychmiastowy feedback** - Każda interakcja daje wizualny + dźwiękowy feedback
4. **Brak frustracji** - Brak timera, brak karania za błędy, zawsze można spróbować ponownie
5. **Pozytywne wzmocnienie** - Animacje, dźwięki, gwiazdki przy sukcesie
6. **Prosty flow** - Max 1 klik do gry, 1 klik powrót do menu
7. **Dźwięk** - Wspomaganie audio (nazwy liter/cyfr), bo dzieci mogą nie czytać
