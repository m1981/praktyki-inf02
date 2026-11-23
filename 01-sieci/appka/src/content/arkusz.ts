// „Arkusz krok po kroku”, etapy 1–2: sceny w stylu „rozmowa” i ćwiczenia „uczeń sam”.
// Źródło kwestii: scenariusz-arkusz-1-2.md, wersja 1 (zatwierdzona, PYT-074a). Zmiana kwestii =
// najpierw zmiana w scenariuszu. Test `arkusz.test.ts` porównuje kwestie ze scenariuszem.
// Nazwy urządzeń jak w arkuszu (PYT-074a); adresy tylko z `model/arkusz.ts`.

import type { ControlSpec, Course, Exercise, Note, Speaker, Step } from '../engine/types';
// Rysunek z arkusza (styczeń 2025, strona 3), wyjęty z PDF bez zmian.
import sheetDrawing from './arkusz-2025-01-schemat.jpg';
import {
 sheetGateway,
 sheetIp,
 SHEET_VM_LAN3,
 type SheetCard,
 type SheetNet
} from '../model/arkusz';
import type { TaskOption } from '../ui/controls/TalkControl';
import type { Figure } from '../ui/ExamFigure';
import type { ExcerptRow, Field, SheetSpec, TableRow } from '../ui/views/SheetView';

const SPEAKERS: Record<string, Speaker> = {
 ola: { name: 'Ola', role: 'administratorka sieci', avatar: 'O', color: '#d9ecf9' },
 kuba: { name: 'Kuba', role: 'praktykant, uczy się do INF.02', avatar: 'K', color: '#f6e3c8' },
 quiz: { name: 'Zagadka', role: 'dla Ciebie', avatar: '?', color: '#e3f2fd' },
 task: { name: 'Teraz Ty', role: 'ćwiczenie bez Oli', avatar: '✍', color: '#e8f8f5' }
};

// --- Wycinek arkusza: linijki o adresach, słowa jak w arkuszu ---

const EXCERPT_TITLE = 'Arkusz, styczeń 2025 – linijki o adresach';
const LABELS: Record<Field, string> = {
 ip: 'adres IP:',
 gw: 'brama domyślna:',
 dns: 'DNS:',
 auto: 'adres IP oraz pozostałe parametry: uzyskiwane automatycznie'
};
const ROWS: readonly ExcerptRow[] = [
 { card: 'ruter-wan', heading: 'Ruter, interfejs WAN' },
 { card: 'ruter-lan', heading: 'Ruter, interfejs LAN' },
 { card: 'serwer-wan', heading: 'Serwer, karta „WAN”' },
 { card: 'serwer-lan1', heading: 'Serwer, karta „LAN 1”' },
 { card: 'przelacznik', heading: 'Przełącznik' },
 { card: 'stacja-lan2', heading: 'Stacja, karta „LAN 2”' }
];

type Excerpt = NonNullable<SheetSpec['excerpt']>;
const excerpt = (extra: Partial<Excerpt> = {}): Excerpt => ({
 title: EXCERPT_TITLE,
 rows: ROWS,
 labels: LABELS,
 ...extra
});

type Scene = Omit<SheetSpec, 'type'>;
const sheet = (state: Scene): SheetSpec => ({ type: 'sheet', ...state });

const ALL: readonly SheetNet[] = ['niebieska', 'zielona', 'fioletowa'];

// --- Kroki ---

const next: ControlSpec = { type: 'talk' };
const act = (label: string): ControlSpec => ({ type: 'talk', next: label });
const PAINT = act('🖍️ Pokoloruj ▶');

const say =
 (speaker: 'ola' | 'kuba') =>
 (text: string, view: Scene, control: ControlSpec = next): Step => ({
  speaker,
  text,
  view: sheet(view),
  control
 });
const ola = say('ola');
const kuba = say('kuba');

/** Krok-akcja: nikt nie mówi, na schemacie coś się dzieje. */
const action = (text: string, view: Scene): Step => ({
 action: true,
 text,
 view: sheet(view),
 control: next
});

