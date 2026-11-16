# Audyt dydaktyczny: Symulator ARP i Wizualizacja maski

> Kopia raportu z 2026-11-16 (PYT-004a). Zrzuty i skrypty pomiarowe nie zostały skopiowane – ścieżki do katalogu tymczasowego poniżej przestają działać po zamknięciu sesji. Numery kroków ARP dotyczą wersji sprzed szybkich wygranych (PYT-005).

**Materiał:** `01-sieci/symulator-arp.html` (źródła `01-sieci/appka/src/arp/`), `01-sieci/symulator-maska.html` (źródła `01-sieci/appka/src/maska/`), kontekst: `01-sieci/index.html`, `01-sieci/lab1-podstawy.html`, `01-sieci/appka/plan.md`.
**Metoda:** przeczytanie źródeł (`scenario.ts`, `network.ts`, komponenty), zrzuty headless Chrome **bez przewijania** w 1366×768 i 1280×720 dla każdego kroku ARP (0–5) i każdego gotowego przykładu maski (1–4), pomiar słów i elementów sterujących w widocznym obszarze. Skrypty i zrzuty: `/private/tmp/claude-501/-Users-michal-PycharmProjects-praktyki-inf02-01-sieci-appka/bca58193-8aa4-4331-bae0-562a48072718/scratchpad/audyt/` (`audit.mjs`, `click-view.mjs`, `metrics.json`, `img/`).
**Ramy:** teoria obciążenia poznawczego (Sweller), zasady Mayera (segmentacja, sygnalizacja, redundancja, podzielona uwaga, bliskość przestrzenna), stopniowe odsłanianie.

## Najważniejsze wnioski

| #   | Wniosek                                                                                                                                                                                                                                       | Dowód                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Oba ćwiczenia uczą **dwóch–trzech tematów naraz**. ARP: ARP + uczenie się Switcha + decyzja maską. Maska: decyzja nadawcy + liczenie podsieci (bity, blok, Broadcast) + diagnostyka błędów (brama za płotem, różne maski).                    | 19 pojęć w ARP, 18 w Masce (rozdz. 1)                                                                                                               |
| 2   | **Uczeń nie widzi naraz animacji, tekstu, który ją opisuje, i przycisku.** To główne źródło „przeciążenia”: wzrok i kółko myszy skaczą.                                                                                                       | ARP: od górnej krawędzi diagramu do przycisku 685–1025 px przy 715 px użytecznej wysokości. Maska: od lekcji do dołu diagramu 843–894 px (rozdz. 3) |
| 3   | Po wejściu na stronę **ponad połowa ekranu to nagłówek i ramka „Inny świat”**. W ARP nie widać ani jednego przycisku symulatora.                                                                                                              | Symulator zaczyna się na y = 436–462 px z 768                                                                                                       |
| 4   | Ta sama informacja jest pokazana wiele razy (np. „inna sieć” 6 razy w Masce, typ ramki 4–5 razy w ARP). Uczeń czyta wszystko, żeby sprawdzić, czy to coś nowego.                                                                              | rozdz. 2.3                                                                                                                                          |
| 5   | Treść merytoryczna jest dobra i warto ją zachować. Problem leży w **formie i dawkowaniu**, nie w treści. Rozwiązanie: sekwencja 15 mikro-ćwiczeń po jednym pojęciu, każde na jednym ekranie, zbudowana z istniejących komponentów `src/sim/`. | rozdz. 4–5                                                                                                                                          |

---

## 1. Cel nauki i liczba pojęć

### 1.1 Symulator ARP

**Cel (jedno zdanie):** Uczeń wyjaśnia, jak Laptop zdobywa adres MAC Serwera NAS w tej samej sieci: pyta ramką ARP Request (Broadcast), dostaje ARP Reply (Unicast) i zapisuje wynik w tablicy ARP.

**Pojęcia faktycznie wykładane: 19** (rdzeń celu: 6)

| #   | Pojęcie                                           | Gdzie                                       | Status względem celu                |
| --- | ------------------------------------------------- | ------------------------------------------- | ----------------------------------- |
| 1   | Adres IP a adres MAC (do czego każdy służy)       | Start, Krok 1                               | **rdzeń**                           |
| 2   | Tablica ARP Laptopa                               | Krok 1, 4, panel boczny                     | **rdzeń**                           |
| 3   | ARP Request                                       | Krok 2–3                                    | **rdzeń**                           |
| 4   | Broadcast, adres FF:FF:FF:FF:FF:FF                | Krok 2–3, legenda, pigułka                  | **rdzeń**                           |
| 5   | ARP Reply                                         | Krok 4                                      | **rdzeń**                           |
| 6   | Unicast                                           | Krok 4–5, legenda, pigułka                  | **rdzeń**                           |
| 7   | Maska /24 i adres sieci                           | Krok 1                                      | inny temat (Krok 5 teorii, seria M) |
| 8   | Decyzja „ta sama sieć czy inna”                   | Krok 1                                      | inny temat (seria M)                |
| 9   | Tablica MAC Switcha (uczenie się z MAC nadawcy)   | Krok 2, 4, panel boczny                     | drugi temat (Switch)                |
| 10  | Porty Switcha Fa0/1–Fa0/3                         | karta Switcha, Kroki 2–5                    | drugi temat (Switch)                |
| 11  | Rozsyłanie na wszystkie porty oprócz źródłowego   | Krok 3                                      | wspiera Broadcast                   |
| 12  | Przełączanie według tablicy MAC (jeden port)      | Krok 4–5                                    | drugi temat (Switch)                |
| 13  | Router odrzuca ramkę, która nie jest do niego     | Krok 3                                      | pomocnicze                          |
| 14  | Tablica ARP Serwera NAS (nigdzie niepokazana)     | Krok 3                                      | pomocnicze, **niewidoczne**         |
| 15  | Pakiet IP w ramce Ethernet (enkapsulacja)         | Krok 5, panel ramki                         | pomocnicze                          |
| 16  | Warstwy L2/L3                                     | pasek nad tytułem kroku, karta Switcha „L2” | Krok 1 teorii, tu zbędne            |
| 17  | Pola ramki (MAC nadawcy, MAC odbiorcy, zawartość) | panel „Ramka w tym kroku”                   | pomocnicze                          |
| 18  | Wygasanie wpisu ARP                               | „Sprawdź się” 1                             | rozszerzenie rdzenia                |
| 19  | Brama domyślna dla adresu spoza sieci             | „Sprawdź się” 2                             | most do następnego tematu           |

### 1.2 Wizualizacja maski

**Cel (jedno zdanie):** Uczeń przewiduje, czy nadawca wyśle ramkę bezpośrednio, czy przez Router (Brama), porównując swoją sieć i sieć celu obliczone **maską nadawcy**.

**Pojęcia faktycznie wykładane: 18** (rdzeń celu: 4)

| #   | Pojęcie                                                             | Gdzie                                    | Status względem celu                  |
| --- | ------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------- |
| 1   | Decyzja nadawcy: ta sama / inna sieć                                | panel „Decyzja nadawcy”, lekcje 1–2      | **rdzeń**                             |
| 2   | Brama: inna sieć → objazd przez Router                              | diagram, werdykt                         | **rdzeń**                             |
| 3   | Granica podsieci („płot”)                                           | Ulica adresów, lekcja 2                  | **rdzeń**                             |
| 4   | Maska nie jest ścianą: Broadcast dociera do wszystkich              | ramka „Warstwa fizyczna się nie zmienia” | **rdzeń** (poprawność)                |
| 5   | Prefiks /24–/30                                                     | suwak                                    | pomocnicze                            |
| 6   | Maska w zapisie dziesiętnym 255.255.255.x                           | wyjście suwaka, Bity                     | liczenie                              |
| 7   | Adres sieci (moja sieć / sieć celu)                                 | panel decyzji, Ulica, Bity               | liczenie                              |
| 8   | Rozmiar bloku 2^(32−n)                                              | tabela pod Ulicą                         | liczenie                              |
| 9   | Adres Broadcast podsieci, zakres działki                            | tabela pod Ulicą, panel decyzji          | liczenie                              |
| 10  | Bity sieci i bity hosta, zapis binarny                              | Bity                                     | liczenie                              |
| 11  | Porównanie bitów / AND                                              | Bity, wynik                              | liczenie                              |
| 12  | Switch nie zna masek                                                | karta Switcha                            | wspiera 4                             |
| 13  | ARP pyta o MAC celu albo MAC Routera                                | wiersz „ARP pyta o”                      | most do ARP                           |
| 14  | Router ma adres w każdej podsieci                                   | karta Routera                            | Router-on-a-Stick (Lab 2) – tu zbędne |
| 15  | Brama poza siecią hosta (błąd konfiguracji, Windows/Linux)          | przykład 3                               | diagnostyka                           |
| 16  | Maska jest ustawieniem każdego urządzenia osobno, ruch asymetryczny | przykład 4, pole wyboru „Pułapka”        | diagnostyka                           |
| 17  | Kierunek i zmiana perspektywy nadawcy (Tam / Z powrotem)            | przełącznik „Kierunek”                   | diagnostyka                           |
| 18  | „W sieci nadawcy” jako tło/obrys kart                               | legenda nad diagramem                    | kod wizualny                          |

---

## 2. Inwentarz elementów

Oznaczenia: **[R]** – ta sama informacja pokazana drugi raz (redundancja). **[PU]** – wzrok musi skakać między odległymi częściami ekranu (podzielona uwaga).

### 2.1 Symulator ARP

