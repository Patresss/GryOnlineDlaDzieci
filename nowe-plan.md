# Plan rozwoju — Gry dla Dzieci

> Analiza obecnego stanu + propozycje ulepszeń z perspektywy product managera, eksperta od dzieci i programisty.

---

## A. Ulepszenia wyglądu strony głównej

### A1. Kafelki gier — pokazuj postęp dziecka
**Problem:** Obecnie kafelek pokazuje tylko gwiazdkę jeśli gra została ukończona (tak/nie). Dziecko nie widzi jak wiele razy grało, a rodzic nie widzi aktywności.

**Propozycja:**
- Pod emoji na kafelku dodać mały pasek postępu lub liczbę ukończeń (np. "x3")
- Kafelki z nieukończonymi grami mogą mieć subtelną animację "pulsowania", zachęcając do wypróbowania
- Kafelki ukończonych gier dostaną złoty obramowanie/shimmer zamiast zwykłej gwiazdki w rogu

### A2. Sekcja "Zagraj ponownie" / "Polecane dla Ciebie"
**Problem:** Menu to po prostu długa lista kategorii. Dziecko musi scrollować żeby znaleźć ulubioną grę.

**Propozycja:**
- Na samej górze (pod powitaniem) dodać poziomy scroll z 3-4 kafelkami:
  - "Gra dnia" — losowa gra, codziennie inna (obliczana z daty, bez backendu)
  - "Ostatnio grane" — 2-3 ostatnio otwierane gry
  - "Spróbuj czegoś nowego!" — losowa gra z tych, w które dziecko jeszcze nie grało
- Kafelki w tej sekcji mogą być większe i bardziej wyróżniające się (np. z animowanym tłem)

### A3. Poprawa czytelności i hierarchii wizualnej
**Problem:** Nagłówki kategorii (np. "Literki i słowa") zlewają się nieco z tłem. Kafelki są jednolite — wszystkie mają ten sam rozmiar i styl.

**Propozycja:**
- Każda kategoria dostaje delikatne tło (glassmorphism card) — białe/przezroczyste z blur, żeby oddzielić sekcje od gradientowego tła
- Ikona kategorii (np. "📖") powinna być większa i wyraźniejsza
- Rozważyć "featured game" w każdej kategorii — jeden kafelek większy (2x szerokość), reszta standardowa. To zwraca uwagę na kluczowe gry

### A4. Animacje wejścia przy scrollowaniu
**Problem:** Kafelki pojawiają się od razu. Brak elementu odkrywania.

**Propozycja:**
- Dodać Intersection Observer — kafelki pojawiają się z animacją (slide up + fade in) gdy sekcja wchodzi w viewport
- Efekt kaskadowy: kafelki w sekcji pojawiają się jeden po drugim z opóźnieniem 50-80ms
- Nagłówki kategorii mogą mieć animację "bounce in"

### A5. Tło reagujące na scroll
**Problem:** Gradient tła jest statyczny (poza bąbelkami).

**Propozycja:**
- Gradient tła zmienia się w miarę scrollowania (od fioletowo-niebieskiego u góry do zielono-żółtego na dole) — już jest, ale można dodać parallax na bąbelkach
- Opcjonalnie: zmiana palety kolorów tła w zależności od kategorii, która jest aktualnie na ekranie

---

## B. Nowe funkcjonalności

### B3. System poziomów / awatarów
**Problem:** Gwiazdki się zbierają ale nic z nimi nie można zrobić.

**Propozycja:**
- Poziomy gracza: Żółtodziób (0-10 gwiazdek) → Odkrywca (11-30) → Mistrz (31-60) → Geniusz (61+)
- Każdy poziom odblokowuje nowy zestaw awatarów do wyboru
- Ramka wokół awatara zmienia kolor/styl z każdym poziomem
- Animacja "level up!" z fajerwerkami gdy dziecko awansuje

### B4. Odgłosy i muzyka w tle
**Problem:** Strona główna jest cicha. Dźwięki są tylko w grach.

**Propozycja:**
- Opcjonalna cicha muzyczka w tle na stronie głównej (wesoła melodia w pętli, generowana przez Web Audio API — bez plików mp3)
- Dźwięk kliknięcia przy wchodzeniu w kafelek gry (już jest `playClick()` — wystarczy podpiąć)
- Przycisk ON/OFF dźwięku (globalny, zapamiętywany w localStorage)
- Dźwięk powitania "Cześć [imię]!" przy wejściu na stronę główną (Speech API, max raz na sesję)