const NOW_YOU = 'Teraz Ty ▶';

const quiz = (text: string, view: Scene, options: [string, string, boolean][]): Step => ({
 speaker: 'quiz',
 text,
 view: sheet(view),
 control: {
  type: 'quiz',
  next: NOW_YOU,
  options: options.map(([option, feedback, correct]) => ({ text: option, feedback, correct }))
 }
});

/** Polecenie ćwiczenia: uczeń klika na schemacie albo wybiera odpowiedź. */
const task = (
 text: string,
 view: Scene,
 options?: TaskOption[],
 end?: Partial<Extract<ControlSpec, { type: 'task' }>>
): Step => ({
 speaker: 'task',
 text,
 view: sheet(view),
 control: { type: 'task', options, ...end }
});

const yesNo = (correct: 'Tak' | 'Nie', feedback: string): TaskOption[] =>
 (['Tak', 'Nie'] as const).map((text) =>
  text === correct ? { text, correct: true } : { text, feedback }
 );

const CARDS_AND_SWITCH: readonly SheetCard[] = [
 'ruter-wan',
 'ruter-lan',
 'serwer-wan',
 'serwer-lan1',
 'przelacznik',
 'stacja-lan2'
];
const SERVER_CARDS: readonly SheetCard[] = ['serwer-wan', 'serwer-lan1'];

// --- Etap 1: „Koloruję sieci” ---

const DIM = excerpt({ dim: true });

// „Dla dociekliwych” (PYT-095): treść ze scenariusza, sekcja o tej samej nazwie (test co do słowa).
const NOTES_1: Note[] = [
 {
  q: 'Dlaczego sieć kończy się na karcie rutera albo serwera?',
  a: 'Przełącznik przekazuje ramki dalej. Ramka do wszystkich (Broadcast) zatrzymuje się na karcie rutera albo serwera – tam kończy się sieć.'
 },
 {
  q: 'Po co serwerowi dwie karty?',
  a: 'Każda karta stoi w innej sieci. Serwer stoi między siecią stacji a siecią rutera, jak brama.'
 },
 {
  q: 'Dlaczego akurat te kolory?',
  a: 'Kolory to tylko etykiety sieci. Pomarańczowego nie używamy, bo w naszych materiałach znaczy Broadcast.'
 },
 {
  q: 'Skąd ten schemat?',
  a: 'Z arkusza INF.02 ze stycznia 2025 – rysunek jest pod spodem. Układ „serwer w środku” wraca w kilku arkuszach 2025–2026.'
 }
];