| Element ekranu                                                        | Pojęcie                | Potrzebny do celu?                  | Decyzja                                                                             | Uwagi                                                                                                                                 |
| --------------------------------------------------------------------- | ---------------------- | ----------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Nagłówek H1 + podtytuł „Klikaj Następny krok…” (y 70–207)             | orientacja             | częściowo                           | **zostaw, skróć** do 1 linii                                                        | Podtytuł odsyła do przycisku, którego nie widać bez przewijania                                                                       |
| Okruszki                                                              | nawigacja              | nie                                 | zostaw, kompaktowo                                                                  | —                                                                                                                                     |
| Karta „Inny świat: przykładowe biuro” (106 px)                        | kontekst kursu         | nie w trakcie ćwiczenia             | **schowaj**: 1 linia „Przykładowe biuro (i)” z dymkiem                              | Zajmuje 14% ekranu przez cały czas                                                                                                    |
| Legenda Broadcast/Unicast                                             | Broadcast, Unicast     | tak, od kroku 2                     | **przenieś** do paska zmiany obok pola „MAC odbiorcy”                               | [R] z pigułką w panelu ramki; [PU] legenda nad diagramem, pigułka 500 px w prawo                                                      |
| Karty urządzeń: nazwa + IP                                            | IP                     | tak                                 | **zostaw**                                                                          | —                                                                                                                                     |
| Karty urządzeń: MAC na każdej karcie od startu                        | MAC                    | tak, ale…                           | **schowaj**: MAC Serwera NAS jako „???” aż do ARP Reply                             | Dziś uczeń widzi MAC Serwera NAS na diagramie od startu, a tekst mówi, że Laptop go nie zna. 6 podobnych adresów naraz (3 IP + 3 MAC) |
| Karta Switcha: porty Fa0/1–Fa0/3, „L2: czyta tylko MAC”               | port, warstwa          | nie (tak w serii B)                 | **przenieś** do B1–B2                                                               | —                                                                                                                                     |
| Odznaki ról na kartach (Wysyła, Odbiera, Odrzuca, Przełącza)          | rola urządzenia        | tak                                 | **zostaw**                                                                          | Dobra sygnalizacja: informacja leży na obiekcie                                                                                       |
| Etykieta na kablu („ARP Request”, „ARP Request (kopia)”)              | typ ramki              | tak                                 | **zostaw**                                                                          | [R] z tytułem kroku, panelem ramki i opisem                                                                                           |
| Panel „Ramka w tym kroku” (Typ, MAC nadawcy, MAC odbiorcy, Zawartość) | budowa ramki           | tak, ale jedno pole naraz           | **przenieś** pod diagram jako pasek zmiany; pokaż tylko pole, o którym mówi krok    | [PU] panel po prawej, tekst kroku 600 px niżej                                                                                        |
| Panel ramki w kroku Start: „W tym kroku żadna ramka nie płynie”       | —                      | nie                                 | **usuń**                                                                            | 3 puste panele na starcie (ramka, ARP, MAC)                                                                                           |
| Tablica ARP Laptopa (prawa kolumna)                                   | tablica ARP            | tak, od A4                          | **przenieś** obok karty Laptopa, pokaż od A4                                        | [PU] tablica ~900 px od karty Laptopa                                                                                                 |
| Tablica MAC Switcha (prawa kolumna)                                   | uczenie się Switcha    | nie dla celu ARP                    | **przenieś** do serii B                                                             | Drugi model myślowy w tym samym czasie                                                                                                |
| Pasek meta: „Krok 2 z 5” + „L2 (Łącze danych) – Broadcast”            | segmentacja, warstwa   | licznik tak, warstwa nie            | zostaw licznik, **usuń** warstwę                                                    | [R] „Broadcast” z pigułką i legendą                                                                                                   |
| Tytuł kroku („Krok 3: Switch rozsyła…”)                               | segmentacja            | tak                                 | **zostaw**, skróć                                                                   | Dobra segmentacja: nazwa działania                                                                                                    |
| Opis kroku (36–68 słów, 4–8 zdań)                                     | —                      | tak                                 | **skróć** do ≤40 słów i 1 działania                                                 | [PU] opis 230–700 px pod diagramem; Krok 4 opisuje 4 zdarzenia naraz                                                                  |
| Krok 1 „Decyzja – ta sama sieć czy inna?” (maska /24)                 | maska, adres sieci     | nie (Krok 5 teorii jest po Kroku 4) | **przenieś** do M1; w A1 zostaw jedno zdanie-fakt                                   | Odwołanie „w przód” do pojęcia, którego uczeń jeszcze nie miał                                                                        |
| Zdanie o tablicy ARP Serwera NAS (Krok 3)                             | —                      | nie                                 | **usuń** albo pokaż tablicę                                                         | Tekst opisuje coś, czego nie ma na ekranie                                                                                            |
| „Sprawdź się” (2 pytania, `<details>`)                                | wygasanie wpisu, brama | tak                                 | **przenieś**: pytanie 1 = pytanie startowe A4, pytanie 2 = pytanie-most na końcu B2 | Pytania są dobre, ale stoją pod opisem, a przycisk „Następny krok” jest pod nimi                                                      |
| Przyciski ↺, „Poprzedni krok”, „Następny krok”, „Klawiatura: ← →”     | sterowanie             | tak                                 | **zostaw**, przenieś obok tekstu kroku                                              | W krokach 2–5 niewidoczne razem z diagramem                                                                                           |
| Wolna przestrzeń w diagramie (440 px, treść ~300 px)                  | —                      | —                                   | zmniejsz do ~340 px                                                                 | —                                                                                                                                     |

### 2.2 Wizualizacja maski

| Element ekranu                                                          | Pojęcie                  | Potrzebny do celu?        | Decyzja                                                                          | Uwagi                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------- | ------------------------ | ------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nagłówek + podtytuł „Przesuwaj suwak maski…”                            | instrukcja               | tak                       | **zostaw, popraw**                                                               | Sprzeczna instrukcja: podtytuł każe przesuwać suwak, panel niżej każe klikać przykłady po kolei                                                                                                                                        |
| Okruszki + karta „Inny świat” (132 px)                                  | kontekst                 | nie                       | **schowaj** (1 linia)                                                            | jak w ARP                                                                                                                                                                                                                              |
| Gotowe przykłady 1–4                                                    | segmentacja              | tak                       | **zostaw** jako oś ćwiczeń (M2, M3, P1, P2)                                      | Dobra segmentacja i numeracja                                                                                                                                                                                                          |
| Lekcja przykładu (22–52 słów)                                           | —                        | tak                       | **zostaw**, skróć do ≤40, przenieś obok diagramu                                 | [PU] lekcja 300–870 px od diagramu i 1000+ px od Ulicy, do której się odwołuje („płot na .128”)                                                                                                                                        |
| Suwak /24–/30 + podziałka                                               | prefiks                  | tak                       | **zostaw** w M2–M3 jako przełącznik /24 ⇄ /25; pełny suwak tylko w L1–L3         | 7 pozycji × 3 cele × 2 kierunki × pułapka = 84 stany, lekcję ma tylko 4 z nich                                                                                                                                                         |
| Wyjście „/25 = 255.255.255.128”                                         | zapis dziesiętny         | nie dla celu              | **przenieś** do L3                                                               | [R] z Bitami                                                                                                                                                                                                                           |
| „Laptop rozmawia z” (3 przyciski)                                       | cel                      | nie (ustala go ćwiczenie) | **schowaj** w „Tryb swobodny”                                                    | —                                                                                                                                                                                                                                      |
| „Kierunek” Tam / Z powrotem                                             | perspektywa              | tylko w P2                | **przenieś** do P2                                                               | —                                                                                                                                                                                                                                      |
| Pole wyboru „Pułapka: na Serwerze NAS ktoś wpisał maskę /26”            | różne maski              | tylko w P2                | **usuń** jako kontrolkę (ustawia je ćwiczenie)                                   | —                                                                                                                                                                                                                                      |
| Legenda „w sieci nadawcy / poza siecią nadawcy”                         | kod tła i obrysu kart    | nie                       | **usuń**; zamiast niej jedna etykieta przy celu („inna sieć”)                    | Trzeci kod wizualny na kartach (rola + tło + obrys przerywany)                                                                                                                                                                         |
| Diagram: 6 urządzeń                                                     | topologia                | tak                       | **zostaw**, ale pokazuj tylko urządzenia z ćwiczenia                             | —                                                                                                                                                                                                                                      |
| Karty hostów: „Brama: …”                                                | brama                    | tylko w P1                | **schowaj** poza P1                                                              | Bramy Drukarki i Kamery zmieniają się z maską (np. .129, .193), brama Laptopa nie – bez wyjaśnienia. W trybie swobodnym przy /26–/30 Laptop „nie może wysłać” do nikogo spoza działki; uczeń może wywnioskować „duża maska psuje sieć” |
| Karta Routera: „+ adres w każdej podsieci”                              | Router-on-a-Stick        | nie                       | **usuń** (notatka dla nauczyciela)                                               | Pojęcie z Lab 2                                                                                                                                                                                                                        |
| Karta Switcha: „Nie zna masek – czyta MAC”                              | maska ≠ ściana           | tak                       | **przenieś** do M4                                                               | Dobre zdanie, ale ginie wśród innych                                                                                                                                                                                                   |
| Etykieta na kablu „do Routera / do Drukarki”                            | droga ramki              | tak                       | **rozdziel** na dwa odcinki czasowe                                              | Dwie ramki na jednym kablu, jedna etykieta                                                                                                                                                                                             |
| Ramka „🔌 Warstwa fizyczna się nie zmienia…” (35 słów, zawsze widoczna) | maska ≠ ściana           | tak                       | **przenieś** do M4 jako osobne ćwiczenie; potem 1 linia przypomnienia            | Najważniejsze zdanie merytoryczne leży pod diagramem jak przypis                                                                                                                                                                       |
| Panel „Decyzja nadawcy” (7 wierszy) + werdykt                           | decyzja                  | tak                       | **zostaw** 2 wiersze („Drukarka .130: inna sieć → do bramy”) przy karcie nadawcy | [R] Wynik + werdykt + lekcja; [PU] panel z prawej, karta nadawcy z lewej                                                                                                                                                               |
| Werdykt pomarańczowy (objazd) / czerwony (brak bramy)                   | —                        | —                         | zmień kolor objazdu                                                              | Pomarańczowy w ARP = Broadcast; tu = objazd i „działka celu”                                                                                                                                                                           |
| Ulica adresów + tabela (blok, działki, adres sieci, Broadcast)          | granice, blok, Broadcast | oś tak (M2), tabela nie   | oś → M2, tabela → L1–L2                                                          | [R] adres sieci: panel decyzji + tabela + Bity                                                                                                                                                                                         |
| Bity (5 wierszy × 8 bitów, wstęp 30 słów, wynik)                        | AND                      | nie dla celu              | **przenieś** do L3                                                               | 1000 px od lekcji                                                                                                                                                                                                                      |
| Lekcja 3: zdanie o Windows/Linux                                        | diagnostyka              | nie                       | **przenieś** do notatki dla nauczyciela                                          | —                                                                                                                                                                                                                                      |