### B5. Motyw / personalizacja
**Problem:** Wygląd jest stały. Dziecko nie może go dostosować.

**Propozycja:**
- Wybór motywu kolorystycznego w profilu (3-4 opcje): Tęcza (obecny), Ocean (niebieski), Las (zielony), Kosmos (ciemny fiolet)
- Motywy zmieniają gradient tła strony głównej + kolory akcentowe
- Odblokowanie nowych motywów jako nagroda za osiągnięcia (np. "Ukończ 10 gier → odblokuj motyw Ocean")

---

## C. Nowe gry

> Poniższe gry **nie są** wymienione w `pomysly.md` — to nowe propozycje.

### C1. Gra "Która godzina?" (Zegar)
**Kategoria:** Cyferki i matma
**Mechanika:** Duży analogowy zegar z ruchomymi wskazówkami. Dziecko musi ustawić podaną godzinę (łatwy: pełne godziny, średni: i pół, trudny: kwatery). Wskazówki przeciąga się palcem/myszą.
**Wartość:** Nauka odczytywania zegara — fundamentalna umiejętność, która zanika w erze cyfrowej.

### C2. Gra "Emocje" (Rozpoznawanie uczuć)
**Kategoria:** Nowa kategoria "Ja i emocje" (ikona: 😊)
**Mechanika:** Dziecko widzi scenę (np. dziecko dostało prezent / dziecko zgubiło zabawkę) i musi wybrać odpowiedni emotikon emocji (😊 😢 😡 😮). Na trudniejszym poziomie: dopasowywanie emocji do twarzy.
**Wartość:** Inteligencja emocjonalna jest kluczowa w rozwoju 3-7 latka. Gra uczy nazywania uczuć.

### C3. Gra "Cień" (Dopasuj do kształtu)
**Kategoria:** Pamięć i myślenie
**Mechanika:** Dziecko widzi czarny cień przedmiotu (np. samochodu, motyla, drzewa) i musi wybrać z 4 kolorowych obrazków ten, który pasuje do cienia.
**Wartość:** Rozwija percepcję wzrokową i rozumienie kształtów w abstrakcji.

### C4. Gra "Puzzle" (Proste układanki)
**Kategoria:** Zręczność
**Mechanika:** Obrazek (emoji-based, np. scena z domkiem i drzewem) podzielony na 4/6/9 kawałków. Dziecko przeciąga kawałki na właściwe miejsca (snap-to-grid). Podgląd gotowego obrazka w rogu.
**Wartość:** Klasyczna zabawa rozwijająca myślenie przestrzenne. Drag & drop to naturalna interakcja na tablecie.

### C5. Gra "Przeciwieństwa"
**Kategoria:** Literki i słowa
**Mechanika:** Dziecko widzi obrazek (np. duży słoń) i musi wybrać jego przeciwieństwo (mały mrówka) z 3 opcji. Pary: duży/mały, gorący/zimny, szybki/wolny, ciężki/lekki, wesoły/smutny, dzień/noc.
**Wartość:** Nauka relacji pojęciowych, poszerzanie słownika.

### C6. Gra "Odejmowanie z obrazkami"
**Kategoria:** Cyferki i matma
**Mechanika:** Analogiczna do AdditionGame, ale z odejmowaniem. "Na talerzu było 5 ciastek. Mama wzięła 2. Ile zostało?" Z animacją znikających elementów.
**Wartość:** Naturalne uzupełnienie dodawania. Odejmowanie do 10.

### C7. Gra "Sekwencje / Co dalej?"
**Kategoria:** Pamięć i myślenie
**Mechanika:** Dziecko widzi ciąg elementów (np. 🔴🔵🔴🔵🔴❓) i musi wybrać co powinno być następne. Poziomy: proste powtórzenia (ABAB), potem wzory (AABB, ABC).
**Wartość:** Rozpoznawanie wzorców to fundament logicznego myślenia i matematyki.

### C8. Gra "Gotowanie" (Przepis krok po kroku)
**Kategoria:** Nowa kategoria "Codzienne umiejętności" (ikona: 🏠)
**Mechanika:** Dziecko "gotuje" prosty przepis — np. kanapkę. Wyświetla się lista kroków z obrazkami: 1) weź chleb 🍞, 2) posmaruj masłem 🧈, 3) połóż ser 🧀. Dziecko klika składniki w dobrej kolejności.
**Wartość:** Nauka sekwencjonowania (co po czym) + codzienne umiejętności. Dzieci uwielbiają grać w "gotowanie".

---

## D. Ulepszenia UX i dostępność