const ETAP_1: Exercise = {
 code: '1',
 title: 'Koloruję sieci',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_1,
 steps: [
  kuba('Dostałem arkusz. Sam tekst i adresy – nic nie widzę 😩', { excerpt: excerpt() }),
  ola('Odłóż adresy. Najpierw policzymy sieci.', { excerpt: DIM }),
  ola(
   'Sieć to wszystko, co łączy kabel i przełącznik.',
   { excerpt: DIM, pulse: ['stacja', 'przelacznik', 'c-stacja'] },
   PAINT
  ),
  action('Ola koloruje pierwszą sieć na niebiesko…', {
   excerpt: DIM,
   colored: ['niebieska'],
   spread: 'niebieska'
  }),
  ola('Sieć kończy się na karcie serwera. Dalej jest już inna.', {
   excerpt: DIM,
   colored: ['niebieska'],
   pulse: ['serwer-lan1']
  }),
  kuba('Czyli serwer stoi w dwóch sieciach naraz? 🤔', {
   excerpt: DIM,
   colored: ['niebieska'],
   pulse: ['serwer-wan']
  }),
  ola(
   'Tak – ma dwie karty. Każda karta to inna sieć.',
   { excerpt: DIM, colored: ['niebieska'], pulse: ['serwer-wan'] },
   PAINT
  ),
  action('Ola koloruje drugą sieć na zielono…', {
   excerpt: DIM,
   colored: ['niebieska', 'zielona'],
   spread: 'zielona'
  }),
  ola('Ruter też ma drugą kartę – tę na świat.', {
   excerpt: DIM,
   colored: ALL,
   spread: 'fioletowa'
  }),
  kuba('Trzy kolory – trzy sieci. To już coś widzę 🙂', { excerpt: DIM, colored: ALL }),
  quiz('W ilu sieciach jest serwer?', { excerpt: DIM, colored: ALL }, [
   ['A) W jednej.', 'Policz jego karty – ma dwie, w dwóch kolorach.', false],
   ['B) W dwóch.', 'Właśnie tak. Dwie karty – dwie sieci.', true]
  ]),
  // Ćwiczenie: ten sam schemat bez kolorów; po dobrej odpowiedzi sieć się koloruje.
  task('Kliknij wszystko, co jest w jednej sieci ze stacją roboczą.', {
   task: {
    kind: 'pick',
    targets: CARDS_AND_SWITCH,
    answer: ['stacja-lan2', 'przelacznik', 'serwer-lan1'],
    wrong: 'Ta karta jest za serwerem. Sieć kończy się na jego karcie.'
   },
   solvedColored: ['niebieska']
  }),
  task('Kliknij kartę serwera, która jest w jednej sieci z ruterem.', {
   colored: ['niebieska'],
   task: {
    kind: 'pick',
    targets: SERVER_CARDS,
    answer: ['serwer-wan'],
    wrong: 'To karta od strony przełącznika. Poszukaj tej od strony rutera.'
   },
   solvedColored: ['zielona']
  }),
  task(
   'Ile sieci jest na schemacie?',
   { colored: ['niebieska', 'zielona'], solvedColored: ['fioletowa'] },
   ['1', '2', '3', '4'].map((text) =>
    text === '3'
     ? { text, correct: true }
     : { text, feedback: 'Policz kolory: stacja–serwer, serwer–ruter, ruter–świat.' }
   )
  ),
  task(
   'Stacja robi ping do przełącznika. Czy ping wychodzi poza jej sieć?',
   { colored: ALL },
   yesNo('Nie', 'Oba są niebieskie – ping zostaje w jednej sieci.')
  )
 ]
};

// --- Etap 2: „Z arkusza do tabeli adresów” ---

const STATION_IP = { 'stacja-lan2': ['ip'] } as const;
const GW_LABEL = sheetGateway('stacja-lan2');
const EVERY_ADDRESS: SheetSpec['shown'] = {
 'ruter-wan': ['ip', 'gw'],
 'ruter-lan': ['ip'],
 'serwer-wan': ['auto'],
 'serwer-lan1': ['ip', 'gw', 'dns'],
 przelacznik: ['ip', 'gw'],
 'stacja-lan2': ['ip', 'gw', 'dns']
};
/** Etap 2 dzieje się na pokolorowanym schemacie, z wycinkiem arkusza obok. */
const colored = (state: Scene): Scene => ({ colored: ALL, excerpt: excerpt(), ...state });
const lit = (...keys: NonNullable<Excerpt['lit']>): Excerpt => excerpt({ lit: keys });

const TABLE_ROWS: readonly TableRow[] = [
 { card: 'ruter-lan', name: 'Ruter, interfejs\u00a0LAN', about: 'interfejsie LAN rutera' },
 { card: 'serwer-wan', name: 'Serwer, „WAN”', about: 'karcie „WAN” serwera' },
 { card: 'serwer-lan1', name: 'Serwer, „LAN\u00a01”', about: 'karcie „LAN 1” serwera' },
 { card: 'przelacznik', name: 'Przełącznik', about: 'przełączniku' },
 { card: 'stacja-lan2', name: 'Stacja, „LAN\u00a02”', about: 'karcie „LAN 2” stacji' }
];

const WRONG_GATE_IP = sheetIp('ruter-lan');