### 2.3 Redundancja – ta sama informacja w kilku miejscach

| Informacja                         | ARP – gdzie                                                                                  | Maska – gdzie                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Typ ramki / Broadcast albo Unicast | tytuł kroku, pasek warstwy, etykieta na kablu, pigułka w panelu ramki, legenda, opis (**6**) | —                                                                                  |
| „Cel jest w innej sieci”           | —                                                                                            | lekcja, wiersz „Wynik”, werdykt, tło karty, Ulica „za płotem”, wynik Bitów (**6**) |
| Adres sieci nadawcy                | —                                                                                            | panel decyzji, tabela Ulicy, wiersz Bitów (**3**)                                  |
| Maska                              | —                                                                                            | suwak, wyjście „/25 = …”, karty urządzeń, wiersz Bitów (**4**)                     |
| Nowy wpis w tablicy                | opis kroku + podświetlony wiersz + pigułka „nowy wpis” (**3**)                               | —                                                                                  |

**Zasada naprawy:** jedno źródło na każdy fakt: **na obiekcie** (karta, kabel, wiersz tablicy) albo **w tekście kroku**, nie w obu. Tekst opisuje działanie („Switch zapisuje…”), a obiekt pokazuje wartość (podświetlony wiersz).

### 2.4 Podzielona uwaga – odległości (1366×768, pasek nawigacji 53 px, użyteczne 715 px)

| Para elementów, które uczeń musi zestawić                | Odległość pionowa                                                                               | Mieści się w 715 px?                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| ARP: animacja (góra diagramu) ↔ przycisk „Następny krok” | 685 / 710 / 836 / 814 / 940 / 1025 px (kroki 0–5)                                               | tylko kroki 0–1, z zapasem 5–30 px; przy 1280×720 żaden |
| ARP: opis kroku ↔ tablica, o której mówi (krok 4)        | opis y 1223 (lewy dół), tablica ARP y ~790 (prawa góra) → ~430 px w pionie i ~700 px w poziomie | mieści się, ale na przeciwnych końcach ekranu           |
| ARP: karta Laptopa ↔ tablica ARP Laptopa                 | ~900 px w poziomie (przeciwne strony ekranu)                                                    | tak, ale wzrok przechodzi przez cały diagram            |
| Maska: lekcja ↔ dół diagramu                             | 843–894 px                                                                                      | nie                                                     |
| Maska: lekcja „płot na .128” ↔ płot na Ulicy             | ~1050 px                                                                                        | nie                                                     |
| Maska: lekcja ↔ Bity                                     | ~1360 px                                                                                        | nie                                                     |

Zrzut `img/arp-1366-5-clickview.png` pokazuje skutek: w chwili kliknięcia „Następny krok” w kroku 5 diagram jest prawie cały ukryty nad krawędzią ekranu, a animacja odtwarza się poza wzrokiem ucznia.

### 2.5 Co działa dobrze – zachować

| Co                                                                                                                     | Dlaczego warto zachować                                                          |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Jedna topologia biura i stałe adresy (10.10.10.0/24, Laptop .105, Serwer NAS .30, Router (Brama) .1) w obu ćwiczeniach | Uczeń nie uczy się nowej sceny – cała pamięć robocza idzie na nowe pojęcie       |
| Stałe nazwy urządzeń zgodne z glosariuszem                                                                             | Brak dwuznaczności („Router (Brama)”, nie raz „router”, raz „brama”)             |
| Odznaki ról na kartach (Wysyła, Odbiera, Odrzuca, Nie może wysłać)                                                     | Sygnalizacja na obiekcie – zgodna z zasadą bliskości przestrzennej               |
| Spójny kod koloru ramek w ARP: pomarańczowy = Broadcast, zielony = Unicast                                             | Jeden kanał koloru = jedno znaczenie. Warto przenieść tę zasadę na Maskę         |
| Podświetlenie „nowy wpis” w tablicach                                                                                  | Pokazuje zmianę, a nie cały stan                                                 |
| Krok po kroku w tempie ucznia + strzałki ← →                                                                           | Segmentacja i sterowanie przy rzutniku                                           |
| Tytuły kroków jako nazwy działań („ARP Reply – Serwer NAS odpowiada tylko Laptopowi”)                                  | Uczeń wie, na co patrzeć, zanim przeczyta opis                                   |
| Diagram jako slajd (bez przeciągania, bez zoomu)                                                                       | Brak przypadkowych akcji                                                         |
| Pytania „Sprawdź się” i pytanie o 8.8.8.8 jako most do scenariusza 2                                                   | Zgodne z zasadą z `plan.md`: każdy scenariusz kończy się pytaniem dla następnego |
| Maska: poprawność merytoryczna („maska to reguła nadawcy”, „Switch nie zna masek”)                                     | Chroni przed najczęstszym błędnym modelem („maska to ściana”)                    |
| Maska: decyzja w pierwszej osobie („moja sieć”, „moja brama”)                                                          | Uczeń przyjmuje perspektywę nadawcy – to sedno lekcji                            |
| Maska: metafora płotu i działki na osi adresów                                                                         | Konkretna, przestrzenna; dobrze pokazuje rozmiar bloku i wielokrotności          |
| Maska: czerwony bit, który się różni                                                                                   | Precyzyjna sygnalizacja przyczyny wyniku                                         |
| Maska: gotowe przykłady numerowane „kliknij po kolei”                                                                  | To już jest zalążek sekwencji mikro-ćwiczeń                                      |

---

## 3. Pomiar ekranu

Pomiar: viewport bez `fullPage`, pasek nawigacji przyklejony u góry (53 px), więc użyteczna wysokość to **715 px** (1366×768) i **667 px** (1280×720). „Elementy sterujące” = przyciski, suwak, pole wyboru, `<summary>` w symulatorze (bez linku „React Flow”). „Słowa” = słowa w obszarze symulatora (`#root`); w nawiasie – cała widoczna strona.

### 3.1 Symulator ARP

| Krok  | Wysokość strony (px) | Słowa w opisie kroku | Słowa w symulatorze łącznie | Bez przewijania (1366×768): sterujące / słowa | Po przewinięciu do diagramu: sterujące / słowa | Diagram + opis + przycisk razem? 1366×768 / 1280×720 |
| ----- | -------------------- | -------------------- | --------------------------- | --------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| Start | 1197                 | 36                   | 116                         | 0 / 39 (100)                                  | 3 / 116                                        | tak (685 px) / nie                                   |
| 1     | 1222                 | 53                   | 136                         | 0 / 40 (101)                                  | 3 / 136                                        | tak (710 px) / nie                                   |
| 2     | 1348                 | 41                   | 145                         | 0 / 42 (103)                                  | 0 / 131                                        | nie (836 px) / nie                                   |
| 3     | 1326                 | 56                   | 164                         | 0 / 46 (107)                                  | 0 / 150                                        | nie (814 px) / nie                                   |
| 4     | 1452                 | 68                   | 182                         | 0 / 41 (102)                                  | 0 / 168                                        | nie (940 px) / nie                                   |
| 5     | 1537                 | 48 + 2 pytania       | 192                         | 0 / 45 (106)                                  | 0 / 149                                        | nie (1025 px) / nie                                  |

Co widać bez przewijania w 1366×768 (każdy krok): pasek nawigacji, tytuł i podtytuł, okruszki, karta „Inny świat”, legenda, górne ~290 px diagramu (tylko karta Routera). **Zero przycisków symulatora, zero tekstu kroku.** W 1280×720 – to samo, słów w symulatorze 35–43.

### 3.2 Wizualizacja maski

| Przykład  | Wysokość strony (px) | Słowa w lekcji | Słowa w symulatorze łącznie | Bez przewijania (1366×768): sterujące / słowa | Widok lekcji i sterowania: sterujące / słowa | Widok diagramu: sterujące / słowa | Widok Ulicy i Bitów: słowa | Lekcja → dół diagramu |
| --------- | -------------------- | -------------- | --------------------------- | --------------------------------------------- | -------------------------------------------- | --------------------------------- | -------------------------- | --------------------- |
| 1 /24     | 2092                 | 22             | 358                         | 8 / 68 (137)                                  | 11 / 140                                     | 0 / 142                           | 211                        | 843 px                |
| 2 /25     | 2152                 | 33             | 383                         | 8 / 76 (145)                                  | 11 / 152                                     | 0 / 164                           | 210                        | 868 px                |
| 3 /26     | 2152                 | 49             | 403                         | 8 / 92 (161)                                  | 11 / 165                                     | 0 / 163                           | 218                        | 868 px                |
| 4 pułapka | 2177                 | 52             | 414                         | 8 / 84 (153)                                  | 11 / 171                                     | 0 / 168                           | 215                        | 894 px                |

