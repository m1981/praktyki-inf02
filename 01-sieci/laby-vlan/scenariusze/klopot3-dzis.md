# Kłopot 3: Pół-puste switche — scena „Biuro, dziś”

Wersja 2. Lustro sceny „Biuro, rok 1996” (scenariusze/klopot3-rok-1996.md): ten sam tydzień, te same zatrudnienia, te same pytania Kierownika, ale z VLAN-ami.

Postacie: Ola (administratorka sieci) i Kierownik IT, na „ty”.

Zmiany w wersji 2:
- 1: „Dziś. Cztery działy, 2 switch'e zamiast 5 🤩”

Styl jak w scenie 1996: jedna myśl na oddech, części zdania łączy myślnik „–”, emoji tam, gdzie postać coś czuje. Kwestie celowo powtarzają rytm kwestii z 1996, żeby student słyszał echo.

Stan wyjściowy: IT 10, Księgowość 5, Kadry 4, Goście 6 = 25 urządzeń. To więcej niż 24, więc od początku są dwa wspólne switche (48 portów). Dochodzą te same dwie grupy po siedem osób i dwudziesta piąta osoba w IT.

| # | Kto | Kwestia | Echo z 1996 | Na schemacie | Przycisk |
|---|---|---|---|---|---|
| 1 | Ola | Dziś. Cztery działy, 2 switch'e zamiast 5 🤩 | 1: „Rok 1996. Cztery działy, cztery switche…” | Ujęcie wprowadzające: dwa switche wspólne, porty w kolorach VLAN-ów, zajęte 25 z 48. | Dalej ▶ |
| 2 | Ola | Kolor portu to VLAN – każdy dział ma swój. | — | Złote ramki wokół portów wszystkich czterech działów. | Dalej ▶ |
| 3 | Ola | Zatrudniamy w IT. Siedem gniazdek – każde w VLAN 10. | 2: „Zatrudniamy w IT. Mam podpiąć siedem gniazdek.” | Bez zmian, 25 z 48. | 🔌 Podepnij ▶ |
| 4 | *akcja* | *Ola podpina siedem gniazdek i ustawia im VLAN 10…* | 3 | Wolne porty zapalają się po kolei na niebiesko, 32 z 48. | Dalej ▶ |
| 5 | Ola | Kolejne siedem nowych osób – tym razem bez nerwów 😌 | 4: „…to będzie na styk 😬” | Bez zmian, 32 z 48. | 🔌 Podepnij ▶ |
| 6 | *akcja* | *Ola podpina kolejne siedem gniazdek…* | 5 | Porty zapalają się po kolei, 39 z 48. | Dalej ▶ |
| 7 | Ola | I jeszcze jedna osoba – a portów wciąż mamy dziewięć 🙂 | 6: „…a portów już nie ma 😩” | Czekający komputer, pulsuje dziewięć wolnych portów. | Dalej ▶ |
| 8 | Kierownik IT | Olu, tylko mi nie mów, że nowy switch 😅 | 7: „Olu, jak to, nowy switch 🤨…” | Bez zmian. | Dalej ▶ |
| 9 | Ola | Nie trzeba 😎 Wolny port – i VLAN 10. | 8: „No tak 🤷‍♀️ Taką mamy sieć…” | Komputer wpina się z pierścieniem w wolny port na switchu #2, 40 z 48. | Dalej ▶ |
| 10 | Kierownik IT | Chwila – to ten sam switch, co kadry? 🤨 | 11: „To podepnij tam moich ludzi.” | Ramka wokół nowego portu IT i portów kadr na switchu #2. | Dalej ▶ |
| 11 | Kierownik IT | Czyli moi ludzie zobaczą wypłaty?! | 12: „…dane osobowe i wypłaty!” | Plakietka „📁 dane osobowe i wypłaty” przy portach kadr. | Dalej ▶ |
| 12 | Ola | Nie – oni są w VLAN 10, kadry w VLAN 30. Nie widzą się. | 13: „Aha, no to słabo 😕” | Na plakietce pojawia się 🔒, między portami napis „VLAN 10 ✕ VLAN 30”. | Dalej ▶ |
| 13 | Kierownik IT | Czyli nie płacimy za puste porty? 🙂 | 14: „Czyli płacimy za puste porty? 😳” | Podświetla się licznik „wykorzystanie 83%”. | Dalej ▶ |
| 14 | Ola | Ani za trzy switche – ani za ich prąd 😉 | 15: „I jeszcze za prąd 🙃” | Liczniki: 2 switche, 40 z 48, 83%. Obok szare „1996: 5 switchy, 33%”. | Dalej ▶ |
| 15 | *zagadka* | IT i kadry siedzą na jednym switchu. Co je rozdziela? A) Osobne pudło. B) Numer VLAN-u na porcie. | 16: zagadka A/B | Stan końcowy. | ↺ Wróć do roku 1996 |

Reakcje na zagadkę:
- A: „Nie tym razem – pudło jest wspólne. Rozdziela je VLAN.”
- B: „Właśnie tak. O sieci decyduje port, a nie pudło.” (echo odpowiedzi B z 1996)

Liczby: start 25 z 48 (52%), po pierwszej grupie 32 z 48, po drugiej 39 z 48, po dwudziestej piątej osobie 40 z 48 (83%). Dla porównania rok 1996: 5 switchy, 40 ze 120 (33%).

Uwagi do wykonania:
- Ta scena zastępuje obecny monolog Oli w wersji „z VLAN-ami” (9 kroków).
- Dziś rysujemy porty działów pogrupowane, więc nowe porty IT przesuwałyby porty innych działów. Na potrzeby sceny porty mają zostać na miejscach, a nowe zapalają się na wolnych. Tak jest też w prawdziwej szafie.
- W układzie z kroku 9 nowa osoba z IT trafia na switch #2, na którym są też kadry. Tego potrzebujemy do kwestii 10–12.
- Układ portów: switch #1 – IT 1–10, Księgowość 11–15, wolne 16–24; switch #2 – Kadry 1–4, Goście 5–10, wolne 11–24. Nowe osoby z IT zajmują kolejno wolne porty: najpierw switch #1, potem switch #2. Dwudziesta piąta osoba dostaje port 16 na switchu #2.
