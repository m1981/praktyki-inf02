# Zlecenie: „Arkusz krok po kroku”, warstwy 7–9 (dla nowej sesji)

Status: do wykonania · 2026-11-25 · decyzje: PYT-089a (warstwy), PYT-106a (podział na 6–9), PYT-104a (sylwetka Kuby).
Poprzednia sesja skończyła warstwę 6 (`078d032`, wypchnięte). Ten plik to kompletny brief – wykonawca
nie zna wcześniejszej rozmowy.

## Przeczytaj w tej kolejności

1. `01-sieci/appka/kontrakt.md` – zasady pracy z operatorem (meldunek WNIOSEK/WYKONANO/STAN/PROBLEMY/
   PACZKA PYTAŃ/OD CIEBIE, pytania z numerem, opcjami i rekomendacją). Obowiązuje.
2. `01-sieci/appka/rejestr-pytan.md` – przegląd i wpisy od PYT-087 do końca. Pierwszy wolny numer: **PYT-110**
   (zanim nadasz numer i przed commitem: `git fetch`, sprawdź `origin/main`).
3. `01-sieci/appka/wzorce-scenariuszy.md` – reguła warstwy, trzy wzorce, choreografia Kuby, częste błędy.
4. `01-sieci/appka/mapa-nauki-sieci.md`, sekcja „Warstwy zamiast etapów 3–6” – stan warstw 1–9.
5. Wzór scenariusza: `scenariusz-arkusz-6.md` (najnowszy, po recenzji) i `scenariusz-arkusz-5.md`.
6. Dane urządzeń: `mapa-menu-urzadzen.md` (TP-Link – przykład z emulatora, model w pracowni niepotwierdzony;
   Cisco CBS350), `mapa-menu-cbs350-basic.md`.
7. Kod: `src/content/arkusz.ts` (warstwy 1–6), `src/content/arkusz.test.ts`, `src/ui/views/SheetView.tsx`,
   `src/ui/views/SheetParts.tsx`, `src/ui/arkusz.css`, `src/model/arkusz.ts`. README aplikacji.

## Przepis na jedną warstwę (sprawdzony na warstwach 3–6)

| #   | Krok                                                                                                                                    | Kto              | Uwagi                                                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Scenariusz `scenariusz-arkusz-N.md` według wzorców, z kolumną „Kuba (pod)” i sekcją „Dla dociekliwych”                                  | agent            | kwestia ≤ 12 słów; linijki arkusza co do słowa z PDF (`pdftotext -layout egzaminy/inf02-2025-styczen-egzamin-zawodowy-praktyczny.pdf -`) |
| 2   | Recenzja: sub-agent z `prompt-recenzent.md` (podmień plik w „Co recenzujesz”, podaj warstwy 1–(N-1) jako kontekst), bez wniosków autora | agent            | dotąd zawsze „gotowe po poprawkach”, ~12 uwag – przyjmij trafne, zrób wersję 2                                                           |
| 3   | Podgląd HTML scenariusza dla operatora + pytanie o akceptację                                                                           | agent → operator | operator woli HTML niż Markdown (konwerter: prosty skrypt md→html w katalogu tymczasowym)                                                |
| 4   | Kod: `ETAP_N` w `arkusz.ts`, pozycje Kuby `KUBA_N` + `withKuba`, test co do słowa w `arkusz.test.ts`, karta w `cwiczenia.js`            | agent            | adresy tylko z `model/` albo `lib/ipv4` (test `literaly`: nawet „0.0.0.0” w tekście – użyj `formatIp(0)`)                                |
| 5   | `pnpm build` (typy, testy, 4 strony, e2e), zrzuty kluczowych kroków, meldunek + pytanie o commit/push                                   | agent → operator | operator zwykle: „commit i push”                                                                                                         |

## Warstwy do zrobienia (PYT-106a)