const NOTES_2: Note[] = [
 {
  q: 'Dlaczego maska /25 nie przeszkadza?',
  a: 'Wszystkie niebieskie adresy (.1, .2, .3) leżą w tej samej połowie sieci: od .0 do .127. Liczenie masek ćwiczysz w „Płotach maski”.'
 },
 {
  q: 'Dlaczego na karcie LAN 1 serwera „brama: brak”?',
  a: 'Urządzenie ma jedną bramę domyślną, nawet gdy ma kilka kart. Serwer wychodzi w świat kartą WAN, więc tam jest jego brama.'
 },
 {
  q: 'Skąd karta WAN serwera ma adres?',
  a: 'Arkusz mówi „uzyskiwane automatycznie”: adres daje DHCP rutera. Wyjaśnia to warstwa 3 „Skąd adres?”.'
 },
 {
  q: 'Czy stacja wyjdzie przez serwer do Internetu?',
  a: 'To zależy od usługi routingu na serwerze. W tym arkuszu nie jest to oceniane, więc scena tego nie rusza.'
 },
 {
  q: 'Gdzie jest maszyna wirtualna?',
  a: `W arkuszu jest jeszcze maszyna wirtualna z kartą „LAN 3”: ${SHEET_VM_LAN3}, w tej samej niebieskiej sieci. Pomijamy ją, żeby schemat był prostszy.`
 },
 {
  q: `Kto zna nazwy (DNS ${sheetIp('serwer-lan1')})?`,
  a: 'Serwer ma usługę DNS ze strefą egzamin.local. Więcej w warstwie „Kto zna nazwy?”.'
 }
];

