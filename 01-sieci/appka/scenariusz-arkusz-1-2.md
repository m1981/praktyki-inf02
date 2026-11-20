# Arkusz krok po kroku, etapy 1–2 — scenariusz do akceptacji

Wersja 1 · 2026-11-20 · PYT-073 (ścieżka przyjęta, start od etapów 1–2).

**Cel etapów 1–2:** uczeń zamienia suchy tekst arkusza w obrazek i tabelę. Po nich umie powiedzieć,
ile sieci jest na schemacie, która karta jest w której, i co wpisać na każdej karcie jako adres,
bramę i DNS.

**Model, który ma zostać w głowie (trzy zdania):**

1. Sieć to wszystko, co łączy kabel i przełącznik. Kończy się na karcie rutera albo serwera.
2. Karty w jednym kolorze rozmawiają wprost. Do innego koloru idzie się przez bramę.
3. Brama jest zawsze w moim kolorze.

## Arkusz, na którym pracujemy

Styczeń 2025 (`egzaminy/inf02-2025-styczen-egzamin-zawodowy-praktyczny.pdf`), układ „serwer
w środku”. Bierzemy tylko linijki o adresach; reszta arkusza (usługi, konta, kosztorys) tu nie
występuje.

| Urządzenie i karta    | Linijka z arkusza                                                    |
| --------------------- | -------------------------------------------------------------------- |
| Ruter, interfejs WAN  | adres IP 90.0.0.3/28, brama domyślna 90.0.0.2                        |
| Ruter, interfejs LAN  | adres IP 10.10.0.1/24                                                |
| Serwer, karta „WAN”   | adres IP oraz pozostałe parametry: uzyskiwane automatycznie          |
| Serwer, karta „LAN 1” | adres IP 192.168.1.1/25, brama domyślna: brak, DNS: 192.168.1.1      |
| Przełącznik           | adres IP 192.168.1.2/25, brama domyślna 192.168.1.1                  |
| Stacja, karta „LAN 2” | adres IP 192.168.1.3/25, brama domyślna 192.168.1.1, DNS 192.168.1.1 |

Schemat (jak w arkuszu, z nazwami z arkusza):

```text
 świat ── [WAN  RUTER  LAN] ── [WAN  SERWER  LAN 1] ── [PRZEŁĄCZNIK] ── [LAN 2  STACJA ROBOCZA]
```

Trzy sieci, trzy kolory: fioletowa (świat – WAN rutera), zielona (LAN rutera – „WAN” serwera),
niebieska („LAN 1” serwera – przełącznik – stacja). Pomarańczowego nie używamy: w naszych
materiałach znaczy tylko Broadcast.

Postacie: Ola (administratorka sieci) i Kuba (praktykant, przygotowuje się do INF.02), na „ty”.
Styl jak w „List za płot”: jedna myśl na oddech, najwyżej 12 słów, ruch w osobnym kroku „akcja”.

## Etap 1: „Koloruję sieci”

### Scena

| #   | Kto       | Kwestia                                                 | Na schemacie                                                                        | Przycisk       |
| --- | --------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------- |
| 1   | Kuba      | Dostałem arkusz. Sam tekst i adresy – nic nie widzę 😩  | Szary schemat z arkusza, bez adresów. Obok wycinek arkusza z linijkami.             | Dalej ▶        |
| 2   | Ola       | Odłóż adresy. Najpierw policzymy sieci.                 | Wycinek arkusza szarzeje.                                                           | Dalej ▶        |
| 3   | Ola       | Sieć to wszystko, co łączy kabel i przełącznik.         | Pulsują: stacja, przełącznik i kable między nimi.                                   | 🖍️ Pokoloruj ▶ |
| 4   | _akcja_   | _Ola koloruje pierwszą sieć na niebiesko…_              | Niebieski rozlewa się od stacji przez przełącznik do karty „LAN 1” serwera i staje. | Dalej ▶        |
| 5   | Ola       | Sieć kończy się na karcie serwera. Dalej jest już inna. | Pulsuje karta „LAN 1”. Reszta serwera szara.                                        | Dalej ▶        |
| 6   | Kuba      | Czyli serwer stoi w dwóch sieciach naraz? 🤔            | Pulsuje druga karta serwera, „WAN”.                                                 | Dalej ▶        |
| 7   | Ola       | Tak – ma dwie karty. Każda karta to inna sieć.          | Bez zmian.                                                                          | 🖍️ Pokoloruj ▶ |
| 8   | _akcja_   | _Ola koloruje drugą sieć na zielono…_                   | Zielony: karta „WAN” serwera, kabel, interfejs LAN rutera.                          | Dalej ▶        |
| 9   | Ola       | Ruter też ma drugą kartę – tę na świat.                 | Interfejs WAN rutera i kabel „w świat” robią się fioletowe.                         | Dalej ▶        |
| 10  | Kuba      | Trzy kolory – trzy sieci. To już coś widzę 🙂           | Cały schemat w trzech kolorach.                                                     | Dalej ▶        |
| 11  | _zagadka_ | W ilu sieciach jest serwer? A) W jednej. B) W dwóch.    | Stan końcowy.                                                                       | Teraz Ty ▶     |