Co widać bez przewijania w 1366×768: nagłówek, okruszki, karta „Inny świat”, 4 przykłady, lekcja, górna część sterowania (suwak, 3 przyciski celu). **Diagramu nie widać.** W 1280×720 widać tylko 4 elementy sterujące. Cała strona to **~3 ekrany** przewijania (2092–2177 px), a w każdym widoku jest 140–218 słów.

### 3.3 Wniosek z pomiaru

| Wskaźnik                        | ARP dziś                  | Maska dziś              | Cel                   |
| ------------------------------- | ------------------------- | ----------------------- | --------------------- |
| Ekranów do przewinięcia         | 1,7–2,1                   | 2,9–3,0                 | 1                     |
| Sterujące widoczne przy wejściu | 0                         | 4–8                     | 1                     |
| Sterujące razem w ćwiczeniu     | 3 (+2 pytania)            | 11                      | 1 (+ stały pasek ← →) |
| Słowa w opisie kroku            | 36–68                     | 22–52 (+ werdykt 15–30) | ≤ 40                  |
| Słowa widoczne naraz            | 116–192 (po przewinięciu) | 140–218                 | ≤ 100                 |
| Nowe pojęcia na ekran           | 2–4                       | 4–6                     | 1                     |

---

## 4. Czy rozdzielić tematy? Tak – sekwencja mikro-ćwiczeń

**Odpowiedź:** tak. Nie przez wycinanie treści, tylko przez **rozłożenie jej w czasie**. Te same urządzenia, ta sama topologia, te same komponenty (`Diagram`, `DeviceNode`, `PacketEdge`, `AddressLine`, `BitRuler`), ale na każdym ekranie: jedno pytanie, jedno nowe pojęcie, jeden element sterujący, jeden ekran. Obecne pełne widoki mogą zostać na końcu serii jako „Tryb swobodny” (patrz decyzja 2).

Reguła „jeden element sterujący”: w ćwiczeniu jest **albo** przycisk „Dalej” (kroki), **albo** jeden przełącznik/suwak (eksperyment). Stały pasek „← poprzednie ćwiczenie / następne ćwiczenie →” na dole ekranu nie zmienia się między ćwiczeniami i nie liczy się jako nowy element.

### 4.1 Sekwencja

| #   | Ćwiczenie                 | Pytanie dla ucznia                                        | Nowe pojęcie                                     | Sterowanie                   | Zostawia pytanie dla następnego                                                   |
| --- | ------------------------- | --------------------------------------------------------- | ------------------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------- |
| A1  | Czego brakuje Laptopowi?  | Laptop chce wysłać plik do Serwera NAS. Czego mu brakuje? | ramka potrzebuje adresu MAC odbiorcy             | Dalej                        | Jak zapytać o MAC, skoro nie wiadomo, do kogo pisać?                              |
| A2  | Pytanie do wszystkich     | Do kogo Laptop wyśle pytanie?                             | ARP Request jako Broadcast                       | Dalej                        | Pytanie dostały dwa urządzenia. Które odpowie?                                    |
| A3  | Kto odpowiada?            | Kto odpowie i do kogo?                                    | ARP Reply jako Unicast                           | Dalej                        | Laptop dostał MAC. Co z nim zrobi?                                                |
| A4  | Zapamiętaj i wyślij       | Czy przy drugim pliku Laptop znowu zapyta?                | tablica ARP                                      | Dalej                        | Switch wysłał ramkę tylko na jeden port. Skąd wiedział, na który?                 |
| B1  | Switch się uczy           | Skąd Switch wie, na który port wysłać ramkę?              | tablica MAC (uczenie się z MAC nadawcy)          | Dalej                        | Switch ma dwa wpisy. Na które porty wyśle ramkę do Laptopa?                       |
| B2  | Switch korzysta z tablicy | Na które porty Switch wyśle ARP Reply?                    | przełączanie na jeden port                       | Dalej                        | Laptop wysyła dane do 8.8.8.8. O czyj MAC zapyta?                                 |
| M1  | Moja sieć czy inna?       | Które adresy są w sieci Laptopa?                          | numer sieci (maska /24)                          | Dalej                        | Czy płot może stanąć wewnątrz sieci 10.10.10.0?                                   |
| M2  | Płot na ulicy             | Czy przy /25 Drukarka .130 jest w sieci Laptopa?          | granica podsieci                                 | przełącznik /24 ⇄ /25        | Ten sam Switch. Jak Laptop wyśle plik do Drukarki?                                |
| M3  | Objazd przez Router       | Którą drogą pójdzie ramka do Drukarki?                    | inna sieć → brama                                | przełącznik /24 ⇄ /25        | Czy maska /25 zatrzyma Broadcast przed Drukarką?                                  |
| M4  | Maska to nie ściana       | Czy Drukarka dostanie ARP Request przy /25?               | Broadcast ignoruje maskę                         | Dalej                        | Sieci rozdziela Router. Co Router zmienia w ramce? → **Scenariusz 2** z `plan.md` |
| L1  | Rozmiar bloku             | Co ile adresów stoi płot przy /26?                        | blok 2^(32−n)                                    | suwak /24–/30                | W której działce jest Laptop .105?                                                |
| L2  | Adres sieci i Broadcast   | Jaki jest adres sieci i Broadcast działki Laptopa?        | adres sieci, adres Broadcast, liczba hostów      | suwak /24–/30                | Jak liczy to komputer, który nie widzi ulicy?                                     |
| L3  | Bity: jak liczy komputer  | Które bity należą do sieci?                               | AND maski i adresu                               | suwak /24–/30                | Ten sam rachunek dla celu → decyzja (powrót do M3)                                |
| P1  | Brama za płotem           | Czy Laptop z /26 i bramą .1 wyśle plik?                   | brama musi być w sieci hosta                     | Dalej                        | A jeśli błędna maska jest na Serwerze NAS?                                        |
| P2  | Różne maski               | Którędy idzie zapytanie, a którędy odpowiedź?             | maska działa tylko u nadawcy (ruch asymetryczny) | przełącznik Tam ⇄ Z powrotem | Router dostał odpowiedź. Którym portem ją wyśle? → **Scenariusz 3**               |

### 4.2 Miejsce w kursie i w `plan.md`

```text
Teoria Krok 4 (ARP)                    Teoria Krok 5 (Subnetting)
       |                                        |
  A1 - A2 - A3 - A4 - B1 - B2 - M1 - M2 - M3 - M4 --> Scenariusz 2: Do Internetu
  (scenariusz 1 z plan.md)  (wizualizacja maski)        przez bramę (plan.md)
                                   |                         |
                                   +-- L1 - L2 - L3          +-- P1 - P2
                                       (liczenie podsieci,       (pułapki, po
                                        gałąź do Kroku 5)        Lab 1 Fazie 3)
                                                                   |
                                                         Scenariusz 3: Tablica
                                                         routingu (plan.md)
```

| Powiązanie                                                                      | Teraz                     | Po zmianie                                                                                                                                                                  |
| ------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lab 1 Faza 1 („przejdź wszystkie kroki”, odwołuje się do „Kroku 1” i „Kroku 5”) | cały symulator ARP        | A1–B2 + M1 (decyzja „ta sama sieć” – PC3 192.168.2.30 z Lab 1 to dokładnie M1). **Trzeba zaktualizować tekst odsyłacza w `lab1-podstawy.html`** – numery kroków się zmienią |
| Lab 1 Faza 2 (brama domyślna)                                                   | brak symulatora           | M3                                                                                                                                                                          |
| Lab 1 Faza 3 (dwie sieci, pierwszy ping ginie przez ARP)                        | brak                      | Scenariusz 2, potem P1–P2                                                                                                                                                   |
| Pytanie-most z ARP o 8.8.8.8 (zasada z `plan.md`)                               | koniec ARP → scenariusz 2 | koniec B2 → M1–M4 → scenariusz 2. Pytanie zostaje, odpowiedź przychodzi stopniowo                                                                                           |
| Motyw „każde urządzenie coś pamięta w tabeli” (`plan.md`)                       | dwie tablice naraz        | A4: tablica Laptopa, B1–B2: tablica Switcha – jedna tabela na serię                                                                                                         |

---

## 5. Makiety

### 5.0 Szablon każdego ekranu i budżet wysokości

```text
+------------------------------------------------------------------------------+
| INF.02 Baza Wiedzy (stały pasek nawigacji)                        53 px      |
+------------------------------------------------------------------------------+
| ARP · A2 z 4   [x][x][ ][ ]                Przykładowe biuro (i)  36 px      |
| PYTANIE: jedno pytanie, jedna linia                               40 px      |
+---------------------------------------------+--------------------------------+
| DIAGRAM 340 px (~860 px szerokości)         | Krok 1 z 2                     |
| - tylko urządzenia z tego ćwiczenia,        | Tekst kroku: najwyżej 40 słów, |
|   pozostałe wyszarzone albo ukryte          | jedno działanie, dokładne      |
| - jedna animowana ramka naraz               | wartości.                      |
| - tablica stoi przy swoim urządzeniu        |                                |
| - odznaki ról na kartach (jak dziś)         | [ Dalej -> ]                   |
|                                             | (jedyny element sterujący)     |
|                                             |                                |
|                                             |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: tylko to, co zmieniło się w tym kroku (1 pole lub 1 wpis)  56 px     |
+------------------------------------------------------------------------------+
| <- poprzednie ćwiczenie                       następne ćwiczenie ->  36 px   |
+------------------------------------------------------------------------------+
```

