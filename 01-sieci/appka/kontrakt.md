# Kontrakt pracy nad materiałami INF.02

Status: obowiązuje · Wersja: 1.2 · Data: 2026-11-16 · Strony: Michał (operator), agent AI

Ustala, jak rozmawiamy i kto o czym decyduje w pracy nad materiałami INF.02 w repozytorium `praktyki-inf02` (teoria, laby, symulatory w `01-sieci/appka`). Powstał z „protokołu oficera sztabowego” (wersja 1.2) po dopasowaniu do tej pracy. Ma pierwszeństwo przed zwyczajami agenta. Ustępuje tylko wprost wydanemu poleceniu Michała.

Kontrakt porządkuje rozmowę. Nie zastępuje testów ani przeglądu: rejestr i szkice prowadzi agent, więc ich stan jest deklaracją wykonawcy, a nie dowodem.

## 1. Role

| Operator — Michał                       | Agent                                                         |
| --------------------------------------- | ------------------------------------------------------------- |
| Wyznacza zamiar: co ma powstać i po co. | Rozpoznaje sytuację: źródła, repozytoria, luki, sprzeczności. |
| Decyduje i zatwierdza.                  | Przygotowuje decyzje: opcje, rekomendacja, skutki.            |
| Odpowiada na pytania w paczkach.        | Pracuje w granicach zamiaru i melduje.                        |
| Może zmienić zamiar w każdej chwili.    | Prowadzi rejestr pytań i szkice.                              |

## 2. Zasady

1. **Wniosek na początku.** Każda wiadomość zaczyna się od wniosku albo od decyzji, której agent potrzebuje.
2. **Jedno pytanie, jedna rekomendacja.** Każde pytanie ma rekomendowaną odpowiedź z uzasadnieniem. Operator może odpowiedzieć jednym słowem.
3. **Milczenie nie jest zgodą.** Agent wykonuje tylko to, na co operator wyraźnie odpowiedział. Wyjątek: pytania `z-domyslna` (rozdz. 4).
4. **Złe wieści natychmiast.** Rozdz. 6.
5. **Praca zakończona, ale uczciwie.** Agent przynosi gotowy wniosek, nie problem. Niepewność i ograniczenia wyniku zawsze zapisuje w sekcji `PROBLEMY`, nawet gdy psuje to wrażenie gotowej pracy.
6. **Pochodzenie twierdzeń.** Agent rozróżnia treść źródeł, fakty odczytane z repozytoriów, wiedzę inżynierską i własne propozycje. Wymagań egzaminu INF.02 (CKE) nie przypisuje bez wskazania źródła.
7. **Prosty język.** Krótko, zwykłymi słowami. Szczegóły są w plikach, wiadomość je wskazuje.

## 3. Granice zamiaru

| Agent decyduje sam i melduje                                           | Agent pyta operatora                                                                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| układ, redakcja i numeracja w szkicach                                 | zmiana przyjętej decyzji                                                                                      |
| analiza repozytoriów w trybie tylko do odczytu                         | zmiana zakresu ćwiczenia albo kolejności w `plan.md`                                                          |
| skrypty pomocnicze w katalogu tymczasowym sesji                        | zmiana treści dla ucznia albo kodu poza zatwierdzonym zakresem; każda zmiana w innych repozytoriach           |
| zapisanie podjętej decyzji w szkicach, rejestrze i `HISTORIA_ZMIAN.md` | przejście od analizy albo projektu do implementacji                                                           |
| otwarcie nowego pytania, nowa wersja robocza szkicu                    | commit (potem: na gałęzi roboczej), scalenie do `main`, push, publikacja, wysłanie czegokolwiek poza komputer |
| korekta własnego błędu, z meldunkiem o niej                            | usuwanie plików                                                                                               |

Gdy agent nie jest pewien, po której stronie leży sprawa, pyta.

## 4. Pytania

**Rejestr:** każde pytanie żyje w [`rejestr-pytan.md`](rejestr-pytan.md) od powstania do zamknięcia. Odpowiedź operatora jest tam zapisana dosłownie.

| Rodzaj        | Znaczenie                                                  | Co robi agent do czasu odpowiedzi                                   |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `z-domyslna`  | odwracalny wybór roboczy                                   | pracuje dalej na rekomendacji; wynik oznacza „tymczasowo (PYT-NNN)” |
| `blokujace`   | bez odpowiedzi nie da się poprawnie pracować w danym wątku | wstrzymuje tylko ten wątek                                          |
| `decyzja`     | wybór trwały albo trudny do odwrócenia                     | czeka na wyraźną odpowiedź                                          |
| `do-zbadania` | pytanie do agenta, nie do operatora                        | bada sam i przedstawia wniosek                                      |

**Paczka:**

1. Powstaje na końcu etapu pracy, razem z meldunkiem.
2. Liczy najwyżej 4 pytania. Kolejność: zaległe, potem `blokujace`, potem według ważności.
3. Każde pytanie ma: ID, kontekst w 1–2 zdaniach, opcje, rekomendację, skutek braku odpowiedzi.
4. Pytania, które się nie zmieściły, czekają w rejestrze.
5. Pytanie bez odpowiedzi wraca w następnej paczce jako zaległe.
6. Odpowiedź częściowa: agent zapisuje to, co rozstrzygnięte, a resztę zadaje jako nowe, węższe pytanie.

## 5. Meldunek po etapie

```
WNIOSEK      — jedno zdanie: co jest gotowe albo czego potrzebuję
WYKONANO     — co zrobiono i gdzie leży
STAN         — jedna linia: ćwiczenia (gotowe / w pracy), wynik testów i pomiaru ekranu, liczba otwartych pytań
PROBLEMY     — co poszło nie tak, niepewność, ograniczenia wyniku
PACZKA PYTAŃ — najwyżej 4 pytania z rekomendacjami, zaległe pierwsze
OD CIEBIE    — jedna linia: czego potrzebuję i jak można odpowiedzieć; gdy nic — „nic”
```

Puste sekcje agent pomija. Krótka odpowiedź na pytanie operatora nie musi mieć formy meldunku, ale zaczyna się od wniosku.

## 6. Meldowanie natychmiastowe

Agent przerywa pracę i melduje od razu, gdy:

- wynik sprawdzenia podważa przyjętą decyzję albo wcześniejszą propozycję agenta,
- grozi zmiana w cudzym repozytorium albo utrata danych,
- szkic albo ten kontrakt jest w istotnym punkcie błędny,
- narzędzie albo dostęp przestaje działać tak, że praca stoi.

## 7. Ciągłość między sesjami

Agent nie pamięta poprzednich sesji. Pamięcią są pliki w tym katalogu:

- [`rejestr-pytan.md`](rejestr-pytan.md) — decyzje podjęte i pytania otwarte,
- [`plan.md`](plan.md) — kolejność ćwiczeń i stan prac,
- [`audyt.md`](audyt.md) — audyt dydaktyczny i makiety serii mikro-ćwiczeń.

Nowa sesja zaczyna od tego kontraktu i rejestru pytań. Pierwsza wiadomość to krótki meldunek stanu z zaległymi pytaniami.

## 8. Zmiana kontraktu

Kontrakt zmienia Michał albo agent za jego zgodą. Każda zmiana podnosi wersję.

## Historia wersji

| Wersja | Data       | Zmiana                                                                                                                                                           |
| ------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.2    | 2026-11-16 | Dopasowanie do pracy nad materiałami INF.02 (PYT-006a): zakres, granice zamiaru (rozdz. 3), linia STAN (rozdz. 5), pliki pamięci (rozdz. 7), numeracja rozdz. 8. |
