# Kłopot 1: Działy na piętrach — sceny „Budynek, rok 1996” i „Budynek, dziś”

Wersja 2, wdrożona w vlan.html (Kłopot 1).

Zmiany w wersji 2: przyczyna i problem rozdzielone na dwa kroki. Narracja (bez postaci) mówi, że na trzecim zabrakło miejsca, a Szefowa zgłasza to, z czym naprawdę przychodzi się do administratorki: brak sieci. Narracja i kwestia Szefowej są w obu scenach słowo w słowo takie same; różni się dopiero odpowiedź Oli. Pod czekającymi komputerami w obu scenach jest „brak sieci”. Wariant A+: każdy dział siedzi razem, po dwa działy na piętrze, a Sprzedaż przelewa się na drugie piętro.

Postacie: Ola (administratorka sieci) i Szefowa Sprzedaży, na „ty”.

Styl jak w Kłopocie 3: jedna myśl na oddech, części zdania łączy myślnik „–”, emoji tam, gdzie postać coś czuje. Scena „dziś” jest lustrem sceny z 1996.

## Budynek

| Piętro | Działy                                                                             | VLAN (dziś)    |
| ------ | ---------------------------------------------------------------------------------- | -------------- |
| 3      | Sprzedaż · Marketing                                                               | 50 · 60        |
| 2      | Księgowość · Kadry (+ trzy osoby ze Sprzedaży: w 1996 od kroku 6, dziś od kroku 4) | 20 · 30 (+ 50) |
| 1      | IT i szafa główna                                                                  | 10             |

## Scena 1: „Budynek, rok 1996” (bez VLAN-ów)

| #   | Kto               | Kwestia                                                                                      | Na schemacie                                                                                            | Licznik kabli w pionie | Przycisk              |
| --- | ----------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------- |
| 1   | Ola               | Rok 1996. Trzy piętra, pięć działów – każdy to osobna sieć.                                  | Przekrój budynku, komputery działów na piętrach, szafa główna na parterze. Nic nie jest podłączone.     | 0                      | Dalej ▶               |
| 2   | Ola               | Trzecie piętro: Sprzedaż i Marketing – dwie sieci, dwa switche.                              | Na 3. piętrze pojawiają się dwa switche, komputery dostają krótkie kable.                               | 0                      | 🔌 Podepnij ▶         |
| 3   | _akcja_           | _Ola ciągnie dwa kable w pionie do szafy głównej…_                                           | Dwa kable schodzą pionem z 3. piętra na parter.                                                         | 2                      | Dalej ▶               |
| 4   | Ola               | Drugie piętro: Księgowość i Kadry. Też osobno – tam są wypłaty 🔒                            | Dwa switche na 2. piętrze.                                                                              | 2                      | 🔌 Podepnij ▶         |
| 5   | _akcja_           | _Ola ciągnie kolejne dwa kable w pionie…_                                                    | Dwa kable z 2. piętra na parter.                                                                        | 4                      | Dalej ▶               |
| 6   | _narracja_        | _Na trzecim zabrakło miejsca – trzy nowe osoby ze Sprzedaży siadają na drugim._              | Pojawiają się trzy migające komputery Sprzedaży na 2. piętrze, podpis „brak sieci”.                     | 4                      | Dalej ▶               |
| 7   | Szefowa Sprzedaży | Olu, moi nowi siedzą na drugim – i nie mają sieci 😬                                         | Bez zmian.                                                                                              | 4                      | Dalej ▶               |
| 8   | Ola               | Bo na drugim jest sieć Księgowości i Kadr – Sprzedaży tam nie ma.                            | Ramki wokół switchy Księgowości i Kadr. Żaden port na 2. piętrze nie ma koloru Sprzedaży.               | 4                      | Dalej ▶               |
| 9   | Szefowa Sprzedaży | To podepnij ich na chwilę do księgowości 🙏                                                  | Przerywany kabel na próbę do switcha Księgowości.                                                       | 4                      | Dalej ▶               |
| 10  | Ola               | I zobaczą faktury? Nie ma mowy 🙅‍♀️                                                            | Kabel dostaje czerwone ✕ i znika.                                                                       | 4                      | Dalej ▶               |
| 11  | Ola               | Trzeci switch na drugim – i piąty kabel w pionie 😩                                          | Przerywany zarys trzeciego switcha na 2. piętrze.                                                       | 4                      | 🔌 Podepnij ▶         |
| 12  | _akcja_           | _Ola ciągnie piąty kabel – z drugiego piętra do Sprzedaży na trzecim…_                       | Nowy switch na 2. piętrze, kabel pionem w górę do switcha Sprzedaży. Komputery dostają kolor Sprzedaży. | 5                      | Dalej ▶               |
| 13  | Szefowa Sprzedaży | Cały kabel przez piętro – dla trzech osób? 🤨                                                | Podświetlony nowy kabel 2→3.                                                                            | 5                      | Dalej ▶               |
| 14  | Ola               | No tak 🤷‍♀️ Tu sieć wyznacza kabel – nie biurko.                                               | Pulsuje wszystkie pięć kabli w pionie.                                                                  | 5                      | Dalej ▶               |
| 15  | _zagadka_         | Co by tu pomogło? A) Szerszy pion na więcej kabli. B) Jeden kabel, który niesie wiele sieci. | Stan końcowy.                                                                                           | 5                      | Zobacz to samo dziś ▶ |

