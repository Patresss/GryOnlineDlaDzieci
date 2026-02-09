# Plan ulepszeń v3 - Gry dla Dzieci

## Analiza obecnego stanu (screenshot)

**Problemy widoczne na screenie:**
- Strona jest wąska (max-width 700px) - na desktopie po bokach pozostaje dużo pustej przestrzeni
- Brak dekoracji w tle poza bąbelkami - tło jest monotonne
- Sekcje kategorii wyglądają na "wiszące w próżni"
- Brak poczucia progresu wizualnego (pasek postępu, mapa przygody)
- Kafelki gier są małe i nieco generyczne
- Brak animowanych maskotów/postaci które przyciągną uwagę dziecka
- Sekcja "Polecane" jest mała i łatwo ją przeoczyć

---

## A - Layout i wypełnienie przestrzeni

### A1: Wider responsive layout
Zwiększenie max-width sekcji do 1000px na desktopie. Na szerokich ekranach grid gier powinien mieścić 5-6 kolumn zamiast 4. Sekcje kategorii rozciągnąć do pełnej szerokości z zachowaniem glassmorphism.

```
@media (min-width: 768px) {
  .main-menu__section, .main-menu__recommended { max-width: 1000px; }
  .main-menu__grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
}
```

### A2: Dekoracyjne elementy w tle
Dodanie animowanych dekoracji po bokach strony widocznych na desktopie:
- Latające gwiazdki, serduszka, chmurki po lewej i prawej stronie
- Dekoracyjne "wyspy" (floating islands) z emoji zwierząt w tle
- Animowane tęczowe łuki pojawiające się co kilka sekund
- Elementy reagujące na scroll (parallax effect)

### A3: Pasek postępu globalny (Progress Journey)
Na samej górze strony (pod powitaniem) - wizualny pasek postępu pokazujący ile gier ukończono z 34 dostępnych. Stylizowany jako "ścieżka przygody" z kamieniami milowymi przy co 5 grach.

### A4: Większe kafelki gier z animacją hover
- Zwiększyć minimalną wysokość kafelka ze 120px do 140px
- Dodać subtelną animację emoji (bounce/wobble) na hover
- Gradient overlay na kafelkach bardziej wyrazisty
- Dodać "difficulty dots" (1-3 kropki) pokazujące poziom trudności gry

### A5: Sticky header z mini-profilem
Podczas scrollowania - mały sticky header u góry z awatarem, gwiazdkami i szybkim dostępem do profilu. Znika gdy user jest na górze strony.

---

## B - Nowe funkcjonalności

### B1: Tablica osiągnięć (Achievements)
System osiągnięć z odznakami:
- "Pierwszy krok" - ukończ pierwszą grę
- "Odkrywca" - zagraj w 10 różnych gier
- "Mistrz literek" - ukończ wszystkie gry z kategorii Literki
- "Seria 5!" - zdobądź 5 gwiazdek pod rząd
- "Kolekcjoner" - zbierz 20 naklejek
- "Szybki jak błyskawica" - ukończ grę w mniej niż 30 sekund
- Odznaki wyświetlane jako medal emoji + opis, locked/unlocked

### B2: Tryb wyzwania (Challenge Mode)
Przycisk "Wyzwanie!" na stronie głównej - losuje 3 gry z różnych kategorii do ukończenia. Po ukończeniu wszystkich trzech - bonus: 3 gwiazdki + specjalna naklejka.

### B3: Statystyki z animowanymi wykresami
Na stronie profilu - kolorowe wykresy słupkowe (CSS only):
- Ulubiona kategoria (która ma najwięcej ukończonych gier)
- Ile gier ukończono w tym tygodniu vs poprzednim
- Streak counter (ile dni pod rząd gracz grał)

### B4: Tryb "dla dwojga" (Two Player)
Prosta opcja gry dwuosobowej - gracze na zmianę odpowiadają na pytania (ten sam ekran). Wynik porównywany na koniec: "Gracz 1: 5 ⭐ vs Gracz 2: 3 ⭐". Dostępny dla gier typu quiz (literki, cyferki, kolory, przeciwieństwa).

### B5: Animowany maskot/przewodnik
Mały animowany zwierzak (wybrany awatar gracza) który pojawia się w rogu ekranu:
- Na stronie głównej: macha, skacze, śpi (po długim braku aktywności)
- W grach: reaguje na odpowiedzi (radosny, smutny, zachęcający)
- Można go "pogłaskać" (tap) i mówi losowe zdanie
- Implementacja: CSS sprite animation z emoji + dymki z tekstem

---

## C - Nowe gry (6 propozycji)

### C1: Gra "Znajdź intruza" (Odd One Out)
Wyświetl 4 elementy - 3 pasują do kategorii, 1 nie. Np. 🍎🍐🍊🐱 - kliknij tego który nie pasuje.
- gameId: oddOneOutGame, sticker: 🔎, route: /gra/intruz
- Kategorie: owoce, zwierzęta, pojazdy, kolory, kształty

