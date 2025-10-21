# Interwały – aplikacja do treningu słuchu

Interwały to progresywna aplikacja webowa (PWA) służąca do nauki i treningu słuchu muzycznego w oparciu o interwały. Całość działa w przeglądarce (100% client-side) i została zbudowana w oparciu o React + TypeScript + Vite.

## Funkcje

- kilka trybów nauki: rozpoznawanie, fiszki, śpiewanie, porównywanie oraz kojarzenie piosenek,
- generator dźwięków WebAudio (tonika + interwał, różne instrumenty),
- detekcja wysokości głosu (algorytm YIN) uruchamiana w Web Workerze,
- wizualizacje: klawiatura wirtualna, podgląd pięciolinii, statystyki postępów,
- przechowywanie wyników w `localStorage` (Zustand z persist),
- wersjonowana pamięć podręczna dzięki Service Workerowi – aplikacja działa offline po pierwszym uruchomieniu,
- i18n (PL/EN) oraz tryb responsywny z dostępnością ARIA.

## Wymagania

- Node.js 18+
- pnpm / npm / yarn (przykłady wykorzystują npm)

## Uruchamianie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

## Budowanie i podgląd

```bash
npm run build
npm run preview
```

Wynik znajduje się w katalogu `dist/` i jest gotowy do publikacji np. na GitHub Pages. Dzięki `createHashRouter` routing jest kompatybilny z Pages.

## Testy

W repozytorium znajdują się przykładowe polecenia do uruchomienia testów jednostkowych (`npm run test`) oraz e2e (`npm run test:e2e`). W środowisku bez zainstalowanych zależności mogą wymagać wcześniejszego `npm install`.

## PWA i cache

Plik `public/sw.js` zawiera prosty Service Worker odpowiadający za cache statycznych zasobów i działanie offline. Rejestracja odbywa się w `src/registerServiceWorker.ts`.

## Struktura katalogów

- `src/components` – elementy UI (layout, klawiatura, statystyki itd.)
- `src/pages` – widoki poszczególnych trybów nauki
- `src/hooks` – logika generowania interwałów i detekcji wysokości
- `src/lib` – narzędzia audio i pitch detection
- `src/state` – store’y Zustand dla ustawień i postępów
- `src/utils` – pomocnicze funkcje (interwały, nuty)
- `public/` – manifest, service worker, ikony

## Deploy na GitHub Pages

Wystarczy zbudować projekt (`npm run build`) i opublikować zawartość katalogu `dist` w gałęzi `gh-pages`. Do automatyzacji można wykorzystać GitHub Actions uruchamiające polecenia build i deploy. Dzięki hash routingowi aplikacja działa bez dodatkowej konfiguracji.