| #   | Pytanie                       | Materiał (linijki arkusza)                                                                                                                                         | Pułapki (≤ 2)                                                                                                                                                                                                                                                                                                | Kuba                                                           |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| 7   | W jakiej kolejności to robię? | zad. 2 (ruter, „zgłoś gotowość”), 3, 4 (kable według schematu, zasilanie), 7 (serwer WAN „odśwież adres IP”)                                                       | 1. Po zmianie LAN rutera (192.168.0.1 → 10.10.0.1) panel „ucieka” – serwer musi odświeżyć adres (`ipconfig /release`, `/renew`), żeby wejść pod nowy. 2. Kable według schematu dopiero po konfiguracji (kabel do panelu był tymczasowy); porty: PORT LAN rutera – WAN serwera, LAN 1 – PORT1, PORT3 – stacja | pierwszy raz przy szafie (`ruter`, `przełącznik` przy kablach) |
| 8   | Jak sprawdzić, że działa?     | zad. 8 (ping z serwera do stacji i do LAN rutera, „wyświetl adres IP interfejsu WAN”, „zmień ustawienia zapory”), zad. 9 (www.egzamin.local w maszynie wirtualnej) | 1. Zapora Windows na stacji blokuje ping (reguła „żądanie echa ICMPv4”). 2. Ping poza jedną sieć nie przejdzie – to nie błąd (serwer nie routuje)                                                                                                                                                            | serwer, stacja                                                 |
| 9   | Cały arkusz                   | wszystko                                                                                                                                                           | wszystkie                                                                                                                                                                                                                                                                                                    | –                                                              |

Kolejność pracy z całej ścieżki (do warstwy 7): MAC karty WAN serwera → ruter (WAN, DNS, LAN, DHCP,
rezerwacja) → przełącznik (kreator, VLAN 1, Save) → kable → serwer (WAN automatycznie + odśwież; LAN 1
bez bramy) → stacja (LAN 2; maszyna wirtualna mostkowana, LAN 3) → sprawdzenie.

Warstwa 9: makieta z PYT-088 (`Czytam arkusz`: oryginalny tekst zadań 2–8, przy linijkach pytania ①–⑤
i pułapki, filtr „jedno pytanie naraz”) jako ostatnia faza – uczeń najpierw sam oznacza linijki, potem
widzi adnotacje. Makieta była w katalogu tymczasowym poprzedniej sesji (może już nie istnieć) – opis
jest w PYT-088; przed kodem zapytaj operatora o kształt.

## Pułapki techniczne, które już wyszły

- **Rząd zakładek przy 1280 px jest pełny** (6 zakładek). Zakładka 7 go zawinie (+~40 px) i pomiar e2e
  może nie przejść. Zaproponuj krótsze nazwy zakładek (np. numer + ikona) albo mniejszy schemat – zapytaj.
- **Prettier** uruchamiaj z katalogu głównego repo; po nim pliki zmieniają się na dysku (zawija linie
  w `cwiczenia.js` i tabele w `.md`) – podmiany tekstu rób na aktualnej treści.
- **Podmiany wyrażeniem regularnym w `.md`**: `mapa-nauki-sieci.md` ma kilka tabel z wierszami „| 6 …”.
  Raz podmieniła się zła tabela – zawsze sprawdź `git diff` po takiej zmianie.
- **Skrypty pomocnicze** zapisuj narzędziem do plików w katalogu tymczasowym sesji, potem uruchamiaj
  (operator nie lubi długich poleceń z osadzonym kodem). Puppeteer: `01-sieci/appka/node_modules/.pnpm/
puppeteer-core@25.17.0/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js`, Chrome systemowy.
  Katalog tymczasowy bywa czyszczony – nie polegaj na starych skryptach.
- **Wysokość sceny**: `--stage-h-sheet` 470 px. Okienka (rezerwacja, kreator) + linijki arkusza + wiersz
  Kuby szybko przekraczają – w krokach z okienkiem chowaj linijki albo zostaw jedną (`onlyLine6`).
  W ćwiczeniach „uczeń sam” wiersza Kuby nie ma (`withKuba` zdejmuje).
- **Test „strzałka »przeglądarka« wychodzi spod sylwetki”** – w zagadce (Kuba „—”) nie zostawiaj strzałki.
- **Emulator Cisco**: sub-agent nie może się zalogować (blokada wpisywania hasła) – rzeczy do sprawdzenia
  na ekranie zlecaj operatorowi (2 minuty, jak PYT-108).
- **Pliki operatora**: nie ruszaj `01-sieci/appka/przyklad.md`, katalogu `egzaminy/` (dwa PDF-y zasad
  oceniania są w gicie, ale nie na dysku – nie nasza zmiana) ani plików spoza gita.
- Commit: linia `Co-Authored-By` z nazwą modelu, który wykonał pracę. Hook przed commitem: PurgeCSS,
  KONSPEKT, strażnik linków (`pnpm linki`), Prettier.

## Pierwsza wiadomość do operatora

Krótki meldunek stanu według kontraktu (rozdz. 5 i 7): co przeczytałeś, stan repozytorium, jak rozumiesz
warstwę 7, jedno pytanie o nazwy zakładek (rząd przy 1280 px) i od czego zaczynasz.