Budżet: 53 + 36 + 40 + 340 + 56 + 36 + odstępy 64 = **625 px** (zapas 90 px przy 1366×768 i 42 px przy 1280×720). Karta „Inny świat” zamienia się w dymek „Przykładowe biuro (i)”. Tekst kroku stoi **obok** animacji, a przycisk **pod tekstem** – oko nie opuszcza jednego obszaru 360×340 px. Na telefonie (< 900 px) kolumna tekstu spada pod diagram, przycisk zostaje pod tekstem.

### 5.1 A1 – Czego brakuje Laptopowi?

```text
+------------------------------------------------------------------------------+
| ARP · A1 z 4   [x][ ][ ][ ]                    Przykładowe biuro (i)         |
| PYTANIE: Laptop chce wysłać plik do Serwera NAS. Czego mu brakuje?           |
+---------------------------------------------+--------------------------------+
|            [Router (Brama)]  (szary)        | Krok 1 z 2                     |
|                    |                        | Laptop i Serwer NAS są w tej   |
| [  Laptop    ]--[Switch]--[ Serwer NAS  ]   | samej sieci 10.10.10.0/24.     |
| [10.10.10.105]            [ 10.10.10.30 ]   | Laptop zna adres IP Serwera    |
|                           [ MAC: ???    ]   | NAS: 10.10.10.30. Którego pola |
|                                             | w kopercie ramki Laptop nie    |
| Koperta ramki przy Laptopie:                | umie wypełnić?                 |
| +-----------------------------------+       |                                |
| | MAC odbiorcy:  ???     <- miga    |       | [ Pokaż odpowiedź -> ]         |
| | MAC nadawcy:   AA:BB:CC:00:01:05  |       |                                |
| | IP odbiorcy:   10.10.10.30        |       |                                |
| +-----------------------------------+       |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: brak – punkt startowy.        Tablica ARP Laptopa: (pusta)           |
+------------------------------------------------------------------------------+
| <- (początek serii)                         A2 Pytanie do wszystkich ->      |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                         | Słowa |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Laptop i Serwer NAS są w tej samej sieci 10.10.10.0/24. Laptop zna adres IP Serwera NAS: 10.10.10.30. Którego pola w kopercie ramki Laptop nie umie wypełnić? | 26    |
| K2   | Brakuje adresu MAC odbiorcy. Bez niego Laptop nie zbuduje ramki. Tablica ARP Laptopa jest pusta, więc Laptop musi zapytać inne urządzenia.                    | 21    |

### 5.2 A2 – Pytanie do wszystkich

```text
+------------------------------------------------------------------------------+
| ARP · A2 z 4   [x][x][ ][ ]                    Przykładowe biuro (i)         |
| PYTANIE: Laptop nie wie, kto ma adres 10.10.10.30. Do kogo wyśle pytanie?    |
+---------------------------------------------+--------------------------------+
|            [Router (Brama)]                 | Krok 1 z 2                     |
|                    ^  kopia (K2)            | Laptop wysyła ramkę ARP        |
|                    |                        | Request z pytaniem: „Kto ma    |
| [  Laptop    ]==>[Switch]==>[ Serwer NAS ]  | 10.10.10.30?”. Nie zna MAC     |
|    Wysyła    ARP   Przełącza    kopia (K2)  | odbiorcy, więc wpisuje         |
|             Request                         | FF:FF:FF:FF:FF:FF. To adres    |
|                                             | Broadcast: ramka do            |
| K1: animowany odcinek Laptop -> Switch      | wszystkich.                    |
| K2: dwie kopie naraz (jedno zdarzenie)      |                                |
| Kolor ramki: pomarańczowy = Broadcast       | [ Dalej -> ]                   |
+---------------------------------------------+--------------------------------+
| ZMIANA: MAC odbiorcy = FF:FF:FF:FF:FF:FF  [Broadcast]                        |
+------------------------------------------------------------------------------+
| <- A1 Czego brakuje Laptopowi?                   A3 Kto odpowiada? ->        |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                             | Słowa |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Laptop wysyła ramkę ARP Request z pytaniem: „Kto ma 10.10.10.30?”. Nie zna MAC odbiorcy, więc wpisuje FF:FF:FF:FF:FF:FF. To adres Broadcast: ramka do wszystkich. | 23    |
| K2   | Switch widzi adres Broadcast. Wysyła kopię ramki na wszystkie porty oprócz tego, z którego przyszła. Kopie dostają Router (Brama) i Serwer NAS.                   | 22    |

### 5.3 A3 – Kto odpowiada?

```text
+------------------------------------------------------------------------------+
| ARP · A3 z 4   [x][x][x][ ]                    Przykładowe biuro (i)         |
| PYTANIE: Pytanie dostały Router (Brama) i Serwer NAS. Kto odpowie i do kogo? |
+---------------------------------------------+--------------------------------+
|            [Router (Brama)]  Odrzuca (K1)   | Krok 2 z 2                     |
|                    |                        | Serwer NAS ma adres            |
| [  Laptop    ]<==[Switch]<==[ Serwer NAS ]  | 10.10.10.30. Wysyła ARP Reply: |
|    Odbiera   ARP   Przełącza   Wysyła       | „Mój MAC to                    |
|              Reply                          | AA:BB:CC:00:00:30”. MAC        |
|                                             | Laptopa zna z ramki ARP        |
| K1: Router (Brama) z odznaką „Odrzuca”      | Request, więc odpowiada tylko  |
| K2: jedna ramka Serwer NAS -> Laptop        | jemu. To Unicast: ramka do     |
| Kolor ramki: zielony = Unicast              | jednego urządzenia.            |
|                                             |                                |
|                                             | [ Dalej -> ]                   |
+---------------------------------------------+--------------------------------+
| ZMIANA: MAC odbiorcy = AA:BB:CC:00:01:05 (Laptop)  [Unicast]                 |
+------------------------------------------------------------------------------+
| <- A2 Pytanie do wszystkich                   A4 Zapamiętaj i wyślij ->      |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                                       | Słowa |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Router (Brama) ma adres 10.10.10.1, a nie 10.10.10.30. Pytanie nie dotyczy Routera, więc Router odrzuca ramkę i nic nie odpowiada.                                                          | 20    |
| K2   | Serwer NAS ma adres 10.10.10.30. Wysyła ARP Reply: „Mój MAC to AA:BB:CC:00:00:30”. MAC Laptopa zna z ramki ARP Request, więc odpowiada tylko jemu. To Unicast: ramka do jednego urządzenia. | 29    |

### 5.4 A4 – Zapamiętaj i wyślij

```text
+------------------------------------------------------------------------------+
| ARP · A4 z 4   [x][x][x][x]                    Przykładowe biuro (i)         |
| PYTANIE: Minutę później Laptop wysyła drugi plik. Czy znowu zapyta (ARP)?    |
+---------------------------------------------+--------------------------------+
|            [Router (Brama)]  (nie bierze    | Krok 1 z 3                     |
|                    |          udziału)      | Laptop zapisuje odpowiedź w    |
| [  Laptop    ]==>[Switch]==>[ Serwer NAS ]  | tablicy ARP: 10.10.10.30 →     |
|    Wysyła   Dane   Przełącza   Odbiera      | AA:BB:CC:00:00:30.             |
| +----------------------------------+        |                                |
| | Tablica ARP Laptopa              |        | [ Dalej -> ]                   |
| | 10.10.10.30  AA:BB:CC:00:00:30   |        |                                |
| |              nowy wpis           |        |                                |
| +----------------------------------+        |                                |
| (tablica przyklejona do karty Laptopa)      |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: Tablica ARP Laptopa: +1 wpis                                         |
+------------------------------------------------------------------------------+
| <- A3 Kto odpowiada?                          B1 Switch się uczy ->          |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                  | Słowa |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| K1   | Laptop zapisuje odpowiedź w tablicy ARP: 10.10.10.30 → AA:BB:CC:00:00:30.                                                                              | 8     |
| K2   | Laptop wkłada pakiet IP z plikiem do ramki z MAC odbiorcy AA:BB:CC:00:00:30. Switch wysyła ją tylko do Serwera NAS. Router (Brama) nie bierze udziału. | 24    |
| K3   | Drugi plik: Laptop bierze MAC z tablicy ARP i nie pyta. Wpis znika po kilku minutach. Dopiero wtedy Laptop znowu wyśle ARP Request.                    | 23    |

### 5.5 B1 – Switch się uczy

Ta sama wymiana ramek co w A2–A4, ale „soczewka” jest na Switchu: na diagramie pojawiają się porty, a jedyna tablica to tablica MAC Switcha.