Reakcje na zagadkę:

- A: „Nie do końca – kabli dalej przybywa z każdym działem.”
- B: „Właśnie tak. Taki kabel to trunk – zobacz, jak to wygląda dziś.”

## Scena 2: „Budynek, dziś” (z VLAN-ami)

| #   | Kto               | Kwestia                                                                                                                   | Echo z 1996   | Na schemacie                                                                                                            | Licznik | Przycisk            |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- | ------- | ------------------- |
| 1   | Ola               | Dziś. Te same piętra i działy – dwa kable w pionie 🤩                                                                     | 1             | Jeden switch na piętrze, porty w kolorach VLAN-ów, dwa trunki (paski) z 3. i 2. piętra do switcha głównego na parterze. | 2       | Dalej ▶             |
| 2   | Ola               | Jeden switch na piętro – kolor portu to VLAN działu.                                                                      | 2, 4          | Ramki wokół portów działów.                                                                                             | 2       | Dalej ▶             |
| 3   | Ola               | W pionie trunk – jeden kabel, wszystkie VLAN-y piętra.                                                                    | 3, 5          | Etykiety przy trunkach: „VLAN 50 + 60” i „VLAN 20 + 30”; każdy trunk ma paski w kolorach swoich VLAN-ów.                | 2       | Dalej ▶             |
| 4   | _narracja_        | _Na trzecim zabrakło miejsca – trzy nowe osoby ze Sprzedaży siadają na drugim._                                           | 6 (dosłownie) | Pojawiają się trzy migające komputery na 2. piętrze, podpis „brak sieci”.                                               | 2       | Dalej ▶             |
| 5   | Szefowa Sprzedaży | Olu, moi nowi siedzą na drugim – i nie mają sieci 😬                                                                      | 7 (dosłownie) | Bez zmian.                                                                                                              | 2       | Dalej ▶             |
| 6   | Ola               | Spokojnie – na drugim są wolne porty 🙂                                                                                   | 8             | Pulsują wolne porty switcha 2. piętra.                                                                                  | 2       | 🔌 Podepnij ▶       |
| 7   | _akcja_           | _Ola podpina trzy gniazdka i ustawia im VLAN 50…_                                                                         | 12            | Trzy porty zapalają się kolorem Sprzedaży, etykieta trunku z 2. piętra zmienia się na „VLAN 20 + 30 + 50”.              | 2       | Dalej ▶             |
| 8   | Szefowa Sprzedaży | I widzą resztę Sprzedaży na trzecim? 🤨                                                                                   | —             | Bez zmian.                                                                                                              | 2       | Dalej ▶             |
| 9   | Ola               | Tak – trunkiem w dół i trunkiem w górę. Jedna sieć.                                                                       | —             | Podświetlona droga: nowy port → trunk → switch główny → trunk → porty Sprzedaży na 3. piętrze.                          | 2       | Dalej ▶             |
| 10  | Szefowa Sprzedaży | A księgowość obok? Widzi moich ludzi?                                                                                     | 9             | Ramki wokół portów Księgowości i nowych portów Sprzedaży.                                                               | 2       | Dalej ▶             |
| 11  | Ola               | Nie – inny VLAN. Ten sam switch, osobne sieci 🔒                                                                          | 10            | Napis „VLAN 20 ✕ VLAN 50 – nie widzą się” obok nazwy piętra.                                                            | 2       | Dalej ▶             |
| 12  | Szefowa Sprzedaży | Ile kabli w pionie dociągnęłaś? 🙂                                                                                        | 13            | Podświetlony licznik.                                                                                                   | 2       | Dalej ▶             |
| 13  | Ola               | Ani jednego 😎 Tylko trzy porty w konfiguracji.                                                                           | 14            | Szare porównanie: „1996: 5 kabli w pionie · 5 switchy na piętrach”.                                                     | 2       | Dalej ▶             |
| 14  | _zagadka_         | Jak trzy osoby z drugiego piętra trafiły do sieci Sprzedaży? A) Nowym kablem na trzecie. B) VLAN-em na porcie i trunkiem. | 15            | Stan końcowy.                                                                                                           | 2       | ↺ Wróć do roku 1996 |