### D1. Onboarding dla nowych użytkowników
**Problem:** Nowy użytkownik widzi od razu masę gier. Nie wiadomo od czego zacząć.

**Propozycja:**
- Przy pierwszym uruchomieniu (brak profilu w localStorage):
  - Krok 1: "Cześć! Jak masz na imię?" + wybór awatara (obecna strona profilu, ale jako overlay)
  - Krok 2: "Ile masz lat?" → 3-4 / 5 / 6-7 (ustawia domyślny poziom trudności)
  - Krok 3: "Zagraj w pierwszą grę!" → przekierowanie do rekomendowanej gry z odpowiedniej grupy wiekowej
- Po onboardingu strona główna podświetla "Polecane dla Ciebie" na podstawie wybranego wieku

### D2. Lepszy feedback w grach
**Problem:** Feedback "correct/wrong" jest jednolity we wszystkich grach. Dziecko może się zniechęcić po kilku błędach.

**Propozycja:**
- Po 2 błędnych odpowiedziach z rzędu: wyświetl podpowiedź (np. podświetl prawidłową odpowiedź na chwilę)
- Komunikaty dopingujące po błędzie: "Prawie! Spróbuj jeszcze raz!" (losowane z puli, wymawiane przez Speech API)
- Po poprawnej: różne komunikaty zamiast jednego "Brawo!": "Super!", "Świetnie!", "Ale dobrze!", "Wow!"
- Streak bonus: 3 poprawne z rzędu → specjalna animacja (np. tęcza przelatuje przez ekran)

### D3. Przycisk "Pomoc" w każdej grze
**Problem:** Dziecko może nie rozumieć zasad gry. Brak instrukcji.

**Propozycja:**
- Ikonka "?" w prawym górnym rogu każdej gry
- Po kliknięciu: prosty overlay z animowaną instrukcją (2-3 zdania + emoji ilustracje)
- Speech API czyta instrukcję na głos
- Wyświetla się automatycznie przy pierwszym wejściu w grę (potem tylko na żądanie)

---

## E. Ulepszenia techniczne

### E1. Refaktor: wydzielenie logiki gry do custom hooka
**Problem:** Każda gra powieli ten sam wzorzec (difficulty → rounds → feedback → win). To dużo powtórzonego kodu.

**Propozycja:**
- Hook `useGameLoop({ gameId, sticker, dataSource, totalRoundsOverride })` zwracający:
  - `difficulty, startGame, currentRound, score, feedback, isWon, handleAnswer, resetGame`
- Redukuje ~40 linii boilerplate z każdej gry
- Ułatwia dodawanie nowych gier (wystarczy zdefiniować renderowanie + dane)

### E2. Lazy loading stron
**Problem:** Wszystkie 26 gier ładują się na starcie (import w App.jsx).

**Propozycja:**
- `React.lazy()` + `Suspense` dla każdej strony gry
- Fallback: prosty spinner z animacją (kolorowe kółko się kręci)
- Zmniejszy initial bundle i przyspieszy ładowanie na wolniejszych urządzeniach

### E3. Testy
**Problem:** Brak jakichkolwiek testów.

**Propozycja:**
- Dodać Vitest (integruje się natywnie z Vite)
- Testy komponentów kluczowych: `DifficultyPicker`, `WinScreen`, `ProfileContext`
- Testy logiki gier (czy poprawna odpowiedź daje punkt, czy zła nie daje)

---

## F. Rekomendowana kolejność wdrażania

| Priorytet | Zadanie | Uzasadnienie |
|-----------|---------|--------------|
| **1 (Quick wins)** | A1 (postęp na kafelkach), A3 (glassmorphism sekcji), D2 (lepszy feedback) | Szybkie, widoczne ulepszenia bez dużych zmian |
| **2 (Engagement)** | A2 (polecane/ostatnio grane), D1 (onboarding) | Budowanie nawyku powracania do aplikacji |
| **3 (Nowe gry)** | C7 (sekwencje), C2 (emocje), C5 (przeciwieństwa) | Proste w implementacji, wysoka wartość edukacyjna |
| **4 (Polish)** | A4 (animacje scroll), B4 (dźwięki menu), D3 (przycisk pomocy) | Polerowanie UX |
| **5 (Nowe gry 2)** | C1 (zegar), C4 (puzzle), C8 (gotowanie) | Bardziej złożone mechaniki |
| **6 (Platform)** | D4 (PWA), E2 (lazy loading), E1 (hook useGameLoop) | Fundamenty techniczne |
| **7 (Growth)** |  B3 (system poziomów), B5 (motywy) | Retencja i personalizacja |
