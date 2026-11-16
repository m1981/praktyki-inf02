# Skrypty pomiarowe z sesji 2026-11-17 (punkt wyjścia dla kroku 1 migracji)

Robocze skrypty puppeteer-core, którymi sprawdzano kryterium „mieści się w 1366×768 i 1280×720”.
Uruchamiano je z katalogu z `node_modules/puppeteer-core` (Chrome: `/Applications/Google Chrome.app`).
Krok 1 w `../../architektura.md` zamienia je na `pnpm test:e2e`; potem ten katalog można usunąć.

| Plik          | Co mierzy                                                                   |
| ------------- | --------------------------------------------------------------------------- |
| `measure.mjs` | ARP: każdy krok (diagram, tekst, przycisk); maska: Tryb swobodny, przykłady |
| `series.mjs`  | Seria M1–M4: każdy krok w 3 rozdzielczościach, liczba kontrolek             |
| `shot.mjs`    | Zrzuty kroków ARP (strzałka →)                                              |
| `mask.mjs`    | Zrzuty 4 przykładów maski                                                   |