```text
+------------------------------------------------------------------------------+
| ARP · B1 z 2   [x][ ]   Soczewka: Switch       Przykładowe biuro (i)         |
| PYTANIE: Switch nie ma adresu IP. Skąd wie, na który port wysłać ramkę?      |
+---------------------------------------------+--------------------------------+
|            [Router (Brama)]                 | Krok 1 z 2                     |
|                    | Fa0/3                  | Ramka ARP Request wchodzi do   |
| [  Laptop    ]==>[Switch]---[ Serwer NAS ]  | Switcha portem Fa0/1. Switch   |
|             Fa0/1       Fa0/2               | czyta MAC nadawcy i zapisuje w |
| +----------------------------------+        | tablicy MAC: AA:BB:CC:00:01:05 |
| | Tablica MAC Switcha              |        | → Fa0/1.                       |
| | AA:BB:CC:00:01:05 (Laptop) Fa0/1 |        |                                |
| |                       nowy wpis  |        | [ Dalej -> ]                   |
| +----------------------------------+        |                                |
| (tablica przyklejona do karty Switcha)      |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: Tablica MAC Switcha: +1 wpis (MAC nadawcy -> port wejścia)           |
+------------------------------------------------------------------------------+
| <- A4 Zapamiętaj i wyślij                 B2 Switch korzysta z tablicy ->    |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                | Słowa |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| K1   | Ramka ARP Request wchodzi do Switcha portem Fa0/1. Switch czyta MAC nadawcy i zapisuje w tablicy MAC: AA:BB:CC:00:01:05 → Fa0/1.     | 19    |
| K2   | Ramka ARP Reply wchodzi portem Fa0/2. Switch zapisuje: AA:BB:CC:00:00:30 → Fa0/2. Switch uczy się z adresu MAC nadawcy każdej ramki. | 19    |

### 5.6 B2 – Switch korzysta z tablicy

```text
+------------------------------------------------------------------------------+
| ARP · B2 z 2   [x][x]   Soczewka: Switch       Przykładowe biuro (i)         |
| PYTANIE: ARP Reply idzie do MAC Laptopa. Na które porty wyśle ją Switch?     |
+---------------------------------------------+--------------------------------+
|            [Router (Brama)]  brak ramki     | Krok 1 z 2                     |
|                    | Fa0/3                  | Switch szuka AA:BB:CC:00:01:05 |
| [  Laptop    ]<==[Switch]<==[ Serwer NAS ]  | w tablicy MAC. Znajduje port   |
|             Fa0/1       Fa0/2               | Fa0/1. Wysyła ramkę tylko na   |
| +----------------------------------+        | ten port. Router (Brama) jej   |
| | Tablica MAC Switcha              |        | nie dostaje.                   |
| | AA:BB:CC:00:01:05 (Laptop) Fa0/1 |        |                                |
| |       ^ podświetlony             |        | [ Dalej -> ]                   |
| | AA:BB:CC:00:00:30 (NAS)    Fa0/2 |        |                                |
| +----------------------------------+        |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: użyty wpis tablicy MAC: AA:BB:CC:00:01:05 -> Fa0/1                   |
| NA KONIEC (pytanie-most): Laptop wysyła dane do 8.8.8.8. O czyj MAC zapyta?  |
+------------------------------------------------------------------------------+
| <- B1 Switch się uczy                          M1 Moja sieć czy inna? ->     |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                            | Słowa |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Switch szuka AA:BB:CC:00:01:05 w tablicy MAC. Znajduje port Fa0/1. Wysyła ramkę tylko na ten port. Router (Brama) jej nie dostaje.                               | 20    |
| K2   | Porównaj z ARP Request: tam MAC odbiorcy to Broadcast, więc Switch wysłał kopię na wszystkie porty. Adres z tablicy MAC: jeden port. Broadcast: wszystkie porty. | 25    |

Uwaga do tablicy w makiecie: w aplikacji wpis ma pełną nazwę „(Serwer NAS)”; skrót „NAS” jest tylko w makiecie ASCII.

### 5.7 M1 – Moja sieć czy inna?

```text
+------------------------------------------------------------------------------+
| MASKA · M1 z 4   [x][ ][ ][ ]                  Przykładowe biuro (i)         |
| PYTANIE: Laptop ma adres 10.10.10.105/24. Które adresy są w jego sieci?      |
+---------------------------------------------+--------------------------------+
|                numer sieci | host           | Krok 1 z 3                     |
| Laptop          10.10.10   | .105           | Maska /24: pierwsze 24 bity,   |
| ------------------------------------------- | czyli pierwsze 3 liczby        |
| Serwer NAS      10.10.10   | .30   ta sama  | adresu, to numer sieci.        |
| Drukarka        (ukryte do K2)              | Laptop: 10.10.10. Serwer NAS:  |
| 8.8.8.8         (ukryte do K3)              | 10.10.10. Ten sam numer, więc  |
|                                             | Serwer NAS jest w sieci        |
| Kolumna „numer sieci” podświetlona.         | Laptopa.                       |
| Każde „Dalej” odsłania jeden wiersz.        |                                |
| Bez diagramu sieci – tylko porównanie.      | [ Pokaż następny adres -> ]    |
+---------------------------------------------+--------------------------------+
| ZMIANA: nowy wiersz porównania                                               |
+------------------------------------------------------------------------------+
| <- B2 Switch korzysta z tablicy                   M2 Płot na ulicy ->        |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                     | Słowa |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Maska /24: pierwsze 24 bity, czyli pierwsze 3 liczby adresu, to numer sieci. Laptop: 10.10.10. Serwer NAS: 10.10.10. Ten sam numer, więc Serwer NAS jest w sieci Laptopa. | 28    |
| K2   | Drukarka 10.10.10.130: numer sieci 10.10.10 – taki sam. Drukarka jest w sieci Laptopa. Laptop wyśle do niej ramkę bezpośrednio, przez Switch.                             | 20    |
| K3   | Adres 8.8.8.8: numer sieci 8.8.8 – inny. To inna sieć. Laptop nie wyśle ramki prosto do 8.8.8.8. Jak to zrobi, zobaczysz w M3.                                            | 22    |

### 5.8 M2 – Płot na ulicy

```text
+------------------------------------------------------------------------------+
| MASKA · M2 z 4   [x][x][ ][ ]                  Przykładowe biuro (i)         |
| PYTANIE: Przełącz maskę na /25. Czy Drukarka .130 jest w sieci Laptopa?      |
+---------------------------------------------+--------------------------------+
| Maska:  (  /24  | [/25] )  <- przełącznik   | Przy /25:                      |
|                                             | Maska /25 dzieli adresy        |
|       Laptop .105       Drukarka .130       | .0–.255 na dwie sieci po 128   |
|            v                v               | adresów. Płot stoi na .128.    |
| |================|################|         | Laptop .105 jest przed płotem, |
| .0             .128            .255         | Drukarka .130 za płotem. To    |
|  sieć Laptopa  ^ płot  inna sieć            | dwie różne sieci.              |
|  (niebieska)          (szara)               |                                |
|                                             |                                |
| Pozostałe urządzenia ukryte.                |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: płot pojawia się na .128 (jedyna animacja: płot „wyrasta”)           |
+------------------------------------------------------------------------------+
| <- M1 Moja sieć czy inna?                     M3 Objazd przez Router ->      |
+------------------------------------------------------------------------------+
```

| Krok     | Tekst                                                                                                                                                         | Słowa |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1 (/24) | Maska /24: jedna sieć .0–.255, bez płotów. Laptop .105 i Drukarka .130 są w tej samej sieci.                                                                  | 17    |
| K2 (/25) | Maska /25 dzieli adresy .0–.255 na dwie sieci po 128 adresów. Płot stoi na .128. Laptop .105 jest przed płotem, Drukarka .130 za płotem. To dwie różne sieci. | 28    |

Kolor „innej sieci”: szary, nie pomarańczowy – pomarańczowy zostaje zarezerwowany dla Broadcastu w obu ćwiczeniach.

### 5.9 M3 – Objazd przez Router

```text
+------------------------------------------------------------------------------+
| MASKA · M3 z 4   [x][x][x][ ]                  Przykładowe biuro (i)         |
| PYTANIE: Maska /25. Którą drogą pójdzie ramka z Laptopa do Drukarki?         |
+---------------------------------------------+--------------------------------+
| Maska Laptopa:  (  /24  | [/25] )           | Przy /25:                      |
|                                             | Laptop liczy swoją maską /25:  |
|            [Router (Brama)]                 | Drukarka .130 jest w innej     |
|              ^ 2       | 3                  | sieci. Laptop wysyła więc      |
|              |         v                    | ramkę do Routera (Brama), a    |
| [ Laptop ]=1=>[ Switch ]=4=>[ Drukarka ]    | Router przekazuje ją Drukarce. |
|    .105                         .130        | Ten sam Switch i te same kable |
| Myśl Laptopa (dymek przy karcie):           | – inna droga.                  |
| „.130 – inna sieć -> do bramy”              |                                |
|                                             |                                |
| Jedna kropka-ramka przechodzi 1-2-3-4.      |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: droga ramki: bezpośrednio (/24) albo przez Router (/25)              |
+------------------------------------------------------------------------------+
| <- M2 Płot na ulicy                           M4 Maska to nie ściana ->      |
+------------------------------------------------------------------------------+
```

| Krok     | Tekst                                                                                                                                                                                      | Słowa |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| K1 (/24) | Maska /24: Drukarka .130 jest w sieci Laptopa. Laptop wysyła ramkę bezpośrednio, przez sam Switch. Router (Brama) nie bierze udziału.                                                      | 20    |
| K2 (/25) | Laptop liczy swoją maską /25: Drukarka .130 jest w innej sieci. Laptop wysyła więc ramkę do Routera (Brama), a Router przekazuje ją Drukarce. Ten sam Switch i te same kable – inna droga. | 32    |

Notatka dla nauczyciela (nie na ekranie): Router potrzebuje adresu także w sieci Drukarki (np. 10.10.10.129). Karta Routera może pokazać oba adresy bez komentarza; wyjaśnienie przychodzi w Lab 2 (Router-on-a-Stick).

### 5.10 M4 – Maska to nie ściana

```text
+------------------------------------------------------------------------------+
| MASKA · M4 z 4   [x][x][x][x]                  Przykładowe biuro (i)         |
| PYTANIE: Maska /25. Czy Drukarka .130 dostanie ARP Request od Laptopa?       |
+---------------------------------------------+--------------------------------+
| Maska na wszystkich: /25                    | Krok 1 z 2                     |
|                                             | Laptop wysyła ARP Request:     |
|            [Router (Brama)]                 | „Kto ma 10.10.10.30?”. Przy    |
|                    ^                        | masce /25 Drukarka .130 i      |
| [ Laptop ]==>[  Switch  ]                   | Kamera .200 są za płotem.      |
|            /       |       \                | Kliknij i sprawdź, kto         |
|           v        v        v               | dostanie ramkę.                |
| [Serwer NAS]  [Drukarka]  [Kamera]          |                                |
|     .30          .130        .200           | [ Wyślij ARP Request -> ]      |
|                                             |                                |
| Wszystkie kopie pomarańczowe (Broadcast).   |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: kopie Broadcastu docierają do wszystkich 4 urządzeń                  |
| NA KONIEC (pytanie-most do Scenariusza 2): Co Router zmienia w ramce?        |
+------------------------------------------------------------------------------+
| <- M3 Objazd przez Router            Scenariusz 2: Do Internetu ->           |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                                                                  | Słowa |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Laptop wysyła ARP Request: „Kto ma 10.10.10.30?”. Przy masce /25 Drukarka .130 i Kamera .200 są za płotem. Kliknij i sprawdź, kto dostanie ramkę.                                                                      | 24    |
| K2   | Tak, Kamera też. Switch nie zna masek – czyta tylko adresy MAC. Broadcast dostaje każde urządzenie podłączone do tego Switcha. Maska to reguła nadawcy, nie ściana w kablu. Sieci naprawdę rozdziela Router albo VLAN. | 33    |