Reakcje na zagadkę:

- A: „Policz jego karty – ma dwie, w dwóch kolorach.”
- B: „Właśnie tak. Dwie karty – dwie sieci.”

### Ćwiczenie (uczeń sam, bez Oli)

Ten sam schemat, bez kolorów. Jedno polecenie naraz; po dobrej odpowiedzi sieć się koloruje.

| #   | Polecenie                                                          | Co robi uczeń            | Dobra odpowiedź                           | Reakcja na błąd                                                   |
| --- | ------------------------------------------------------------------ | ------------------------ | ----------------------------------------- | ----------------------------------------------------------------- |
| 1   | Kliknij wszystko, co jest w jednej sieci ze stacją roboczą.        | klika karty i urządzenia | karta „LAN 2”, przełącznik, karta „LAN 1” | „Ta karta jest za serwerem. Sieć kończy się na jego karcie.”      |
| 2   | Kliknij kartę serwera, która jest w jednej sieci z ruterem.        | klika jedną kartę        | karta „WAN” serwera                       | „To karta od strony przełącznika. Poszukaj tej od strony rutera.” |
| 3   | Ile sieci jest na schemacie?                                       | wybiera 1, 2, 3 albo 4   | 3                                         | „Policz kolory: stacja–serwer, serwer–ruter, ruter–świat.”        |
| 4   | Stacja robi ping do przełącznika. Czy ping wychodzi poza jej sieć? | wybiera tak albo nie     | nie                                       | „Oba są niebieskie – ping zostaje w jednej sieci.”                |

## Etap 2: „Z arkusza do tabeli adresów”

### Scena

| #   | Kto       | Kwestia                                                         | Na schemacie                                                                                 | Przycisk      |
| --- | --------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| 1   | Kuba      | Sieci widzę. Ale gdzie wpisać te wszystkie adresy?              | Kolorowy schemat. Obok wycinek arkusza.                                                      | Dalej ▶       |
| 2   | Ola       | Każda linijka arkusza mówi o jednej karcie.                     | Podświetla się linijka „LAN 2: 192.168.1.3/25…”. Miga karta „LAN 2” stacji.                  | 📌 Przypnij ▶ |
| 3   | _akcja_   | _Adres ląduje przy karcie stacji…_                              | „192.168.1.3” przelatuje z arkusza do karty „LAN 2”.                                         | Dalej ▶       |
| 4   | Ola       | Adres – to kim jestem w swojej sieci.                           | Pulsuje adres przy karcie stacji.                                                            | Dalej ▶       |
| 5   | Ola       | Brama – to karta, przez którą wychodzę ze swojej sieci.         | Strzałka od stacji do karty „LAN 1” serwera; przy niej „192.168.1.1”.                        | Dalej ▶       |
| 6   | Kuba      | Bramą stacji jest serwer? Nie ruter? 🤨                         | Pulsuje ruter.                                                                               | Dalej ▶       |
| 7   | Ola       | Ruter jest zielony. Stacja wprost do niego nie sięgnie.         | Przerywana linia stacja → ruter z czerwonym ✕ na serwerze.                                   | Dalej ▶       |
| 8   | Ola       | Brama musi być w moim kolorze. Zawsze.                          | Linia znika. Pulsują razem: karta „LAN 2” i karta „LAN 1” – obie niebieskie.                 | Dalej ▶       |
| 9   | Kuba      | A serwer? Na karcie „LAN 1” ma „brama: brak”.                   | Podświetla się linijka arkusza „brama domyślna: brak”. Przy karcie „LAN 1” puste pole bramy. | Dalej ▶       |
| 10  | Ola       | Bo w świat wychodzi drugą kartą – tą zieloną.                   | Strzałka od karty „WAN” serwera do interfejsu LAN rutera.                                    | Dalej ▶       |
| 11  | Ola       | Komputer ma jedno wyjście w świat. Nie dwa.                     | Pulsuje jedna strzałka serwera; przy karcie „LAN 1” zostaje „brama: brak”.                   | Dalej ▶       |
| 12  | Kuba      | A DNS – co to za adres?                                         | Podświetla się „DNS: 192.168.1.1” w arkuszu.                                                 | Dalej ▶       |
| 13  | Ola       | Adres tego, kto zna nazwy. Tutaj – serwer.                      | Przy stacji pojawia się „DNS → serwer”; pulsuje karta „LAN 1”.                               | Dalej ▶       |
| 14  | _zagadka_ | Co stacja wpisze jako bramę? A) Adres rutera. B) Adres serwera. | Stan końcowy: wszystkie adresy na schemacie.                                                 | Teraz Ty ▶    |