Reakcje na zagadkę:

- A: „Nie tym razem – nowego kabla nie było. Zrobiły to VLAN i trunk.”
- B: „Właśnie tak. O sieci decyduje ustawienie portu – nie kabel.”

## Bilans

|                              | 1996                                       | Dziś                      |
| ---------------------------- | ------------------------------------------ | ------------------------- |
| Kable w pionie               | 5 (4 na parter + 1 między 2. a 3. piętrem) | 2 trunki                  |
| Switche na piętrach          | 5 (2 na 3. piętrze, 3 na 2. piętrze)       | 2 (po jednym na piętro)   |
| Trzy nowe osoby ze Sprzedaży | nowy switch i nowy kabel                   | trzy porty w konfiguracji |

## Uwagi techniczne (do walidacji)

- Odległości: trzy piętra mieszczą się w limicie około 100 m dla skrętki. Oba warianty są wykonalne.
- 1996, kabel 2→3: switch dla trzech osób na 2. piętrze łączy się ze switchem Sprzedaży na 3. piętrze. To nadal jedna sieć (jedna domena rozgłoszeniowa, jedna podsieć IP). Gdyby kabel poszedł na parter do osobnego portu routera, byłaby to druga sieć Sprzedaży z innymi adresami – dlatego kabel idzie w górę.
- 1996, kabel na próbę do księgowości (kroki 8–9): komputery trafiłyby do domeny rozgłoszeniowej księgowości i musiałyby dostać adresy z jej podsieci. Problem jest więc nie tylko bezpieczeństwa, ale też adresacji.
- 1996, szafa główna: każdy kabel z pionu trafia tam do osobnego portu routera albo do osobnego switcha działu. Na schemacie pokazujemy samą „szafę główną”, bez wchodzenia w routing.
- Dziś: trunki 802.1Q z tagami. VLAN 50 musi być dozwolony na trunku z 2. piętra, na switchu głównym i na trunku z 3. piętra – wtedy osoby z 2. piętra są w tej samej sieci co reszta Sprzedaży, bez routera (krok 8).
- Dziś: Księgowość (VLAN 20) i nowe osoby Sprzedaży (VLAN 50) na tym samym switchu nie widzą się bez routera (krok 10). Routing zostawiamy na później.
- Uproszczenie: w 1996 na piętrach mogły jeszcze stać huby zamiast switchy. Dla spójności z Kłopotem 3 zostajemy przy switchach.

## Uwagi z wdrożenia

- Licznik „kable w pionie” jest na dole pionu kablowego (panel wyników jest ukryty). W 1996 zmienia się po narysowaniu kabli, dziś przez całą scenę stoi na 2.
- W 1996 w szafie głównej każdy kabel z pionu wpina się do osobnego portu (kolory sieci), bez pokazywania routera.
- Kolory: Sprzedaż – malinowy, Marketing – morski; IT, Księgowość i Kadry jak w Kłopocie 3.
- Etykiety switchy (jednolita konwencja w obu labach: „switch” + czyj albo jaki, bez dwukropka i skrótów): 1996 – „switch Sprzedaży”, „switch Marketingu”, „switch Księgowości”, „switch Kadr”, „switch Sprzedaży #2”, „szafa główna”; dziś – „switch piętra”, „switch główny”. Etykieta stoi nad switchem.