### C2: Gra "Lustro" (Mirror/Symmetry)
Pokaż wzór po lewej stronie (np. kolory, kształty) - dziecko musi odtworzyć lustrzane odbicie po prawej. Kliknięcie pól zmienia ich kolor/kształt.
- gameId: mirrorGame, sticker: 🪞, route: /gra/lustro
- Grid 3x3 (easy) lub 4x4 (hard)

### C3: Gra "Pociąg" (Train Sorting)
Animowany pociąg z wagonami - dziecko sortuje wagony wg koloru, rozmiaru lub numeru. Drag & drop (lub tap-to-swap).
- gameId: trainGame, sticker: 🚂, route: /gra/pociag
- Wizualizacja: emoji wagonów 🟥🟦🟨 z numerami

### C4: Gra "Mapa skarbów" (Treasure Map)
Prosta gra programowania - dziecko wydaje komendy (góra, prawo, dół, lewo) aby poprowadzić postać do skarbu na siatce. Wizualnie: grid z emoji (trawa, kamień, skarb).
- gameId: treasureGame, sticker: 🗺️, route: /gra/skarb
- Uczy podstaw myślenia algorytmicznego

### C5: Gra "Sklep" (Shopping)
Dziecko kupuje przedmioty za podane kwoty - wybiera odpowiednie monety/banknoty. Uczy rozpoznawania pieniędzy i prostego liczenia.
- gameId: shopGame, sticker: 🛒, route: /gra/sklep
- Monety: 1zł, 2zł, 5zł, banknoty: 10zł, 20zł (emoji: 🪙💵)

### C6: Gra "Budowlaniec" (Builder)
Odtwórz wzór z kolorowych klocków - wyświetl model na 3 sekundy, potem dziecko buduje z pamięci. Kliknięcie pola przełącza kolor.
- gameId: builderGame, sticker: 🏗️, route: /gra/buduj
- Grid 3x3, 5 kolorów, difficulty = czas na zapamiętanie

---

## D - Ulepszenia wizualne

### D1: Animated page transitions
Dodać animacje przejścia między stronami za pomocą React Transition Group lub CSS:
- Wejście do gry: slide-up + fade
- Powrót do menu: slide-down + fade
- Szybka animacja (200-300ms) żeby nie spowalniać

### D2: Seasonal decorations
Automatyczne dekoracje sezonowe na stronie głównej:
- Zima (XII-II): płatki śniegu ❄️ zamiast bąbelków, niebieski gradient
- Wiosna (III-V): kwiaty 🌸 i motylki 🦋
- Lato (VI-VIII): słoneczka ☀️ i fale 🌊
- Jesień (IX-XI): liście 🍂 i dynie 🎃

### D3: Particle effects na odpowiedziach
- Prawidłowa odpowiedź: eksplozja gwiazdek/confetti z punktu kliknięcia
- Streak 3+: tęczowy trail za kursorem przez 2 sekundy
- Win screen: intensywniejsze fajerwerki z dźwiękiem

### D4: Dark mode (Tryb nocny)
Automatyczny lub ręczny tryb nocny:
- Ciemniejsze gradienty tła
- Mniejszy kontrast (łagodniejszy dla oczu)
- Przycisk księżyca/słońca 🌙/☀️ przy SoundToggle

---

## E - Ulepszenia techniczne

### E1: Service Worker + PWA
- Dodać manifest.json i service worker
- Aplikacja działa offline (cache all assets)
- "Add to Home Screen" na mobile
- Splash screen z logo

### E2: Animacja ładowania per-kategoria
Zamiast jednego spinnera - skeleton loading z placeholderami kafelków (shimmer effect). Każda kategoria ładuje się niezależnie.

### E3: Accessibility improvements
- Dodać aria-labels do wszystkich interaktywnych elementów
- Keyboard navigation (Tab + Enter) dla wszystkich gier
- Focus visible styles (outline) na kafelkach
- Prefers-reduced-motion: wyłączyć wszystkie animacje

### E4: Performance - virtualized scroll
Na stronie głównej z 34+ grami - użyć virtualizednego scrollowania dla kategorii poza viewport. Leniwe ładowanie sekcji które nie są widoczne.

---

## F - Priorytet implementacji

### Faza 1 - Layout fix (najważniejsze - "pusto po bokach")
1. **A1** - Wider responsive layout (szybka zmiana CSS)
2. **A2** - Dekoracyjne elementy w tle (floating decorations)
3. **A4** - Większe kafelki z lepszym hover

### Faza 2 - Engagement
4. **A3** - Progress journey bar
5. **B1** - System osiągnięć
6. **B5** - Animowany maskot

### Faza 3 - Nowe gry
7. **C1** - Znajdź intruza
8. **C4** - Mapa skarbów
9. **C5** - Sklep
10. **C2** - Lustro

### Faza 4 - Polish
11. **D2** - Seasonal decorations
12. **D1** - Page transitions
13. **D4** - Dark mode
14. **E1** - PWA / offline

### Opcjonalnie (jeśli czas pozwoli)
- B2 - Challenge mode
- B4 - Tryb dla dwojga
- C3 - Pociąg
- C6 - Budowlaniec
- D3 - Particle effects