const ETAP_2: Exercise = {
 code: '2',
 title: 'Z arkusza do tabeli adresów',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_2,
 steps: [
  kuba('Sieci widzę. Ale gdzie wpisać te wszystkie adresy?', colored({})),
  ola(
   'Każda linijka arkusza mówi o jednej karcie.',
   colored({
    excerpt: lit('stacja-lan2:ip', 'stacja-lan2:gw', 'stacja-lan2:dns'),
    pulse: ['stacja-lan2']
   }),
   act('📌 Przypnij ▶')
  ),
  action(
   'Adres ląduje przy karcie stacji…',
   colored({ excerpt: lit('stacja-lan2:ip'), shown: STATION_IP, fly: 'stacja-lan2' })
  ),
  ola(
   'Adres – to kim jestem w swojej sieci.',
   colored({ shown: STATION_IP, pulse: ['addr:stacja-lan2'] })
  ),
  ola(
   'Brama – to karta, przez którą wychodzę ze swojej sieci.',
   colored({ shown: STATION_IP, arrows: ['gw'], gwLabel: GW_LABEL })
  ),
  kuba(
   'Bramą stacji jest serwer? Nie ruter? 🤨',
   colored({ shown: STATION_IP, arrows: ['gw'], gwLabel: GW_LABEL, pulse: ['ruter'] })
  ),
  ola(
   'Ruter jest zielony. Stacja wprost do niego nie sięgnie.',
   colored({ shown: STATION_IP, arrows: ['blocked'] })
  ),
  ola(
   'Brama musi być w moim kolorze. Zawsze.',
   colored({
    shown: STATION_IP,
    arrows: ['gw'],
    gwLabel: GW_LABEL,
    pulse: ['stacja-lan2', 'serwer-lan1']
   })
  ),
  kuba(
   'A serwer? Na karcie „LAN 1” ma „brama: brak”.',
   colored({
    excerpt: lit('serwer-lan1:gw'),
    shown: { ...STATION_IP, 'serwer-lan1': ['gw'] },
    arrows: ['gw'],
    gwLabel: GW_LABEL
   })
  ),
  ola(
   'Bo w świat wychodzi drugą kartą – tą zieloną.',
   colored({
    shown: { ...STATION_IP, 'serwer-lan1': ['gw'] },
    arrows: ['gw', 'out'],
    gwLabel: GW_LABEL
   })
  ),
  // „Komputer” zostaje co do słowa (PYT-075b): mowa ogólna, nie nazwa urządzenia ze schematu.
  ola(
   'Komputer ma jedno wyjście w świat. Nie dwa.',
   colored({
    shown: { ...STATION_IP, 'serwer-lan1': ['gw'] },
    arrows: ['gw', 'out'],
    gwLabel: GW_LABEL,
    pulse: ['arrow:out']
   })
  ),
  kuba(
   'A DNS – co to za adres?',
   colored({
    excerpt: lit('stacja-lan2:dns'),
    shown: { 'stacja-lan2': ['ip', 'gw', 'dns'], 'serwer-lan1': ['gw'] },
    arrows: ['gw'],
    gwLabel: GW_LABEL
   })
  ),
  ola(
   'Adres tego, kto zna nazwy. Tutaj – serwer.',
   colored({
    shown: { 'stacja-lan2': ['ip', 'gw', 'dns'], 'serwer-lan1': ['gw'] },
    arrows: ['gw'],
    gwLabel: GW_LABEL,
    note: 'DNS → serwer',
    pulse: ['serwer-lan1']
   })
  ),
  quiz('Co stacja wpisze jako bramę?', colored({ shown: EVERY_ADDRESS }), [
   ['A) Adres rutera.', 'Ruter jest w innym kolorze. Brama musi być w kolorze stacji.', false],
   ['B) Adres serwera.', 'Właśnie tak – karta „LAN 1” serwera, ta niebieska.', true]
  ]),
  // Ćwiczenie: linijka arkusza → pole tabeli (mechanika i podpowiedzi: PYT-077a).
  task(
   'Kliknij linijkę arkusza, a potem pole tabeli, do którego należy.',
   colored({
    task: {
     kind: 'table',
     rows: TABLE_ROWS,
     hints: { row: 'Ta linijka mówi o {about}.', column: 'To jest {is}, nie {cell}.' },
     head: { card: 'Karta (kolor sieci)', ip: 'Adres IP', gw: 'Brama', dns: 'DNS' },
     fieldNames: { ip: 'adres IP', gw: 'brama', dns: 'DNS' },
     netNames: { niebieska: 'sieć niebieska', zielona: 'sieć zielona', fioletowa: 'sieć fioletowa' }
    }
   })
  ),
  task(
   'Kliknij kartę, która jest bramą przełącznika.',
   colored({
    excerpt: undefined,
    shown: EVERY_ADDRESS,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['serwer-lan1'],
     wrong: `Brama przełącznika to ${sheetGateway('przelacznik')}. Znajdź kartę z tym adresem.`
    }
   })
  ),
  task(
   'Serwer ma dwie karty. Na której wpiszesz bramę?',
   colored({
    excerpt: undefined,
    shown: EVERY_ADDRESS,
    task: {
     kind: 'pick',
     targets: SERVER_CARDS,
     answer: ['serwer-wan'],
     wrong: 'Na „LAN 1” arkusz mówi: brak. Wyjście w świat jest po stronie rutera.'
    }
   })
  ),
  task(
   `Stacja dostała bramę ${WRONG_GATE_IP}. Zadziała?`,
   colored({ excerpt: undefined, shown: EVERY_ADDRESS }),
   yesNo('Nie', `${WRONG_GATE_IP} jest zielone, stacja niebieska. Brama musi być w jej kolorze.`),
   { end: '↺ Od początku', restart: true }
  )
 ]
};

export const ARKUSZ: Course = {
 id: 'arkusz',
 title: 'Etapy ścieżki „Arkusz krok po kroku”',
 exercises: [ETAP_1, ETAP_2]
};

/** Pod ćwiczeniami obu etapów: oryginalny schemat z arkusza, poglądowo (prośba operatora). */
export const ARKUSZ_FIGURE: Figure = {
 src: sheetDrawing,
 alt: 'Schemat sieci z arkusza: Ruter (port LAN) – Serwer (karty WAN i LAN 1) – Przełącznik (porty 1 i 3) – Stacja robocza (LAN 2)',
 caption: 'Tak ten schemat wygląda w arkuszu INF.02 (styczeń 2025, strona 3) – poglądowo.'
};