### 5.11 L1 – Rozmiar bloku

```text
+------------------------------------------------------------------------------+
| LICZENIE · L1 z 3   [x][ ][ ]                  Przykładowe biuro (i)         |
| PYTANIE: Co ile adresów stoi płot przy masce /26? A przy /27?                |
+---------------------------------------------+--------------------------------+
| Maska: /24 ----o----------- /30  (suwak)    | Każdy kolejny bit maski dzieli |
|        /26  ->  płot co 64 adresy           | działki na pół. /24: 256       |
|                                             | adresów, /25: 128, /26: 64,    |
| |--------|--------|--------|--------|       | /27: 32. Rozmiar bloku = 2^(32 |
| .0      .64     .128     .192    .255       | − prefiks). Płoty stoją na     |
|                                             | wielokrotnościach bloku.       |
| Tylko płoty i podpisy. Bez urządzeń.        |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: liczba płotów i podpis „płot co N adresów”                           |
+------------------------------------------------------------------------------+
| <- M2 Płot na ulicy                     L2 Adres sieci i Broadcast ->        |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                  | Słowa |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Każdy kolejny bit maski dzieli działki na pół. /24: 256 adresów, /25: 128, /26: 64, /27: 32. Rozmiar bloku = 2^(32 − prefiks). Płoty stoją na wielokrotnościach bloku. | 26    |

### 5.12 L2 – Adres sieci i Broadcast

```text
+------------------------------------------------------------------------------+
| LICZENIE · L2 z 3   [x][x][ ]                  Przykładowe biuro (i)         |
| PYTANIE: Maska /26. Jaki adres sieci i adres Broadcast ma działka Laptopa?   |
+---------------------------------------------+--------------------------------+
| Maska: /24 ----o----------- /30  (suwak)    | Maska /26: blok 64. Laptop     |
|                                             | .105 jest w działce .64–.127.  |
|               Laptop .105                   | Pierwszy adres, .64, to adres  |
|                    v                        | sieci. Ostatni, .127, to adres |
| |--------|########|--------|--------|       | Broadcast. Hosty dostają       |
| .0      .64     .128     .192    .255       | adresy .65–.126, czyli 62      |
|          ^ adres sieci .64                  | adresy.                        |
|                   ^ Broadcast .127          |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: działka Laptopa i jej dwa skrajne adresy                             |
+------------------------------------------------------------------------------+
| <- L1 Rozmiar bloku                     L3 Bity: jak liczy komputer ->       |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                            | Słowa |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Maska /26: blok 64. Laptop .105 jest w działce .64–.127. Pierwszy adres, .64, to adres sieci. Ostatni, .127, to adres Broadcast. Hosty dostają adresy .65–.126, czyli 62 adresy. | 28    |

### 5.13 L3 – Bity: jak liczy komputer