Reakcje na zagadkę:

- A: „Ruter jest w innym kolorze. Brama musi być w kolorze stacji.”
- B: „Właśnie tak – karta „LAN 1” serwera, ta niebieska.”

### Ćwiczenie (uczeń sam)

Po lewej wycinek arkusza, po prawej schemat w kolorach i pusta tabela. Uczeń klika linijkę arkusza,
a potem pole tabeli, do którego ona należy. Dobre wpisy zostają, złe wracają z podpowiedzią.

| Karta                | Sieć (kolor) | Adres IP       | Brama         | DNS           |
| -------------------- | ------------ | -------------- | ------------- | ------------- |
| Ruter, interfejs LAN | zielona      | 10.10.0.1/24   | –             | –             |
| Serwer, „WAN”        | zielona      | automatycznie  | automatycznie | automatycznie |
| Serwer, „LAN 1”      | niebieska    | 192.168.1.1/25 | brak          | 192.168.1.1   |
| Przełącznik          | niebieska    | 192.168.1.2/25 | 192.168.1.1   | –             |
| Stacja, „LAN 2”      | niebieska    | 192.168.1.3/25 | 192.168.1.1   | 192.168.1.1   |

Po wypełnieniu tabeli trzy pytania kontrolne:

| #   | Pytanie                                         | Dobra odpowiedź            | Reakcja na błąd                                                           |
| --- | ----------------------------------------------- | -------------------------- | ------------------------------------------------------------------------- |
| 1   | Kliknij kartę, która jest bramą przełącznika.   | karta „LAN 1” serwera      | „Brama przełącznika to 192.168.1.1. Znajdź kartę z tym adresem.”          |
| 2   | Serwer ma dwie karty. Na której wpiszesz bramę? | na karcie „WAN” (zielonej) | „Na „LAN 1” arkusz mówi: brak. Wyjście w świat jest po stronie rutera.”   |
| 3   | Stacja dostała bramę 10.10.0.1. Zadziała?       | nie                        | „10.10.0.1 jest zielone, stacja niebieska. Brama musi być w jej kolorze.” |

## Uproszczenia (notatka dla nauczyciela, nie na ekran)

- „Uzyskiwane automatycznie” na karcie „WAN” serwera tu tylko odnotowujemy; skąd przychodzi adres
  (DHCP rutera, zakres i rezerwacja), wyjaśnia etap 3.
- Maska /25 jest w tabeli, ale jej nie liczymy: wszystkie niebieskie adresy (.1, .2, .3) leżą w tej
  samej połowie. Liczenie masek to osobna „siłownia”.
- „Komputer ma jedno wyjście w świat” to uproszczenie pojęcia bramy domyślnej. Wystarcza do
  wszystkich arkuszy 2021–2026.
- To, czy stacja dostanie się do Internetu przez serwer, zależy od usługi routingu na serwerze.
  W tym arkuszu nie jest to oceniane, więc scena tego nie rusza.
- W arkuszu jest jeszcze maszyna wirtualna z kartą „LAN 3” (192.168.1.4/25). Pomijamy ją
  w etapach 1–2.

## Do decyzji przy akceptacji

- **Postać ucznia.** Proponuję Kubę (praktykant) zamiast Kierownika IT: pyta o to, o co pytają
  chłopaki.
- **Nazwy urządzeń.** Proponuję w tej ścieżce nazwy z arkusza („Ruter”, „Przełącznik”, „Stacja
  robocza”, „Serwer”), bo celem jest czytanie arkusza. W pozostałych aplikacjach zostają „Router”
  i „Switch”.
- **Arkusz.** Styczeń 2025 jako arkusz przewodni etapów 1–5 (układ „serwer w środku”, DHCP
  z rezerwacją, bez VLAN-ów).
- **Nowe elementy w kodzie.** Ćwiczenia wymagają dwóch rzeczy, których silnik jeszcze nie ma:
  klikania kart na schemacie i tabeli do wypełnienia z linijek arkusza.
- **Strona.** Nowa strona „Arkusz krok po kroku” z zakładkami etapów, podpięta z teorii po kroku
  „Routing”.