```text
+------------------------------------------------------------------------------+
| LICZENIE · L3 z 3   [x][x][x]                  Przykładowe biuro (i)         |
| PYTANIE: Maska /26 to 255.255.255.192. Jak komputer liczy adres sieci?       |
+---------------------------------------------+--------------------------------+
| Maska: /24 ----o----------- /30  (suwak)    | Maska ma jedynki w bitach      |
|                    sieć | host              | sieci i zera w bitach hosta.   |
| IP Laptopa  .105   0 1  | 1 0 1 0 0 1       | Komputer zostawia bity IP tam, |
| Maska /26   .192   1 1  | 0 0 0 0 0 0       | gdzie maska ma 1, a resztę     |
| --------------------------------------      | zeruje (AND). .105 AND .192 =  |
| Sieć (AND)  .64    0 1  | 0 0 0 0 0 0       | .64 – adres sieci Laptopa.     |
|                                             |                                |
| Tylko 3 wiersze, tylko ostatnia liczba      |                                |
| (pierwsze trzy: 10.10.10 bez zmian).        |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: pionowa kreska sieć | host przesuwa się z suwakiem                   |
+------------------------------------------------------------------------------+
| <- L2 Adres sieci i Broadcast          (powrót do M3 albo Scenariusz 2) ->   |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                                                                                     | Słowa |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Maska ma jedynki w bitach sieci i zera w bitach hosta. Komputer zostawia bity IP tam, gdzie maska ma 1, a resztę zeruje (AND). .105 AND .192 = .64 – adres sieci Laptopa. | 31    |

Porównanie z celem (czerwony bit, jak dziś w `BitRuler`) wraca jako opcjonalny krok K2, gdy uczeń opanuje AND: „Ten sam rachunek dla Serwera NAS .30: .30 AND .192 = .0. Wyniki .64 i .0 są różne → inna sieć.” (21 słów).

### 5.14 P1 – Brama za płotem

```text
+------------------------------------------------------------------------------+
| PUŁAPKI · P1 z 2   [x][ ]                      Przykładowe biuro (i)         |
| PYTANIE: Laptop: maska /26, brama 10.10.10.1. Czy wyśle plik do Serwera NAS? |
+---------------------------------------------+--------------------------------+
| Sieć Laptopa przy /26: .64–.127             | Krok 1 z 3                     |
|                                             | Maska /26: sieć Laptopa to     |
| |  .1 brama  | .105 Laptop |      |      |  | .64–.127. Serwer NAS .30 jest  |
| |  .30 NAS   |             |      |      |  | w innej sieci, więc Laptop     |
| .0          .64          .128   .192        | chce oddać ramkę bramie.       |
|       ^ brama stoi za płotem                |                                |
|                                             | [ Dalej -> ]                   |
| [ Laptop 10.10.10.105/26 ]                  |                                |
| [ Brama: 10.10.10.1      ]  Nie może        |                                |
|                             wysłać          |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: K2 – odznaka „Nie może wysłać” na Laptopie; żadna ramka nie płynie   |
+------------------------------------------------------------------------------+
| <- Scenariusz 2: Do Internetu                       P2 Różne maski ->        |
+------------------------------------------------------------------------------+
```

| Krok | Tekst                                                                                                               | Słowa |
| ---- | ------------------------------------------------------------------------------------------------------------------- | ----- |
| K1   | Maska /26: sieć Laptopa to .64–.127. Serwer NAS .30 jest w innej sieci, więc Laptop chce oddać ramkę bramie.        | 19    |
| K2   | Brama 10.10.10.1 też jest poza siecią .64–.127. Laptop nie ma komu oddać ramki. Nic nie wychodzi z karty sieciowej. | 19    |
| K3   | Naprawa: na Laptopie wpisz bramę z jego sieci. Router (Brama) ma w niej adres 10.10.10.65.                          | 15    |

Zdanie o zachowaniu Windows (ostrzeżenie) i Linuksa (odrzucona trasa) przenieść do notatki dla nauczyciela.

### 5.15 P2 – Różne maski

```text
+------------------------------------------------------------------------------+
| PUŁAPKI · P2 z 2   [x][x]                      Przykładowe biuro (i)         |
| PYTANIE: Laptop /24, Serwer NAS /26. Którędy zapytanie, a którędy odpowiedź? |
+---------------------------------------------+--------------------------------+
| Kierunek:  ( [Tam] | Z powrotem )           | Tam:                           |
|                                             | Laptop liczy swoją maską /24:  |
|            [Router (Brama)]                 | Serwer NAS .30 jest w jego     |
|             (Tam: nieużywany)               | sieci. Laptop wysyła ramkę     |
| [Laptop /24]==>[ Switch ]                   | bezpośrednio, przez sam        |
|                    ||                       | Switch.                        |
|                    vv                       |                                |
|              [Serwer NAS /26]               |                                |
|                                             |                                |
| Kolor „mojej sieci” zawsze należy do        |                                |
| NADAWCY – podpis: „Liczy: Laptop”.          |                                |
+---------------------------------------------+--------------------------------+
| ZMIANA: kto liczy (nadawca) i jego droga ramki                               |
+------------------------------------------------------------------------------+
| <- P1 Brama za płotem                  Scenariusz 3: Tablica routingu ->     |
+------------------------------------------------------------------------------+
```

| Krok            | Tekst                                                                                                                                                                                                    | Słowa |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| K1 (Tam)        | Laptop liczy swoją maską /24: Serwer NAS .30 jest w jego sieci. Laptop wysyła ramkę bezpośrednio, przez sam Switch.                                                                                      | 19    |
| K2 (Z powrotem) | Serwer NAS liczy swoją maską /26: jego sieć to .0–.63, a Laptop .105 jest poza nią. Serwer NAS odpowiada przez Router (Brama). Bez bramy odpowiedź nie wróci: ping nie odpowiada, choć kabel jest dobry. | 34    |

---

## 6. Priorytety

Koszt: **mały** – tylko dane (`scenario.ts`, `network.ts`, `arp.html`, `maska.html`) albo CSS; **średni** – nowy widok z istniejących komponentów `src/sim/` (i `AddressLine`, `BitRuler`); **duży** – nowy silnik. Żadna zmiana nie wymaga nowego silnika.

| Kol. | Zmiana                                                                                                                                                                                                    | Wpływ na obciążenie | Koszt                               | Uwagi                                                                                                                                                                           |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Kompaktowy nagłówek obu stron: H1 w 1 linii, bez podtytułu, karta „Inny świat” → dymek „Przykładowe biuro (i)”                                                                                            | średni              | mały (HTML + CSS)                   | Odzyskuje ~250 px; symulator zaczyna się nad połową ekranu                                                                                                                      |
| 2    | ARP: panel kroku (tytuł, opis, przyciski) obok diagramu, panel boczny pod diagramem; wysokość diagramu 440 → 340 px                                                                                       | **duży**            | mały (CSS: układ siatki)            | Usuwa główną podzieloną uwagę. Razem z 1 i 3: diagram, opis i przyciski mieszczą się na jednym ekranie 1366×768 (tablice nadal pod diagramem – to rozwiązuje dopiero seria A/B) |
| 3    | ARP: opisy ≤ 40 słów, jedno działanie na krok (Krok 4 → dwa kroki), usunięte zdanie o tablicy ARP Serwera NAS, Krok 1 → jedno zdanie-fakt                                                                 | **duży**            | mały (`scenario.ts`)                | **Zaktualizować odsyłacz w `lab1-podstawy.html`** („Krok 1… Krok 5…”)                                                                                                           |
| 4    | ARP: usunąć pasek warstwy („L2 (Łącze danych) – Broadcast”) i legendę nad diagramem; usunąć puste panele w kroku Start                                                                                    | mały                | mały                                | Mniej redundancji                                                                                                                                                               |
| 5    | Maska: podtytuł zgodny z panelem („Kliknij przykłady 1–4 po kolei”)                                                                                                                                       | średni              | mały (`maska.html`)                 | Usuwa sprzeczną instrukcję                                                                                                                                                      |
| 6    | Maska: lekcja nad diagramem, decyzja skrócona do 2 wierszy; „Laptop rozmawia z”, „Kierunek”, „Pułapka” i suwak zwinięte w „Tryb swobodny”; Ulica i Bity zwinięte („Pokaż na ulicy adresów”, „Pokaż bity”) | **duży**            | mały–średni                         | Z 11 do 4 elementów sterujących na ekranie (przykłady 1–4)                                                                                                                      |
| 7    | Maska: pomarańczowy tylko dla Broadcastu (werdykt objazdu i „działka celu” w innym kolorze)                                                                                                               | mały                | mały (CSS)                          | Spójny kod koloru w obu ćwiczeniach                                                                                                                                             |
| 8    | Maska: usunąć „+ adres w każdej podsieci” z karty Routera; „Brama: …” na kartach tylko w przykładzie 3                                                                                                    | średni              | mały (`network.ts`)                 | Usuwa niewyjaśnione różnice bram                                                                                                                                                |
| 9    | Animacja ramki: 2 cykle i stop na ostatniej klatce (dziś pętla bez końca obok czytanego tekstu)                                                                                                           | mały                | mały (jedna wartość w `PacketEdge`) | Ruch nie konkuruje z czytaniem                                                                                                                                                  |
| 10   | Seria A1–A4 + B1–B2: dwa przebiegi tego samego scenariusza ARP („soczewka Laptop” / „soczewka Switch”), pasek zmiany zamiast panelu ramki, tablica przy urządzeniu, MAC Serwera NAS „???” do ARP Reply    | **duży**            | średni                              | Te same `Diagram` i `DeviceNode`; nowy układ ekranu (szablon 5.0)                                                                                                               |
| 11   | Seria M1–M4 jako widok kroków (lekcje zamiast trybu swobodnego)                                                                                                                                           | **duży**            | średni                              | M1: prosta tabela porównania; M2: `AddressLine`; M3–M4: `Diagram` (Broadcast już obsługuje `PacketEdge`)                                                                        |
| 12   | Seria L1–L3 (liczenie)                                                                                                                                                                                    | średni              | średni                              | `AddressLine` i `BitRuler` z mniejszą liczbą wierszy                                                                                                                            |
| 13   | Seria P1–P2 (pułapki)                                                                                                                                                                                     | średni              | średni                              | Logika `decide()` już istnieje                                                                                                                                                  |
| 14   | „Tryb swobodny” (obecne pełne widoki) jako ostatni ekran serii                                                                                                                                            | mały                | mały                                | Zależnie od decyzji 2                                                                                                                                                           |

**Szybkie wygrane (1–9)** nie zmieniają struktury ćwiczeń, a likwidują przewijanie w ARP i połowę bałaganu w Masce. Seria mikro-ćwiczeń (10–13) to właściwe rozwiązanie problemu „kilku tematów naraz”.

---

## 7. Kryteria akceptacji

| #   | Kryterium                                          | Jak zmierzyć                                                                                                                | Próg                         |
| --- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 1   | Ekran ćwiczenia mieści się bez przewijania         | `document.documentElement.scrollHeight <= innerHeight` w 1366×768 i 1280×720 (skrypt puppeteer jak `audit.mjs`), każdy krok | 100% kroków                  |
| 2   | Element sterujący widoczny od razu                 | dolna krawędź przycisku/suwaka `< innerHeight` bez przewijania                                                              | każdy krok                   |
| 3   | Tekst kroku obok animacji                          | odległość między prostokątem tekstu kroku a prostokątem diagramu                                                            | ≤ 24 px (sąsiadują)          |
| 4   | Długość tekstu kroku                               | test na danych (np. w `network.test.ts`) liczący słowa w każdym tekście kroku                                               | ≤ 40 słów                    |
| 5   | Jedno działanie na krok                            | przegląd: jedno zdanie z orzeczeniem opisującym ruch ramki albo zapis w tablicy                                             | 1                            |
| 6   | Słowa widoczne naraz                               | licznik słów w `#root` w widoku (jak w `audit.mjs`)                                                                         | ≤ 100                        |
| 7   | Jedno nowe pojęcie na ćwiczenie                    | pole `concept` w danych ćwiczenia; test: brak powtórzeń, ≤ 1 nowe na ćwiczenie                                              | ≤ 1                          |
| 8   | Jeden element sterujący                            | liczba `button, input` w obszarze ćwiczenia poza stałym paskiem ← →                                                         | ≤ 1 (grupa przełącznika = 1) |
| 9   | Jedna rzecz animowana naraz                        | w każdym kroku wszystkie aktywne kable należą do jednego zdarzenia (jedna ramka albo jedna grupa kopii Broadcastu)          | 1 zdarzenie                  |
| 10  | Animacja nie zapętla się bez końca                 | liczba cykli `PacketEdge`                                                                                                   | ≤ 2, potem ostatnia klatka   |
| 11  | Każde ćwiczenie kończy się pytaniem dla następnego | pole `nextQuestion` w danych; test: niepuste w każdym ćwiczeniu                                                             | 100%                         |
| 12  | Nazwy urządzeń z glosariusza                       | test: w tekstach tylko „Laptop”, „Switch”, „Router (Brama)”/„Router”, „Serwer NAS”, „Drukarka”, „Kamera”                    | 0 innych nazw                |
| 13  | Jeden kolor = jedno znaczenie                      | przegląd CSS: pomarańczowy (#e67e22) tylko dla Broadcastu w obu ćwiczeniach                                                 | 0 wyjątków                   |
| 14  | Brak tekstu o niewidocznych elementach             | przegląd: każda tablica i każde urządzenie wymienione w tekście kroku jest widoczne na ekranie                              | 0 wyjątków                   |
| 15  | Telefon (drugorzędny)                              | 390×844: brak przewijania w poziomie; kolejność: pytanie → diagram → tekst → przycisk                                       | spełnione                    |
| 16  | Zrozumienie (test w klasie)                        | pytanie końcowe każdej serii (A: drugi plik bez ARP; M: droga do Drukarki przy /25)                                         | ≥ 80% poprawnych odpowiedzi  |

---

## 8. Trzy decyzje dla nauczyciela

| #   | Decyzja                                                                                                      | Opcje                                                                                                                                               | Rekomendacja                                                                                                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Gdzie w kolejności z `plan.md` stoi seria Maska i czy gałęzie L (liczenie) i P (pułapki) są obowiązkowe?** | (a) M1–M4 przed Scenariuszem 2, L i P jako gałęzie; (b) M po Scenariuszu 2; (c) wszystko obowiązkowe, liniowo                                       | **(a)**: M4 kończy się pytaniem, od którego zaczyna Scenariusz 2. L1–L3 przy Kroku 5 teorii (egzamin INF.02 wymaga liczenia adresu sieci i Broadcastu). P1–P2 po Lab 1 Fazie 3, gdy uczeń zna bramę z praktyki                                                                                  |
| 2   | **Co z obecnymi pełnymi widokami?**                                                                          | (a) zostawić jako „Tryb swobodny” na końcu serii (rzutnik, dyskusja, sprawdzanie hipotez); (b) usunąć                                               | **(a)**: pełny widok jest dobry dla nauczyciela przy rzutniku i dla ucznia, który przeszedł serię. Szkodzi tylko jako pierwszy ekran                                                                                                                                                            |
| 3   | **Jedna metafora maski w całym Filarze 1**                                                                   | (a) „płot i działka na ulicy adresów” (symulator); (b) „kod pocztowy dzielnicy” (`index.html`, Krok 5); (c) „wioska” (`lab1-podstawy.html`, Faza 1) | **(a)** i wpis do glosariusza: płot = granica podsieci, działka = podsieć. Przy okazji przeredagować wniosek Lab 1 Fazy 1 („maska decyduje, kto z kim może rozmawiać”) na „maska decyduje, czy nadawca wysyła bezpośrednio, czy przez bramę” – obecne brzmienie sugeruje ścianę, którą M4 obala |
