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
 SHEET_DHCP,
 SHEET_CARDS,
 SHEET_EXAMPLE,
 SHEET_FACTORY,
 SHEET_ROUTER_DNS,
 SHEET_VM_LAN3,
 type SheetCard,
 type SheetNet
} from '../model/arkusz';
import type { TaskOption } from '../ui/controls/TalkControl';
import type { Figure } from '../ui/ExamFigure';
import { formatIp, maskOf } from '../lib/ipv4';
import type { LinesSpec, ReservationSpec, SheetLine, WizardSpec } from '../ui/views/SheetParts';
import type { Cable, CardLabel, ExcerptRow, Field, SheetSpec, TableRow } from '../ui/views/SheetView';
import type { MiniSpec, PageSpec } from '../ui/views/SheetPage';
import { PAGE_BLOCKS } from './arkusz-strona';

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
 tab: 'Tabela adresów',
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
   yesNo('Nie', `${WRONG_GATE_IP} jest zielone, stacja niebieska. Brama musi być w jej kolorze.`)
  )
 ]
};

// --- Warstwa 3: „Skąd adres?” (scenariusz-arkusz-3.md, wersja 3; PYT-090a, PYT-092a) ---
// Reguła warstwy: 1 pytanie, 5 linijek arkusza, 2 pułapki, 1 nowa rzecz na schemacie (strzałka DHCP).

const { from: POOL_FROM, to: POOL_TO, reserved: RESERVED } = SHEET_DHCP;
const { leased: LEASED, macWan: MAC_WAN, macLan1: MAC_LAN1 } = SHEET_EXAMPLE;
const lastOctet = (ip: string) => Number(ip.split('.').at(-1));

const LINES: readonly SheetLine[] = [
 { id: 'L1', text: 'serwer DHCP: włączony' },
 { id: 'L2', text: `zakres adresów: ${POOL_FROM} ÷ ${POOL_TO}` },
 { id: 'L3', text: `zarezerwowany adres IP ${RESERVED} dla interfejsu WAN serwera` },
 {
  id: 'L4',
  text: 'adres IP oraz pozostałe parametry konfiguracji sieciowej: uzyskiwane automatycznie'
 },
 { id: 'L5', text: 'odśwież adres IP, w celu pobrania adresu zarezerwowanego w ruterze' }
];
const LINES_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o tym, skąd adres';
const lines = (...lit: string[]): LinesSpec => ({ title: LINES_TITLE, items: LINES, lit });

const EXAMPLE = '(przykład)';
const DHCP_ARROW = 'adres z DHCP';
const DHCP_RESERVED = `${RESERVED} ↔ MAC karty WAN`;

const QUESTION: Scene['labels'] = { 'serwer-wan': [{ text: '?' }] };
const leasedLabel = (tone?: CardLabel['tone']): Scene['labels'] => ({
 'serwer-wan': [
  { text: LEASED, tone },
  { text: EXAMPLE, tone: 'example' }
 ]
});
/** MAC-i przy obu kartach serwera; LAN 1 w trzecim rzędzie, żeby napisy na siebie nie wchodziły. */
const macLabels = (wan?: CardLabel['tone'], lan1?: CardLabel['tone']): Scene['labels'] => ({
 'serwer-wan': [{ text: LEASED }, { text: `MAC ${MAC_WAN}`, tone: wan ?? 'example' }],
 'serwer-lan1': [{ text: '' }, { text: '' }, { text: `MAC ${MAC_LAN1}`, tone: lan1 ?? 'example' }]
});

/** Panel rutera otwierany w przeglądarce na serwerze (karta WAN jest w sieci rutera). */
const TO_ROUTER_PANEL: Scene['browse'] = {
 from: 'serwer-wan',
 to: 'ruter-lan',
 label: sheetIp('ruter-lan')
};

/** Okno rezerwacji – napisy jak w panelu TP-Link (mapa-menu-urzadzen.md). */
const reservation = (stage: ReservationSpec['stage']): ReservationSpec => ({
 stage,
 labels: {
  title: 'Add a Reservation Entry',
  mac: 'MAC Address',
  ip: 'IP Address',
  view: 'VIEW CONNECTED DEVICES',
  save: 'SAVE',
  list: 'Select from Connected Devices:'
 },
 device: { name: 'serwer (WAN)', mac: MAC_WAN, ip: LEASED },
 fixedIp: RESERVED,
 example: `MAC i adres ${LEASED} to przykład – na egzaminie będą inne.`
});

/** Warstwa 3 dzieje się na pokolorowanym schemacie; adresy z etapu 2 są tłem (przygaszone). */
const layer3 = (state: Scene): Scene => ({
 colored: ALL,
 shown: EVERY_ADDRESS,
 shownDim: true,
 lines: lines(),
 ...state
});

const NOTES_3: Note[] = [
 {
  q: 'Co to jest DHCP?',
  a: 'Usługa, która rozdaje adresy kartom ustawionym na „automatycznie”. Na tym arkuszu działa na ruterze; w innych arkuszach bywa na serwerze.'
 },
 {
  q: 'Co jeszcze daje DHCP oprócz adresu?',
  a: `Maskę, bramę (${sheetIp('ruter-lan')}) i DNS. Dlatego w tabeli z etapu 2 karta WAN serwera ma „automatycznie” w każdej kolumnie.`
 },
 {
  q: 'Dlaczego najpierw /release, a potem /renew?',
  a: `Samo /renew prosi o przedłużenie starego adresu (${LEASED}) i część ruterów go przedłuży. /release oddaje stary adres, /renew prosi o nowy – wtedy przychodzi zarezerwowany.`
 },
 {
  q: 'Co, jeśli karty nie ma na liście w panelu?',
  a: `MAC odczytasz na serwerze: ipconfig /all, karta z adresem ${LEASED}, pole „Physical Address”.`
 },
 {
  q: 'Dlaczego MAC z ipconfig ma myślniki, a panel czasem chce dwukropków?',
  a: 'To ten sam adres zapisany na dwa sposoby. Przy przepisywaniu zamień znaki.'
 },
 {
  q: 'Co znaczy adres 169.254.x.x?',
  a: 'DHCP nie odpowiedział – np. kabel jest w złym porcie. Sprawdzanie takich kłopotów to osobna warstwa.'
 },
 {
  q: `Dlaczego ${LEASED} i MAC na schemacie są „przykładem”?`,
  a: 'Arkusz ich nie podaje. Na egzaminie zobaczysz inne liczby – liczy się, skąd je wziąć.'
 }
];

const ETAP_3: Exercise = {
 code: '3',
 title: 'Skąd adres?',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_3,
 steps: [
  kuba(
   'Serwer, karta »WAN«: »uzyskiwane automatycznie«. Od kogo? 🤔',
   layer3({ shownDim: false, lines: lines('L4'), labels: QUESTION, pulse: ['serwer-wan'] })
  ),
  ola(
   'Te wpisaliśmy ręcznie. Tę dostaje się od DHCP – rozdawacza adresów.',
   layer3({ labels: QUESTION })
  ),
  ola(
   'Na tym arkuszu adresy rozdaje ruter.',
   layer3({ lines: lines('L1'), labels: QUESTION, pulse: ['ruter-lan'] })
  ),
  kuba('Komu rozdaje? Stacji też?', layer3({ labels: QUESTION, pulse: ['stacja'] })),
  ola(
   'Nie. DHCP działa na karcie LAN rutera – tylko zielona sieć.',
   layer3({ colored: ['zielona'], labels: QUESTION, pulse: ['ruter-lan'] }),
   act('📨 Poproś ▶')
  ),
  action(
   'Serwer prosi o adres, ruter odpowiada…',
   layer3({ dhcp: { label: DHCP_ARROW, run: true }, labels: leasedLabel() })
  ),
  kuba(
   `Dostał ${LEASED} z zakresu. A arkusz chce ${RESERVED}!`,
   layer3({
    dhcp: { label: DHCP_ARROW },
    labels: leasedLabel('warn'),
    lines: {
     ...lines('L2', 'L3'),
     pool: {
      after: 'L2',
      from: lastOctet(POOL_FROM),
      to: lastOctet(POOL_TO),
      mark: lastOctet(LEASED)
     }
    }
   })
  ),
  ola(
   'Dlatego jest rezerwacja: ten adres zawsze dla tej karty.',
   layer3({ dhcp: { label: DHCP_ARROW }, labels: leasedLabel('warn'), lines: lines('L3') })
  ),
  kuba(
   'Skąd ruter wie, która karta to ta?',
   layer3({
    dhcp: { label: DHCP_ARROW },
    labels: leasedLabel(),
    pulse: ['serwer-wan', 'serwer-lan1']
   })
  ),
  ola(
   'Po MAC – pamiętasz go z ARP? Każda karta ma swój.',
   layer3({ dhcp: { label: DHCP_ARROW }, labels: macLabels() })
  ),
  ola(
   `Panel rutera ma listę kart. Wybierz tę z ${LEASED}.`,
   layer3({
    labels: macLabels('frame', 'strike'),
    reservation: reservation('list'),
    browse: TO_ROUTER_PANEL,
    lines: undefined
   }),
   act('📌 Wybierz ▶')
  ),
  kuba(
   `Wybrałem. Ale w polu adresu wpisało się ${LEASED} 🤨`,
   layer3({
    labels: macLabels('frame', 'strike'),
    reservation: reservation('picked'),
    browse: TO_ROUTER_PANEL,
    lines: undefined
   })
  ),
  ola(
   'Lista podaje obecny adres. Wpisz ten z arkusza.',
   layer3({
    labels: macLabels('frame', 'strike'),
    reservation: reservation('fixed'),
    browse: TO_ROUTER_PANEL,
    lines: { ...lines('L3'), items: LINES.filter((l) => l.id === 'L3') }
   }),
   act('💾 Zapisz ▶')
  ),
  action(
   `Ruter zapisuje rezerwację: MAC karty WAN → ${RESERVED}…`,
   layer3({ dhcp: { label: DHCP_RESERVED }, labels: leasedLabel() })
  ),
  kuba(
   'Wpisałem rezerwację, a serwer dalej ma stary adres 😩',
   layer3({
    dhcp: { label: DHCP_RESERVED },
    labels: leasedLabel('warn'),
    lines: lines('L5')
   })
  ),
  ola(
   'Serwer pamięta stary. Każ mu zapytać jeszcze raz.',
   layer3({
    dhcp: { label: DHCP_RESERVED },
    labels: leasedLabel('warn'),
    commands: ['ipconfig /release', 'ipconfig /renew']
   }),
   act('🔄 Odśwież ▶')
  ),
  action(
   'Serwer pyta jeszcze raz i dostaje swój adres…',
   layer3({
    dhcp: { label: DHCP_RESERVED, run: true },
    labels: { 'serwer-wan': [{ text: `${RESERVED} ✓`, tone: 'ok' }] }
   })
  ),
  quiz(
   'Po czym ruter pozna kartę serwera?',
   layer3({
    dhcp: { label: DHCP_RESERVED },
    labels: { 'serwer-wan': [{ text: `${RESERVED} ✓`, tone: 'ok' }] }
   }),
   [
    ['A) Po nazwie »WAN«.', 'Nazwę »WAN« zna tylko Windows. Ruter widzi MAC.', false],
    ['B) Po MAC.', 'Właśnie tak – MAC jest jak numer seryjny karty.', true]
   ]
  ),
  // Ćwiczenie: schemat z adresami z etapu 2, bez strzałki DHCP, przy karcie „WAN” serwera „?”.
  task(
   'Kliknij kartę, która dostaje adres od DHCP.',
   layer3({
    shownDim: false,
    labels: QUESTION,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['serwer-wan'],
     wrong: 'Ta karta ma adres wpisany ręcznie. Szukaj »automatycznie«.'
    }
   })
  ),
  task(
   'Kliknij linijki, które ustawiasz na ruterze.',
   layer3({
    shownDim: false,
    labels: QUESTION,
    task: {
     kind: 'lines',
     answer: ['L1', 'L2', 'L3'],
     check: 'Sprawdź',
     wrong: 'Tę linijkę robisz na serwerze, nie na ruterze.',
     missingOne: 'Brakuje jednej. Rezerwację też wpisujesz na ruterze.',
     missingOneId: 'L3',
     missingMore: 'Brakuje linijek. Wszystkie ustawienia DHCP wpisujesz na ruterze.'
    }
   })
  ),
  task(
   'Do rezerwacji potrzebujesz MAC. Której karty?',
   layer3({
    shownDim: false,
    labels: QUESTION,
    task: {
     kind: 'pick',
     targets: SERVER_CARDS,
     answer: ['serwer-wan'],
     wrong: 'LAN 1 jest niebieska. Rezerwacja dotyczy karty w sieci rutera.'
    }
   })
  ),
  task(
   `Serwer ma ${LEASED} zamiast ${RESERVED}. Co robisz?`,
   layer3({ shownDim: false, labels: leasedLabel('warn') }),
   [
    {
     text: `A) Wpisuję ${RESERVED} ręcznie.`,
     feedback: 'Nie wpisuj ręcznie – arkusz każe »automatycznie«. Sprawdź rezerwację i odśwież.'
    },
    { text: 'B) Sprawdzam rezerwację i odświeżam adres.', correct: true }
   ]
  )
 ]
};

// --- Warstwa 4: „Kto zna nazwy?” (scenariusz-arkusz-4.md, wersja 2; PYT-098a) ---
// Nowa rzecz na schemacie: strzałka „pytanie o nazwę” (przerywana, ciemna).

const LAN1_IP = sheetIp('serwer-lan1');
const SHEET_CARDS_DNS = (card: SheetCard): string => SHEET_CARDS[card].dns ?? '';
const DNS_WORLD = SHEET_ROUTER_DNS.primary;
const NAME = 'www.egzamin.local';

const LINES_4: readonly SheetLine[] = [
 { id: 'L1', where: 'stacja, LAN 2', text: `DNS: ${SHEET_CARDS_DNS('stacja-lan2')}` },
 { id: 'L2', where: 'serwer, LAN 1', text: `DNS: ${SHEET_CARDS_DNS('serwer-lan1')}` },
 {
  id: 'L3',
  where: 'serwer',
  text:
   'ustaw w strefie egzamin.local nowy rekord hosta o nazwie www, powiązany z adresem IP interfejsu sieciowego LAN 1'
 },
 { id: 'L4', where: 'ruter, DHCP', text: `serwer DNS: ${SHEET_DHCP.dns}` },
 {
  id: 'L5',
  where: 'ruter, WAN',
  text: `serwer DNS dla interfejsu WAN: ${DNS_WORLD} oraz drugi serwer DNS: ${SHEET_ROUTER_DNS.secondary}, jeśli jest wymagany`
 }
];
const LINES_4_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o tym, kto zna nazwy';
const lines4 = (...lit: string[]): LinesSpec => ({ title: LINES_4_TITLE, items: LINES_4, lit });

const ASKING = `${NAME} = ?`;
const NOT_FOUND = `${NAME} = ? ✕`;
const FOUND = `${NAME} = ${LAN1_IP} ✓`;
const BLOCKED: Scene['asks'] = [
 { from: 'stacja-lan2', to: 'world', blocked: true, label: 'brak odpowiedzi' }
];
const TO_SERVER: Scene['asks'] = [
 { from: 'stacja-lan2', to: 'serwer-lan1', label: `www? → ${LAN1_IP}` }
];
/** Spis serwera – w 2. i 3. rzędzie pod kartą LAN 1, żeby nie wchodził na adres karty WAN. */
const ZONE: CardLabel[] = [
 { text: '' },
 { text: 'strefa egzamin.local' },
 { text: `rekord: www → ${LAN1_IP}` }
];

/** Warstwa 4: schemat w kolorach, adresy z etapu 2 jako tło, przy karcie WAN serwera adres z warstwy 3. */
const layer4 = (state: Scene): Scene => {
 const { labels, ...rest } = state;
 return {
  colored: ALL,
  shown: EVERY_ADDRESS,
  shownDim: true,
  lines: lines4(),
  labels: { 'serwer-wan': [{ text: RESERVED }], ...labels },
  ...rest
 };
};

const NOTES_4: Note[] = [
 {
  q: 'Gdzie arkusz sprawdza DNS?',
  a: `W zadaniu 9: maszyna wirtualna otwiera ${NAME}. Ustaw DNS ${LAN1_IP} także w niej – to ją ocenia egzaminator.`
 },
 {
  q: 'Co to jest strefa wyszukiwania do przodu?',
  a: 'Spis „nazwa → adres” dla jednej domeny, tu egzamin.local. Spis odwrotny („adres → nazwa”) to strefa wsteczna – arkusz jej nie wymaga.'
 },
 {
  q: 'Czym sprawdzić DNS?',
  a: `Na stacji: nslookup ${NAME}. Odpowiedź powinna podać ${LAN1_IP}.`
 },
 {
  q: 'Skąd serwer zna nazwy spoza egzamin.local?',
  a: 'Usługa DNS na Windows Server sama pyta serwery główne Internetu – przez kartę WAN i ruter. Arkusz tego nie ocenia.'
 },
 {
  q: 'Dlaczego „drugi serwer DNS, jeśli jest wymagany”?',
  a: 'Niektóre panele rutera nie zapiszą ustawień bez drugiego DNS. Gdy panel nie protestuje, drugie pole możesz zostawić puste.'
 },
 {
  q: 'Co ma do tego IIS?',
  a: `Witryna jest powiązana z kartą LAN 1 i nazwą ${NAME}. Rekord www ze złym adresem poprowadzi przeglądarkę tam, gdzie strony nie ma. Instalację IIS ćwiczysz w Filarze 2.`
 }
];

const ETAP_4: Exercise = {
 code: '4',
 title: 'Kto zna nazwy?',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_4,
 steps: [
  kuba(
   `Stacja ma otworzyć ${NAME}. Skąd wie, gdzie to? 🤔`,
   layer4({ shownDim: false, bubble: ASKING, pulse: ['stacja'] })
  ),
  ola('Ludzie pamiętają nazwy, a sieć używa adresów.', layer4({ bubble: ASKING })),
  ola(
   'DNS zamienia nazwę na adres. Jak kontakty w telefonie.',
   layer4({ bubble: ASKING, pulse: ['stacja-lan2'] })
  ),
  kuba(
   `DNS? Wpiszę ${DNS_WORLD} – jak na ruterze!`,
   layer4({ bubble: ASKING, lines: lines4('L5') }),
   act('🔎 Zapytaj ▶')
  ),
  action(`Stacja pyta ${DNS_WORLD} o ${NAME}…`, layer4({ bubble: ASKING, asks: BLOCKED })),
  kuba('Nie działa! Strona się nie otwiera 😩', layer4({ bubble: NOT_FOUND, asks: BLOCKED })),
  ola(
   `Tam nie dojdziesz. A ${DNS_WORLD} i tak nie zna egzamin.local.`,
   layer4({ bubble: NOT_FOUND, asks: BLOCKED })
  ),
  ola(
   'egzamin.local zna tylko serwer. Ma ją w swoim spisie.',
   layer4({ bubble: ASKING, lines: lines4('L3'), labels: { 'serwer-lan1': ZONE } }),
   act('🔎 Zapytaj ▶')
  ),
  action(
   'Stacja pyta serwer, serwer odpowiada adresem…',
   layer4({ bubble: FOUND, lines: lines4('L1'), asks: TO_SERVER, labels: { 'serwer-lan1': ZONE } })
  ),
  kuba(
   `W rekordzie wpiszę ${RESERVED}? To przecież też serwer.`,
   layer4({ bubble: FOUND, labels: { 'serwer-lan1': ZONE }, pulse: ['serwer-wan'] })
  ),
  ola(
   `Arkusz mówi »LAN 1«. Jej adres masz w tabeli: ${LAN1_IP}.`,
   layer4({
    bubble: FOUND,
    lines: lines4('L3'),
    labels: { 'serwer-lan1': ZONE },
    pulse: ['serwer-lan1']
   })
  ),
  kuba(
   `A serwer? Ma DNS ${LAN1_IP}, a od DHCP ${SHEET_DHCP.dns}.`,
   layer4({ bubble: FOUND, lines: lines4('L2', 'L4'), labels: { 'serwer-lan1': ZONE } })
  ),
  ola(
   'Oba to jego własne adresy. Pyta sam siebie.',
   layer4({
    bubble: FOUND,
    lines: lines4('L2', 'L4'),
    labels: { 'serwer-lan1': ZONE },
    asks: [
     { from: 'serwer-wan', to: 'self' },
     { from: 'serwer-lan1', to: 'self' }
    ]
   })
  ),
  kuba(
   `To po co ${DNS_WORLD}?`,
   layer4({ bubble: FOUND, lines: lines4('L5'), labels: { 'serwer-lan1': ZONE } })
  ),
  ola(
   'Dla samego rutera. Na stacji go nie wpisujesz.',
   layer4({
    bubble: FOUND,
    lines: lines4('L5'),
    labels: { 'serwer-lan1': ZONE },
    asks: [{ from: 'ruter-wan', to: 'world', label: `${DNS_WORLD}?` }]
   })
  ),
  quiz(
   'Co stacja wpisze jako DNS?',
   layer4({
    bubble: FOUND,
    labels: { 'serwer-lan1': ZONE },
    asks: [...TO_SERVER!, { from: 'ruter-wan', to: 'world', label: `${DNS_WORLD}?` }]
   }),
   [
    [`A) ${DNS_WORLD}.`, `${DNS_WORLD} nie zna egzamin.local. Stacja pyta serwer.`, false],
    [`B) ${LAN1_IP}.`, 'Właśnie tak – karta LAN 1 serwera, w kolorze stacji.', true]
   ]
  ),
  // Ćwiczenie: bez strzałek pytań, bez spisu serwera; przy karcie WAN serwera adres z warstwy 3.
  task(
   'Kliknij kartę, którą stacja pyta o nazwy.',
   layer4({
    shownDim: false,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['serwer-lan1'],
     wrong: 'Ta karta nie zna egzamin.local. Szukaj adresu z wpisu DNS stacji.'
    }
   })
  ),
  task(
   'Kliknij linijki, w których adres DNS to nasz serwer.',
   layer4({
    shownDim: false,
    task: {
     kind: 'lines',
     answer: ['L1', 'L2', 'L4'],
     check: 'Sprawdź',
     wrong: `»Serwer DNS« to nazwa pola. ${DNS_WORLD} to nie nasz serwer.`,
     wrongBy: { L3: 'To rekord w strefie serwera, nie adres DNS karty.' },
     missingOne: `Brakuje jednej. ${SHEET_DHCP.dns} to też serwer – jego karta WAN.`,
     missingOneId: 'L4',
     missingMore: `Brakuje linijek. Szukaj adresów serwera: ${LAN1_IP} i ${SHEET_DHCP.dns}.`
    }
   })
  ),
  task('Rekord www: który adres wpiszesz?', layer4({ shownDim: false }), [
   { text: `A) ${RESERVED}.`, feedback: `Arkusz każe kartę LAN 1. Jej adres to ${LAN1_IP}.` },
   { text: `B) ${LAN1_IP}.`, correct: true }
  ]),
  task(
   `Kliknij kartę, której DNS to ${DNS_WORLD}.`,
   layer4({
    shownDim: false,
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['ruter-wan'],
     wrong: `Ta karta pyta nasz serwer. ${DNS_WORLD} jest w ustawieniach rutera.`
    }
   })
  )
 ]
};

// --- Warstwa 5: „Jak wejść na urządzenie?” (scenariusz-arkusz-5.md, wersja 2; PYT-100a) ---
// Nowa rzecz na schemacie: strzałka „przeglądarka” (ciągła, szara) od komputera do panelu urządzenia.

const ipOf = (cidr: string) => cidr.split('/')[0];
const ROUTER_FACTORY_IP = ipOf(SHEET_FACTORY.routerLan);
const SWITCH_FACTORY_IP = ipOf(SHEET_FACTORY.switch);
const STATION_CIDR = SHEET_CARDS['stacja-lan2'].cidr ?? '';
const SWITCH_IP = sheetIp('przelacznik');

const LINES_5: readonly SheetLine[] = [
 {
  id: 'L1',
  where: 'ruter',
  text:
   'Ruter pracuje na ustawieniach fabrycznych zgodnie z dokumentacją, która jest dostępna w folderze RUTER na nośniku opisanym DOKUMENTACJA/PROGRAMY.'
 },
 {
  id: 'L2',
  where: 'ruter',
  text: 'Jeżeli ruter wymaga zmiany hasła, ustaw je zgodnie z wymogami urządzenia.'
 },
 {
  id: 'L3',
  where: 'przełącznik',
  text:
   'Przełącznik pracuje na ustawieniach fabrycznych zgodnie z dokumentacją, która jest dostępna w folderze PRZEŁĄCZNIK na nośniku opisanym DOKUMENTACJA/PROGRAMY.'
 },
 {
  id: 'L4',
  where: 'przełącznik',
  text: 'Jeżeli przełącznik wymaga zmiany hasła, ustaw je zgodnie z wymogami urządzenia.'
 },
 { id: 'L5', where: 'stacja, LAN 2', text: `adres IP: ${STATION_CIDR}` }
];
const LINES_5_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o tym, jak wejść na urządzenie';
const lines5 = (...lit: string[]): LinesSpec => ({ title: LINES_5_TITLE, items: LINES_5, lit });

type Labels = NonNullable<Scene['labels']>;
const ROUTER_FACTORY = (note: string): Labels => ({
 'ruter-lan': [{ text: SHEET_FACTORY.routerLan }, { text: note, tone: 'example' }]
});
const SWITCH_FACTORY: Labels = {
 przelacznik: [{ text: SHEET_FACTORY.switch }, { text: '(fabrycznie)', tone: 'example' }]
};
/** Pod kartą WAN serwera o rząd niżej – żeby nie wchodzić na napisy pod ruterem. */
const SERVER_LEASE: Labels = {
 'serwer-wan': [
  { text: '' },
  { text: SHEET_FACTORY.routerLease },
  { text: '(od DHCP, przykład)', tone: 'example' }
 ]
};
const STATION_SHEET: Labels = { 'stacja-lan2': [{ text: STATION_CIDR }] };
const STATION_TEMP: Labels = {
 'stacja-lan2': [{ text: SHEET_FACTORY.stationTemp }, { text: '(na chwilę)', tone: 'example' }]
};
const SWITCH_DONE: Labels = {
 przelacznik: [
  { text: SHEET_CARDS.przelacznik.cidr ?? '' },
  { text: '(po konfiguracji)', tone: 'example' }
 ]
};
const RF = ROUTER_FACTORY('(fabrycznie, przykład)');
const TO_ROUTER: Scene['browse'] = {
 from: 'serwer-wan',
 to: 'ruter-lan',
 label: ROUTER_FACTORY_IP
};
const TO_SWITCH: Scene['browse'] = {
 from: 'stacja-lan2',
 to: 'przelacznik',
 label: SWITCH_FACTORY_IP
};

/** Warstwa 5: urządzenia fabryczne – bez adresów z arkusza (WAN rutera, LAN 1 serwera, przełącznik, stacja). */
const layer5 = (state: Scene): Scene => {
 const { labels, ...rest } = state;
 return {
  colored: ALL,
  shown: EVERY_ADDRESS,
  shownDim: true,
  lines: lines5(),
  labels: {
   'ruter-wan': [{ text: '' }],
   'serwer-lan1': [{ text: '' }],
   przelacznik: [{ text: '' }],
   'stacja-lan2': [{ text: '' }],
   ...labels
  },
  kubaRow: true,
  ...rest
 };
};
/** Stan przy przełączniku (kroki 9–17): stacja z adresem z arkusza, przełącznik fabryczny. */
const atSwitch = (state: Scene): Scene =>
 layer5({
  browse: TO_SWITCH,
  bubble: `${SWITCH_FACTORY_IP} ✕ brak odpowiedzi`,
  ...state,
  labels: { ...RF, ...SWITCH_FACTORY, ...STATION_SHEET, ...state.labels }
 });
const switchOpen = (state: Scene): Scene =>
 atSwitch({ bubble: `${SWITCH_FACTORY_IP} ✓`, labels: STATION_TEMP, ...state });

const NOTES_5: Note[] = [
 {
  q: 'Skąd wziąć adres i hasło fabryczne?',
  a: 'Z dokumentacji w folderach RUTER i PRZEŁĄCZNIK. Adresy w tej lekcji są z emulatorów producentów (TP-Link Archer C6, Cisco CBS350) – Twój model może mieć inne.'
 },
 {
  q: 'Czy mogę wejść na ruter ze stacji?',
  a: 'Tak – kablem na chwilę do rutera, z kartą ustawioną na „automatycznie”. Z serwera jest prościej: kabel do rutera i tak jest na schemacie.'
 },
 {
  q: 'Czy przełącznik może rozdawać adresy?',
  a: `Ten model ma serwer DHCP, ale z fabryki wyłączony. Sam pyta o adres, a gdy nikt nie odpowie, bierze ${SWITCH_FACTORY_IP}.`
 },
 {
  q: 'Jakie hasło przyjmie Cisco?',
  a: 'Co najmniej 8 znaków i 3 z 4 rodzajów: wielka litera, mała litera, cyfra, znak specjalny. Bez »cisco«, »cbs«, nazwy użytkownika i ciągów typu »abc« albo »123«.'
 },
 {
  q: 'Co, gdy po zmianie adresu panel przestaje odpowiadać?',
  a: 'Urządzenie ma już nowy adres – wejdź pod nowy. Ćwiczysz to w warstwach 6 i 7.'
 },
 {
  q: 'Dlaczego na Cisco trzeba kliknąć Save?',
  a: 'Apply zmienia tylko bieżącą konfigurację, Save zapisuje ją na stałe – bez tego restart kasuje zmiany. Ćwiczysz to w warstwie 6.'
 }
];

const ETAP_5: Exercise = {
 code: '5',
 title: 'Jak wejść na urządzenie?',
 tab: 'Jak wejść?',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_5,
 steps: [
  kuba(
   'Ruter i przełącznik są fabryczne. Jak do nich wejść? 🤔',
   layer5({ lines: lines5('L1', 'L3'), pulse: ['ruter', 'przelacznik'] })
  ),
  ola('Przez przeglądarkę – pod adresem z dokumentacji.', layer5({})),
  ola(`Ruter fabrycznie: ${ROUTER_FACTORY_IP}.`, layer5({ labels: RF })),
  kuba(
   'Z którego komputera? Stacja nie ma kabla do rutera.',
   layer5({ labels: RF, pulse: ['c-green'] })
  ),
  ola(
   'Z serwera. Jego karta WAN jest na »automatycznie«.',
   layer5({ labels: RF, pulse: ['serwer-wan'] }),
   act('🌐 Otwórz ▶')
  ),
  action(
   'Ruter daje serwerowi adres z DHCP. Panel się otwiera…',
   layer5({
    labels: { ...RF, ...SERVER_LEASE },
    browse: TO_ROUTER,
    bubble: `${ROUTER_FACTORY_IP} ✓`
   })
  ),
  kuba(
   'Wszedłem! Ruter każe utworzyć hasło.',
   layer5({
    labels: { ...RF, ...SERVER_LEASE },
    browse: TO_ROUTER,
    bubble: `${ROUTER_FACTORY_IP} ✓`,
    lines: lines5('L2')
   })
  ),
  ola(
   'Ustaw takie, jakiego chce. I zapisz je sobie.',
   layer5({
    labels: { ...RF, ...SERVER_LEASE },
    browse: TO_ROUTER,
    bubble: `${ROUTER_FACTORY_IP} ✓`,
    lines: lines5('L2')
   })
  ),
  kuba(
   `Przełącznik: ${SWITCH_FACTORY_IP}. Wpiszę stacji ${STATION_CIDR} z arkusza!`,
   atSwitch({ browse: undefined, bubble: undefined, lines: lines5('L5'), pulse: ['c-stacja'] }),
   act('🌐 Otwórz ▶')
  ),
  action(`Stacja z ${STATION_CIDR} otwiera ${SWITCH_FACTORY_IP}…`, atSwitch({})),
  kuba('Nie wchodzi?! Kabel jest, sieć ta sama 😩', atSwitch({ pulse: ['addr:stacja-lan2'] })),
  ola('Kabel jest. Ale dla maski /25 adres .254 jest za płotem.', atSwitch({})),
  ola('Ustaw stacji na chwilę maskę /24.', atSwitch({}), act('⚙️ Zmień ▶')),
  action('Stacja ma maskę /24 – panel przełącznika się otwiera…', switchOpen({})),
  ola(
   'Login i hasło fabryczne są w dokumentacji: cisco i cisco.',
   switchOpen({ lines: lines5('L3') })
  ),
  kuba(
   'Każe założyć nowego użytkownika – nie »cisco«. Hasło »cisco123« odrzucił 😩',
   switchOpen({ lines: lines5('L4') })
  ),
  ola(
   'Twoje ma trzy błędy: »cisco«, ciąg »123«, mało rodzajów znaków.',
   switchOpen({ lines: lines5('L4') })
  ),
  ola(
   `Gdy przełącznik ma już ${SWITCH_IP}, wróć stacji /25.`,
   atSwitch({
    browse: undefined,
    bubble: undefined,
    labels: { ...SWITCH_DONE },
    lines: lines5('L5')
   })
  ),
  quiz(
   `Stacja ${STATION_CIDR} nie otwiera ${SWITCH_FACTORY_IP}. Czemu?`,
   atSwitch({ browse: undefined }),
   [
    ['A) Zły kabel.', 'Kabel jest dobry. Maska /25 kończy sieć na .127.', false],
    ['B) .254 jest za płotem maski.', 'Właśnie tak – na chwilę potrzebna jest maska /24.', true]
   ]
  ),
  // Ćwiczenie: oba urządzenia fabryczne, bez strzałki „przeglądarka” i bez dymka.
  task(
   'Kliknij kartę, z której wejdziesz na fabryczny ruter.',
   layer5({
    kubaRow: false,
    shownDim: false,
    labels: { ...ROUTER_FACTORY('(fabrycznie)'), ...SWITCH_FACTORY },
    task: {
     kind: 'pick',
     targets: CARDS_AND_SWITCH.filter((c) => c !== 'przelacznik'),
     answer: ['serwer-wan'],
     wrong: 'Szukaj karty z kablem do rutera i adresem »automatycznie«.'
    }
   })
  ),
  task(
   'Kliknij linijkę, która mówi, skąd wziąć adres przełącznika.',
   layer5({
    kubaRow: false,
    shownDim: false,
    labels: { ...ROUTER_FACTORY('(fabrycznie)'), ...SWITCH_FACTORY },
    task: {
     kind: 'lines',
     answer: ['L3'],
     check: 'Sprawdź',
     wrong: 'Ta linijka nie mówi o adresie przełącznika.',
     wrongBy: { L5: 'To adres stacji. Adres przełącznika podaje dokumentacja – patrz L3.' },
     missingOne: 'Szukaj linijki o dokumentacji przełącznika.',
     missingOneId: 'L3',
     missingMore: 'Szukaj linijki o dokumentacji przełącznika.'
    }
   })
  ),
  task(
   'Które hasło przyjmie przełącznik Cisco?',
   layer5({
    kubaRow: false,
    shownDim: false,
    labels: { ...ROUTER_FACTORY('(fabrycznie)'), ...SWITCH_FACTORY }
   }),
   [
    { text: 'A) cisco2025', feedback: 'Hasło nie może zawierać »cisco«.' },
    { text: 'B) Pracownia#47Kz', correct: true },
    { text: 'C) Haslo123', feedback: 'Ciąg »123« jest zabroniony.' }
   ]
  ),
  task(
   `Przełącznik ma już ${SWITCH_IP}. Co robisz ze stacją?`,
   layer5({ kubaRow: false, shownDim: false, labels: { ...SWITCH_DONE, ...STATION_TEMP } }),
   [
    {
     text: 'A) Zostawiam /24.',
     feedback: 'Arkusz każe /25. Maska /24 była tylko kluczem do panelu.'
    },
    { text: `B) Przywracam ${STATION_CIDR} z arkusza.`, correct: true }
   ]
  )
 ]
};

// --- Warstwa 6: „Co ustawić na przełączniku i jak tego nie zgubić?” (scenariusz-arkusz-6.md, wersja 2;
// PYT-107a, PYT-108a: po Apply w kreatorze widać Save – kreator nie zapisuje na stałe) ---
// Nowa rzecz na schemacie: okienko kreatora ze ściągą masek.

const MASK_24 = formatIp(maskOf(24));
const MASK_25 = formatIp(maskOf(25));
const SWITCH_CIDR = SHEET_CARDS.przelacznik.cidr ?? '';
const SWITCH_GW = sheetGateway('przelacznik');

const LINES_6: readonly SheetLine[] = [
 { id: 'L1', where: 'przełącznik', text: `adres IP: ${SWITCH_CIDR}` },
 { id: 'L2', where: 'przełącznik', text: `brama domyślna: ${SWITCH_GW}` },
 {
  id: 'L3',
  where: 'przełącznik',
  text:
   'UWAGA: Po wykonaniu konfiguracji zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do oceny ustawień przełącznika.'
 }
];
const LINES_6_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o przełączniku';
const lines6 = (...lit: string[]): LinesSpec => ({ title: LINES_6_TITLE, items: LINES_6, lit });
const onlyLine6 = (id: string): LinesSpec => ({
 ...lines6(id),
 items: LINES_6.filter((l) => l.id === id)
});

const wizard = (state: Omit<WizardSpec, 'labels'>): WizardSpec => ({
 labels: {
  title: 'Getting Started Wizard → IP Settings',
  iface: 'Interface:',
  port: 'Unit 1 · Port GE1',
  vlan: 'VLAN 1',
  ip: 'IP Address:',
  mask: 'Network Mask:',
  gw: 'Administrative Default Gateway:',
  cheat: `/24 = ${MASK_24} · /25 = ${MASK_25}`
 },
 ...state
});

const SWITCH_UNSAVED: Labels = {
 przelacznik: [{ text: SWITCH_CIDR }, { text: '💾 niezapisane', tone: 'warn' }]
};
const SWITCH_SAVED: Labels = {
 przelacznik: [{ text: SWITCH_CIDR }, { text: '💾 zapisane', tone: 'ok' }]
};
const TO_SWITCH_NEW: Scene['browse'] = { from: 'stacja-lan2', to: 'przelacznik', label: SWITCH_IP };

/** Warstwa 6: stacja z maską /24 na chwilę, przełącznik fabryczny; adresy z etapu 2 jako tło. */
const layer6 = (state: Scene): Scene => {
 const { labels, ...rest } = state;
 return {
  colored: ALL,
  shown: EVERY_ADDRESS,
  shownDim: true,
  lines: lines6(),
  browse: TO_SWITCH,
  labels: { ...SWITCH_FACTORY, ...STATION_TEMP, ...labels },
  ...rest
 };
};

const NOTES_6: Note[] = [
 {
  q: 'Co to jest VLAN 1?',
  a: 'Grupa portów przełącznika – z fabryki są w niej wszystkie porty. Adres ustawiony na VLAN 1 odpowiada z każdego portu.'
 },
 {
  q: 'Gdzie jest przycisk Save?',
  a: 'Na górnym pasku panelu – pojawia się, gdy są niezapisane zmiany. Drugi sposób: File Operations, kopia Running Configuration do Startup Configuration.'
 },
 {
  q: `Dlaczego maska jako ${MASK_25}?`,
  a: `Pole „Network Mask” chce pełnej postaci. /25 to 25 jedynek: ${MASK_25}.`
 },
 {
  q: 'Czy da się bez kreatora?',
  a: `Tak: adres na VLAN 1 w IPv4 Interface, a bramę jako trasę ${formatIp(0)}/0 w IPv4 Static Routes. Kreator robi to na jednej stronie.`
 },
 {
  q: 'Kiedy przełącznik się restartuje?',
  a: 'Po Reboot, po zaniku prądu albo po przepięciu zasilania. Zapisana konfiguracja przetrwa każdy z nich.'
 },
 {
  q: `Dlaczego po restarcie jest ${SWITCH_FACTORY_IP}, a nie adres z DHCP?`,
  a: 'W niebieskiej sieci nikt nie rozdaje adresów – DHCP rutera działa tylko w zielonej. Przełącznik bierze więc adres fabryczny.'
 }
];

const ETAP_6: Exercise = {
 code: '6',
 title: 'Przełącznik: ustaw i zapisz',
 tab: 'Przełącznik',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_6,
 steps: [
  kuba('Jestem w panelu przełącznika. Co teraz ustawić? 🤔', layer6({ lines: lines6('L1', 'L2') })),
  ola('Adres i bramę z arkusza. Najprościej w kreatorze.', layer6({}), act('🧭 Otwórz kreator ▶')),
  action(
   'Kuba otwiera Getting Started Wizard → IP Settings…',
   layer6({ lines: undefined, wizard: wizard({ iface: 'port' }) })
  ),
  kuba(
   'Wpisuję adres. Interfejs zostawiam, jak był.',
   layer6({ lines: undefined, wizard: wizard({ iface: 'port', ip: SWITCH_IP }) })
  ),
  ola(
   'Stop! Port GE1 to jedno gniazdo. Adres działałby tylko tam.',
   layer6({ lines: undefined, wizard: wizard({ iface: 'port', ip: SWITCH_IP, blink: 'port' }) })
  ),
  ola(
   'Wybierz VLAN 1 – w nim są wszystkie porty.',
   layer6({ lines: undefined, wizard: wizard({ iface: 'vlan', ip: SWITCH_IP }) })
  ),
  kuba(
   'A maska /25? Tu jest pole »Network Mask«.',
   layer6({ lines: undefined, wizard: wizard({ iface: 'vlan', ip: SWITCH_IP, blink: 'mask' }) })
  ),
  ola(
   `Maskę wpisz pełną: ${MASK_25}.`,
   layer6({ lines: undefined, wizard: wizard({ iface: 'vlan', ip: SWITCH_IP, mask: MASK_25 }) })
  ),
  ola(
   'Brama to serwer: pole »Administrative Default Gateway«.',
   layer6({
    lines: onlyLine6('L2'),
    pulse: ['serwer-lan1'],
    wizard: wizard({ iface: 'vlan', ip: SWITCH_IP, mask: MASK_25, gw: SWITCH_GW })
   }),
   act('▶ Next… Apply ▶')
  ),
  action(
   'Kuba klika Next aż do podsumowania, potem Apply…',
   layer6({ browse: TO_SWITCH_NEW, labels: SWITCH_UNSAVED, bubble: `${SWITCH_IP} ✓` })
  ),
  kuba(
   'Działa! To już koniec?',
   layer6({ browse: TO_SWITCH_NEW, labels: SWITCH_UNSAVED, bubble: `${SWITCH_IP} ✓` })
  ),
  ola(
   'Sprawdźmy, czy przetrwa restart. Kliknij Reboot.',
   layer6({ browse: TO_SWITCH_NEW, labels: SWITCH_UNSAVED, bubble: `${SWITCH_IP} ✓` }),
   act('🔄 Reboot ▶')
  ),
  action('Przełącznik się restartuje…', layer6({ browse: undefined })),
  kuba(
   'Pod .2 cisza. Pod .254 fabryczny panel. Wszystko zniknęło 😩',
   layer6({ bubble: `${SWITCH_IP} ✕ → ${SWITCH_FACTORY_IP} ✓` })
  ),
  ola(
   'Apply działa tylko do restartu. Na stałe zapisuje Save.',
   layer6({}),
   act('💾 Ustaw i zapisz ▶')
  ),
  action(
   'Kuba loguje się od nowa, ustawia adres i klika Save…',
   layer6({ browse: TO_SWITCH_NEW, labels: SWITCH_SAVED, bubble: `${SWITCH_IP} ✓` })
  ),
  ola(
   'Zapisane. Wróć stacji /25 i podnieś rękę.',
   layer6({
    browse: TO_SWITCH_NEW,
    labels: { ...SWITCH_SAVED, ...STATION_SHEET },
    lines: lines6('L3')
   })
  ),
  quiz(
   'Kiedy podnosisz rękę do oceny przełącznika?',
   layer6({ browse: undefined, labels: { ...SWITCH_SAVED, ...STATION_SHEET } }),
   [
    ['A) Po Apply.', 'Po Apply zmiana żyje tylko do restartu. Najpierw Save.', false],
    ['B) Po Save.', 'Właśnie tak – po Save ustawienia przetrwają restart.', true]
   ]
  ),
  // Ćwiczenie: przełącznik fabryczny, bez okienka kreatora, strzałki i dymka.
  task('Kreator pyta o interfejs. Co wybierzesz?', layer6({ shownDim: false, browse: undefined }), [
   { text: 'A) VLAN 1.', correct: true },
   {
    text: 'B) Port GE1.',
    feedback: 'Adres na porcie działa tylko na tym gnieździe. Wybierz VLAN 1.'
   }
  ]),
  task(
   'Kliknij linijki, które wpiszesz w kreatorze.',
   layer6({
    shownDim: false,
    browse: undefined,
    task: {
     kind: 'lines',
     answer: ['L1', 'L2'],
     check: 'Sprawdź',
     wrong: 'Gotowość zgłaszasz ręką, nie w kreatorze.',
     missingOne: 'Brakuje bramy – to pole »Administrative Default Gateway«.',
     missingOneId: 'L2',
     missingMore: 'Do kreatora idą dwie linijki: adres i brama.'
    }
   })
  ),
  task(
   'Jak wpiszesz maskę /25 w polu »Network Mask«?',
   layer6({ shownDim: false, browse: undefined }),
   [
    { text: `A) ${MASK_24}.`, feedback: `${MASK_24} to /24. Maska /25 to ${MASK_25}.` },
    { text: `B) ${MASK_25}.`, correct: true }
   ]
  ),
  task(
   'Kliknąłeś tylko Apply. Po restarcie przełącznik ma adres:',
   layer6({ shownDim: false, browse: undefined }),
   [
    { text: `A) ${SWITCH_FACTORY_IP}.`, correct: true },
    { text: `B) ${SWITCH_IP}.`, feedback: 'Bez Save zmiana żyje tylko do restartu.' }
   ]
  )
 ]
};

// --- Warstwa 7: „W jakiej kolejności to robię?” (scenariusz-arkusz-7.md, wersja 2; PYT-113a) ---
// Nowa rzecz na schemacie: kable pojawiają się dopiero po wpięciu, z nazwami portów; kabel w złym
// porcie (PYT-111a) – szary łuk do portu WAN rutera. Adres po zmianie LAN: tymczasowo (PYT-115).

const ROUTER_LAN_CIDR = SHEET_CARDS['ruter-lan'].cidr ?? '';
const ROUTER_LAN_IP = sheetIp('ruter-lan');

const LINES_7: readonly SheetLine[] = [
 { id: 'L1', where: 'zadanie 2', text: '2. Skonfiguruj ruter zgodnie z następującymi zaleceniami:' },
 { id: 'L2', where: 'zadanie 2', text: `adres IP interfejsu LAN: ${ROUTER_LAN_CIDR}` },
 {
  id: 'L3',
  where: 'zadanie 3',
  text: '3. Skonfiguruj przełącznik zgodnie z następującymi zaleceniami:'
 },
 {
  id: 'L4',
  where: 'zadanie 4',
  text:
   '4. Za pomocą kabli połączeniowych znajdujących się na stanowisku egzaminacyjnym połącz urządzenia zgodnie ze schematem, a następnie podłącz je do sieci zasilającej.'
 },
 {
  id: 'L5',
  where: 'zadanie 7',
  text: 'odśwież adres IP, w celu pobrania adresu zarezerwowanego w ruterze'
 }
];
const LINES_7_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o kolejności pracy';
const lines7 = (...lit: string[]): LinesSpec => ({ title: LINES_7_TITLE, items: LINES_7, lit });

/** Nazwy portów ze schematu z arkusza (strona 3). */
const PORTS_SWITCH: Scene['ports'] = { 'c-lan1': 'PORT1', 'c-stacja': 'PORT3' };
const PORTS_ALL: Scene['ports'] = { 'c-green': 'PORT LAN', ...PORTS_SWITCH };
const SWITCH_CABLES: readonly Cable[] = ['c-lan1', 'c-stacja'];
const ALL_CABLES: readonly Cable[] = ['c-green', ...SWITCH_CABLES];

const ROUTER_FACTORY_7 = ROUTER_FACTORY('(fabrycznie)');
const ROUTER_NEW: Labels = { 'ruter-lan': [{ text: ROUTER_LAN_CIDR }] };
/** Pod kartą WAN serwera o rząd niżej – jak w warstwie 5, żeby nie wchodzić na napisy rutera. */
const serverWan = (...rows: CardLabel[]): Labels => ({ 'serwer-wan': [{ text: '' }, ...rows] });
const SERVER_NONE = serverWan({ text: 'brak adresu', tone: 'warn' });
const SERVER_OLD = serverWan(
 { text: SHEET_FACTORY.routerLease },
 { text: '(przykład)', tone: 'example' }
);
const SERVER_NEW = serverWan(
 { text: SHEET_EXAMPLE.afterLanChange },
 { text: '(przykład)', tone: 'example' }
);
const TO_ROUTER_FAIL: Scene['browse'] = { ...TO_ROUTER!, fail: true };
const TO_ROUTER_NEW: Scene['browse'] = { from: 'serwer-wan', to: 'ruter-lan', label: ROUTER_LAN_IP };

/** Warstwa 7: stanowisko przed pracą – bez kabli, ruter i przełącznik fabryczne, adresów z arkusza brak. */
const layer7 = (state: Scene): Scene => {
 const { labels, ...rest } = state;
 return {
  colored: ALL,
  lines: lines7(),
  cables: [],
  kubaRow: true,
  labels: { ...ROUTER_FACTORY_7, ...labels },
  ...rest
 };
};
/** Po kroku 7: przełącznik podłączony, serwer w porcie WAN rutera. */
const plugged = (state: Scene): Scene =>
 layer7({
  cables: SWITCH_CABLES,
  ports: PORTS_SWITCH,
  wrongPort: true,
  ...state,
  labels: { ...SWITCH_FACTORY, ...state.labels }
 });
/** Po kroku 12: wszystkie kable według schematu. */
const wired = (state: Scene): Scene =>
 plugged({ cables: ALL_CABLES, ports: PORTS_ALL, wrongPort: false, ...state });
/** Po zmianie LAN rutera (kroki 14–17): ruter ma nowy adres, serwer stary, panel się nie otwiera. */
const lanChanged = (state: Scene): Scene =>
 wired({
  browse: TO_ROUTER_FAIL,
  ...state,
  labels: { ...ROUTER_NEW, ...SERVER_OLD, ...state.labels }
 });
const renewed = (state: Scene): Scene =>
 wired({
  browse: TO_ROUTER_NEW,
  ...state,
  labels: { ...ROUTER_NEW, ...SERVER_NEW, ...state.labels }
 });

const START_HERE = 'Bez kabli nie wejdziesz na żadne urządzenie. Zacznij od zadania 4.';

const NOTES_7: Note[] = [
 {
  q: 'Dlaczego kable są dopiero w zadaniu 4?',
  a: 'Arkusz nie mówi, w jakiej kolejności pracować. Ruter i przełącznik ustawia się przeglądarką z serwera albo ze stacji, a do tego potrzebny jest kabel. Dlatego kable idą pierwsze – a zasilanie po kablach, jak w arkuszu.'
 },
 {
  q: 'A zadanie 1?',
  a: 'To gniazdo i panel krosowy, sprawdzane testerem. Nie łączy urządzeń ze schematu.'
 },
 {
  q: 'Czemu w tej warstwie nie ma kabla do świata?',
  a: 'Na egzaminie port WAN rutera zostaje pusty. Arkusz każe tylko wpisać jego adres (warstwa 2).'
 },
 {
  q: 'Jak odróżnić port WAN od portów LAN?',
  a: 'Port WAN jest zwykle jeden, ma inny kolor i podpis „Internet” albo „WAN”. Porty LAN są ponumerowane. Sprawdź na obudowie i w dokumentacji rutera.'
 },
 {
  q: 'Dlaczego w porcie WAN serwer nie dostał adresu?',
  a: 'Serwer DHCP rutera rozdaje adresy tylko od strony LAN. ipconfig pokaże wtedy 169.254.x.x – „DHCP nie odpowiedział” (warstwa 3).'
 },
 {
  q: 'Czy przełącznikowi jest wszystko jedno, który port?',
  a: 'Działać będzie każdy – wszystkie są w VLAN 1 (warstwa 6). Ale arkusz każe łączyć zgodnie ze schematem: serwer do PORT1, stacja do PORT3.'
 },
 {
  q: 'Cała kolejność pracy:',
  a: 'kable → ruter z serwera (WAN, DNS, LAN, odśwież, DHCP, rezerwacja, odśwież) → przełącznik ze stacji (maska /24 na chwilę) → serwer (LAN 1) → stacja (wróć /25, maszyna wirtualna) → sprawdzenie (warstwa 8).'
 }
];

const ETAP_7: Exercise = {
 code: '7',
 title: 'W jakiej kolejności to robię?',
 tab: 'Kolejność',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_7,
 steps: [
  kuba('Zadanie 1 zrobione. Teraz po kolei: zadanie 2, ruter!', layer7({ lines: lines7('L1') })),
  ola('Czym wejdziesz na ruter? Nie ma jeszcze żadnego kabla.', layer7({ pulse: ['c-green'] })),
  kuba('Kable są dopiero w zadaniu 4. Mam je zrobić pierwsze?', layer7({ lines: lines7('L4') })),
  ola(
   'Tak. Kolejność zadań w arkuszu to nie kolejność pracy.',
   layer7({}),
   act('🔌 Do szafy ▶')
  ),
  kuba(
   'Jestem przy szafie. Karta serwera to WAN – więc port WAN!',
   layer7({ pulse: ['serwer-wan', 'ruter-wan'] })
  ),
  action('Kuba wpina kabel serwera w port WAN rutera…', layer7({ wrongPort: true })),
  action('…potem serwer i stację do przełącznika i włącza zasilanie.', plugged({})),
  kuba(
   `Wszystko wpięte. Siadam do serwera, otwieram ${ROUTER_FACTORY_IP}.`,
   plugged({ browse: TO_ROUTER_FAIL })
  ),
  kuba(
   'Nie wchodzi! Serwer nawet nie dostał adresu 😩',
   plugged({ browse: TO_ROUTER_FAIL, labels: SERVER_NONE })
  ),
  ola(
   'Port WAN patrzy w internet. Tam ruter adresów nie rozdaje.',
   plugged({ browse: TO_ROUTER_FAIL, labels: SERVER_NONE, pulse: ['ruter-wan'] })
  ),
  ola(
   'Nazwa karty to nie nazwa portu. Serwer idzie do PORT LAN.',
   plugged({
    browse: TO_ROUTER_FAIL,
    labels: SERVER_NONE,
    pulse: ['ruter-lan'],
    lines: lines7('L4')
   }),
   act('🔌 Przepnij ▶')
  ),
  action('Kuba idzie do szafy i przepina kabel do PORT LAN…', wired({})),
  kuba(
   'Wróciłem do serwera. Jest adres i panel się otwiera!',
   wired({ browse: TO_ROUTER, labels: SERVER_OLD })
  ),
  action(
   `Kuba zmienia adres LAN rutera na ${ROUTER_LAN_IP} i klika SAVE…`,
   lanChanged({ lines: lines7('L2') })
  ),
  kuba(`Panel zniknął! Pod ${ROUTER_FACTORY_IP} cisza 😩`, lanChanged({})),
  ola(
   'Ruter ma już nowy adres. Serwer został w starej sieci.',
   lanChanged({ pulse: ['addr:ruter-lan', 'addr:serwer-wan'] })
  ),
  ola(
   'Odśwież adres serwera. To polecenie z zadania 7 – tylko wcześniej.',
   lanChanged({ lines: lines7('L5') }),
   act('⌨ Odśwież ▶')
  ),
  action(
   'Kuba wpisuje ipconfig /release i ipconfig /renew…',
   renewed({ commands: ['ipconfig /release', 'ipconfig /renew'] })
  ),
  ola(
   'Potem DHCP, rezerwacja, zgłoszenie ręką. Dopiero wtedy przełącznik.',
   renewed({ lines: lines7('L1', 'L3') })
  ),
  quiz('Arkusz: ruter w zadaniu 2, kable w 4. Co robisz najpierw?', renewed({ browse: undefined }), [
   ['A) Ruter.', 'Na ruter wchodzisz kablem. Najpierw kable według schematu.', false],
   ['B) Kable.', 'Właśnie tak – bez kabli nie wejdziesz na żadne urządzenie.', true]
  ]),
  // Ćwiczenie: stanowisko przed pracą – bez kabli, bez strzałki „przeglądarka”.
  task(
   'Kliknij linijkę, od której zaczniesz pracę przy stanowisku.',
   layer7({
    task: {
     kind: 'lines',
     answer: ['L4'],
     check: 'Sprawdź',
     wrong: START_HERE,
     wrongBy: { L5: 'Odświeżasz, gdy już jest kabel. Zacznij od zadania 4.' },
     missingOne: 'Zaznacz jedną linijkę – tę, od której zaczniesz.',
     missingOneId: 'L4',
     missingMore: 'Zaznacz jedną linijkę – tę, od której zaczniesz.'
    }
   })
  ),
  task(
   'Kliknij port rutera, do którego wepniesz kabel serwera.',
   plugged({
    wrongPort: false,
    task: {
     kind: 'pick',
     targets: ['ruter-wan', 'ruter-lan'],
     answer: ['ruter-lan'],
     wrong: 'Karta serwera nazywa się WAN, ale wpinasz ją w PORT LAN rutera.'
    }
   })
  ),
  task('Zmieniłeś adres LAN rutera i panel zniknął. Co robisz?', layer7({}), [
   {
    text: 'A) Resetuję ruter do ustawień fabrycznych.',
    feedback: 'Reset skasuje twoją pracę. Odśwież adres serwera.'
   },
   { text: `B) Odświeżam adres serwera i wchodzę na ${ROUTER_LAN_IP}.`, correct: true }
  ]),
  task(
   'Kiedy pierwszy raz odświeżysz adres serwera?',
   layer7({}),
   [
    { text: 'A) Zaraz po zmianie adresu LAN rutera.', correct: true },
    {
     text: 'B) Dopiero w zadaniu 7.',
     feedback: 'Bez odświeżenia nie wejdziesz pod nowy adres rutera.'
    }
   ]
  )
 ]
};

// --- Warstwa 8: „Jak sprawdzić, że działa?” (scenariusz-arkusz-8.md, wersja 2; PYT-117a) ---
// Nowa rzecz na schemacie: strzałka „ping” (kropkowana, neutralna) z ✓ albo ✕. Nazwa reguły zapory –
// skrót; pełna nazwa w polskim Windows do sprawdzenia (PYT-118).

const STATION_ADDR = sheetIp('stacja-lan2');
const SERVER_WAN_IP = SHEET_DHCP.reserved;

const LINES_8: readonly SheetLine[] = [
 {
  id: 'L1',
  where: 'zadanie 8',
  text:
   '8. Na serwerze za pomocą poleceń systemowych wykonaj test komunikacji serwera ze stacją roboczą oraz interfejsem LAN rutera.'
 },
 { id: 'L2', where: 'zadanie 8', text: 'Wyświetl adres IP interfejsu WAN serwera.' },
 {
  id: 'L3',
  where: 'zadanie 8',
  text: 'W razie potrzeby na stacji roboczej zmień odpowiednio ustawienia zapory sieciowej.'
 },
 {
  id: 'L4',
  where: 'zadanie 8',
  text:
   'UWAGA: Po wykonaniu testów połączenia zgłoś Przewodniczącemu ZN – przez podniesienie ręki – gotowość do przeprowadzenia ponownego sprawdzenia komunikacji serwera z ruterem oraz stacją roboczą. Sprawdzenie wykonaj w obecności egzaminatora. Na ekranie serwera wyświetl automatycznie nadany adres IP'
 }
];
const LINES_8_TITLE = 'Arkusz, styczeń 2025 – tylko linijki o sprawdzaniu';
const lines8 = (...lit: string[]): LinesSpec => ({ title: LINES_8_TITLE, items: LINES_8, lit });

const PING_ROUTER = { from: 'serwer-wan', to: 'ruter-lan', ok: true } as const;
const pingStation = (ok: boolean) => ({ from: 'serwer-lan1', to: 'stacja-lan2', ok }) as const;
const BOTH_OK = [PING_ROUTER, pingStation(true)];

/** Napis o zaporze w trzecim rzędzie – w drugim stoi brama przełącznika obok. */
const FIREWALL_ON: Labels = {
 'stacja-lan2': [
  { text: STATION_CIDR },
  { text: '' },
  { text: '🛡 zapora: ping zablokowany', tone: 'warn' }
 ]
};
const FIREWALL_OFF: Labels = {
 'stacja-lan2': [
  { text: STATION_CIDR },
  { text: '' },
  { text: '🛡 zapora: ping dozwolony', tone: 'ok' }
 ]
};

/** Warstwa 8: wszystko ustawione (koniec warstwy 7), adresy z arkusza przygaszone, serwer z rezerwacji. */
const layer8 = (state: Scene): Scene => {
 const { labels, ...rest } = state;
 return {
  colored: ALL,
  shown: EVERY_ADDRESS,
  shownDim: true,
  lines: lines8(),
  cables: ALL_CABLES,
  ports: PORTS_ALL,
  kubaRow: true,
  labels: { ...serverWan({ text: SERVER_WAN_IP }), ...labels },
  ...rest
 };
};
/** Po regule zapory (krok 11 i dalej). */
const allowed = (state: Scene): Scene =>
 layer8({ ...state, labels: { ...FIREWALL_OFF, ...state.labels } });

const NOTES_8: Note[] = [
 {
  q: 'Co to jest ping?',
  a: 'Wysyła „żądanie echa” – wiadomość ICMP – i czeka na odpowiedź. Na serwerze (po angielsku): „Reply from …” – działa, „Request timed out.” – odpowiedź nie przyszła. Na stacji (po polsku): „Odpowiedź z …” i „Upłynął limit czasu żądania.”'
 },
 {
  q: 'Za co są punkty?',
  a: 'Styczeń 2026: „urządzenie odpowiada na polecenie, np. ping”. Czerwiec 2025: „test potwierdzający komunikację”. Liczy się odpowiedź, nie samo wpisanie polecenia.'
 },
 {
  q: 'Dlaczego zapora blokuje ping?',
  a: 'Zapora Windows z fabryki nie odpowiada na „żądanie echa”. Reguła „żądanie echa ICMPv4” to wyjątek tylko dla pingu. Reguł o tej nazwie bywa kilka (dla różnych profili sieci) – włącz wszystkie.'
 },
 {
  q: 'Czemu nie wyłączyć całej zapory?',
  a: 'Arkusz mówi „zmień odpowiednio”. Wyłączona zapora otwiera wszystko, reguła – tylko ping.'
 },
 {
  q: 'Jak sprawdzić, że to nie adres?',
  a: `Na stacji ipconfig; z serwera ping ${SWITCH_IP} – przełącznik odpowiada, więc niebieska sieć działa.`
 },
 {
  q: `ipconfig pokazuje inny adres niż ${SERVER_WAN_IP}?`,
  a: 'Sprawdź rezerwację i odśwież adres (warstwa 3).'
 },
 {
  q: 'A zadanie 9?',
  a: 'Strona www.egzamin.local w maszynie wirtualnej sprawdza DNS z warstwy 4 i kartę maszyny w trybie mostkowanym. Wraca w warstwie 9.'
 }
];

const ETAP_8: Exercise = {
 code: '8',
 title: 'Jak sprawdzić, że działa?',
 tab: 'Sprawdzam',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_8,
 steps: [
  kuba(
   'Wszystko ustawione i zapisane. Jak sprawdzić, że działa? 🤔',
   layer8({ lines: lines8('L1') })
  ),
  ola(
   'Test komunikacji to ping. Z serwera: do stacji i do rutera.',
   layer8({ pulse: ['ruter-lan', 'stacja-lan2'] })
  ),
  ola('Ping wysyła »żądanie echa«. Odpowiedź znaczy: działa.', layer8({})),
  kuba(
   `Siadam do serwera. Najpierw ruter: ping ${ROUTER_LAN_IP}.`,
   layer8({}),
   act('📶 Ping ▶')
  ),
  action(
   'Kuba wpisuje ping do rutera…',
   layer8({ pings: [PING_ROUTER], commands: [`ping ${ROUTER_LAN_IP} → Reply from ${ROUTER_LAN_IP} ✓`] })
  ),
  kuba(
   `Ruter odpowiada! Teraz stacja: ping ${STATION_ADDR}.`,
   layer8({ pings: [PING_ROUTER] }),
   act('📶 Ping ▶')
  ),
  action(
   'Kuba wpisuje ping do stacji…',
   layer8({
    pings: [PING_ROUTER, pingStation(false)],
    commands: [`ping ${STATION_ADDR} → Request timed out. ✕`]
   })
  ),
  kuba(
   'Stacja milczy 😩 Może zły adres? Zmienię go.',
   layer8({ pings: [PING_ROUTER, pingStation(false)] })
  ),
  ola(
   'Stop. Adres jest z arkusza. Windows z fabryki nie odpowiada na ping.',
   layer8({
    pings: [PING_ROUTER, pingStation(false)],
    labels: FIREWALL_ON,
    pulse: ['addr:stacja-lan2']
   })
  ),
  ola(
   'Arkusz to przewidział – linijka o zaporze. Idź do stacji.',
   layer8({ pings: [PING_ROUTER, pingStation(false)], labels: FIREWALL_ON, lines: lines8('L3') }),
   act('🛡 Zapora ▶')
  ),
  action(
   'Kuba włącza w zaporze stacji regułę »żądanie echa ICMPv4«…',
   allowed({ pings: [PING_ROUTER] })
  ),
  action(
   'Kuba wraca do serwera i jeszcze raz pinguje stację…',
   allowed({ pings: BOTH_OK, commands: [`ping ${STATION_ADDR} → Reply from ${STATION_ADDR} ✓`] })
  ),
  kuba(
   '»Ze stacją oraz interfejsem rutera« – ping ze stacji do rutera? Idę!',
   allowed({ pings: BOTH_OK, lines: lines8('L1') }),
   act('📶 Ping ▶')
  ),
  action(
   'Kuba wpisuje na stacji ping do rutera…',
   allowed({
    arrows: ['blocked'],
    commands: [`ping ${ROUTER_LAN_IP} → Upłynął limit czasu żądania. ✕`],
    commandsAt: 'stacja'
   })
  ),
  kuba('Znowu limit czasu! Coś zepsułem? 😩', allowed({ arrows: ['blocked'] })),
  ola(
   'Nie. Ten serwer nie przekazuje ruchu dalej. Pamiętasz ✕ przy bramie?',
   allowed({ arrows: ['blocked'], pulse: ['serwer'] })
  ),
  ola(
   'Z serwera: do rutera zieloną kartą, do stacji niebieską.',
   allowed({ pings: BOTH_OK, pulse: ['serwer-wan', 'serwer-lan1'] })
  ),
  action(
   'Kuba wraca do serwera i wyświetla adres WAN: ipconfig…',
   allowed({
    pings: BOTH_OK,
    commands: [`ipconfig → WAN: ${SERVER_WAN_IP}`],
    pulse: ['addr:serwer-wan'],
    lines: lines8('L2')
   })
  ),
  ola(
   'Zgłoś gotowość. Przy egzaminatorze powtórzysz pingi i ipconfig.',
   allowed({ pings: BOTH_OK, commands: [`ipconfig → WAN: ${SERVER_WAN_IP}`], lines: lines8('L4') })
  ),
  quiz('Ping do stacji: limit czasu. Zgłaszasz gotowość?', allowed({ pings: BOTH_OK, lines: lines8('L4') }), [
   ['A) Tak.', 'Punkt jest za odpowiedź, nie za wpisanie pingu.', false],
   ['B) Nie, najpierw zapora.', 'Właśnie tak – najpierw stacja musi odpowiedzieć.', true]
  ]),
  // Ćwiczenie: schemat jak w kroku 1 – bez napisu o zaporze, bez strzałek i poleceń.
  task(
   'Kliknij linijki, które wykonasz poleceniami na serwerze.',
   layer8({
    task: {
     kind: 'lines',
     answer: ['L1', 'L2'],
     check: 'Sprawdź',
     wrong: 'Zaporę zmieniasz na stacji – choć linijka stoi w zadaniu 8.',
     wrongBy: { L4: 'To zgłoszenie ręką. Polecenia powtórzysz przy egzaminatorze.' },
     missingOne: 'Brakuje adresu WAN – wyświetlasz go na serwerze.',
     missingOneId: 'L2',
     missingMore: 'Przy serwerze robisz dwie rzeczy: ping i ipconfig.'
    }
   })
  ),
  task('Serwer: ruter odpowiada, stacja – limit czasu. Co zmieniasz?', layer8({}), [
   { text: 'A) Regułę zapory na stacji.', correct: true },
   {
    text: 'B) Adres IP stacji.',
    feedback: 'Adres wpisałeś z arkusza. Windows z fabryki nie odpowiada na ping.'
   }
  ]),
  task('Ping ze stacji do rutera nie przechodzi. Co robisz?', layer8({}), [
   {
    text: 'A) Szukam błędu w bramie stacji.',
    feedback: 'To nie błąd. Ten serwer nie przekazuje ruchu dalej.'
   },
   { text: 'B) Nic – tak ma być.', correct: true }
  ]),
  task(
   'Kliknij kartę, którą serwer pinguje ruter.',
   layer8({
    task: {
     kind: 'pick',
     targets: ['serwer-wan', 'serwer-lan1'],
     answer: ['serwer-wan'],
     wrong: 'Ruter jest w zielonej sieci. Ping idzie zieloną kartą.'
    }
   })
  )
 ]
};

// --- Warstwa 9: „Cały arkusz” (scenariusz-arkusz-9.md, wersja 2; PYT-121a–125a) ---
// W miejscu schematu strona arkusza (arkusz-strona.ts), zakreślacz w kolejności pracy, plakietki
// „zakładka + pułapka”, mały schemat z wierszem Kuby i ramką „maszyna” (PYT-125a).

/** Nazwa zakładki tak jak na stronie, np. „7 Kolejność”. */
const tabOf = (ex: Exercise) => `${ex.code} ${ex.tab ?? ex.title}`;
const [T1, T2, T3, T4, T5, T6, T7, T8] = [
 ETAP_1,
 ETAP_2,
 ETAP_3,
 ETAP_4,
 ETAP_5,
 ETAP_6,
 ETAP_7,
 ETAP_8
].map(tabOf);
const T9 = '9 Cały arkusz';
const VM_IP = ipOf(SHEET_VM_LAN3);
const STATION_DNS_9 = SHEET_CARDS['stacja-lan2'].dns ?? '';

const FRAGMENTS_9: PageSpec['fragments'] = {
 F1: { tabs: [T7], trap: '⚠ serwer do PORT LAN, nie do WAN rutera' },
 F2: { tabs: [T5], trap: '⚠ wchodzisz z serwera – karta WAN „automatycznie”' },
 F3: { tabs: [T2], trap: '⚠ brama WAN jest u dostawcy, poza schematem' },
 F4: { tabs: [T4], trap: '⚠ DNS rutera, nie stacji' },
 F5: { tabs: [T7, T2], trap: '⚠ panel „ucieka”' },
 F6: { tabs: [T7], trap: '⚠ potrzebna już przy zadaniu 2' },
 F7: { tabs: [T3], trap: '⚠ karta WAN; adres zmień na .20' },
 F8: { tabs: [T5, T2], trap: '⚠ do panelu przełącznika /24 na chwilę' },
 F9: { tabs: [T6, T2], trap: '⚠ VLAN 1, potem Save' },
 F10: { tabs: [T2], trap: '⚠ „brak” = puste pole' },
 F11: { tabs: [T4], trap: '⚠ adres karty LAN 1, nie WAN' },
 F12: { tabs: [T8], trap: '⚠ z serwera, nie ze stacji' },
 F13: { tabs: [T8], trap: '⚠ reguła na stacji, nie na serwerze' },
 F14: { tabs: [T9], trap: '⚠ nowe: karta mostkowana, nie NAT' },
 F15: { tabs: [T4], trap: `⚠ DNS maszyny: ${STATION_DNS_9}` }
};

/** Widok warstwy 9: strona arkusza i mały schemat. */
const page9 = (page: Omit<PageSpec, 'blocks' | 'fragments'>, mini: MiniSpec = {}): Scene => ({
 page: { blocks: PAGE_BLOCKS, fragments: FRAGMENTS_9, ...page },
 mini,
 kubaRow: true
});

interface Tour {
 who: 'ola' | 'kuba';
 text: string;
 lit?: string[];
 /** Fragmenty bez plakietki (UWAGI; F14 zanim pułapka się urodzi). */
 bare?: string[];
 focus?: string;
 blinkTag?: string;
 mini?: MiniSpec;
}

/** Przebieg sceny: każdy krok zakreśla swoje fragmenty, wcześniejsze zostają blade. */
const TOUR_9: Tour[] = [
 { who: 'kuba', text: 'Cały arkusz naraz! Od czego zacząć? 🤔' },
 {
  who: 'ola',
  text: 'Od kabli – zadanie 4. Serwer wpinasz w PORT LAN.',
  lit: ['F1'],
  mini: { lit: ['cables'] }
 },
 {
  who: 'kuba',
  text: 'Siadam do serwera. Ruter fabryczny – adres z dokumentacji.',
  lit: ['F2'],
  mini: { lit: ['ruter-lan', 'serwer-wan'] }
 },
 {
  who: 'ola',
  text: 'Najpierw adres WAN i DNS. Ten DNS jest dla rutera.',
  lit: ['F3', 'F4'],
  mini: { lit: ['ruter-wan'] }
 },
 {
  who: 'kuba',
  text: `Zmieniam adres LAN na ${ROUTER_LAN_IP}… panel zniknął!`,
  lit: ['F5'],
  mini: { lit: ['ruter-lan'] }
 },
 {
  who: 'ola',
  text: 'Odśwież adres serwera. Ta linijka stoi w zadaniu 7.',
  lit: ['F6'],
  mini: { lit: ['serwer-wan'] }
 },
 {
  who: 'ola',
  text: 'Teraz DHCP i rezerwacja – dla karty WAN serwera.',
  lit: ['F7'],
  mini: { lit: ['serwer-wan'] }
 },
 {
  who: 'kuba',
  text: `Odświeżam drugi raz: ${SHEET_DHCP.reserved}. Ruter gotowy, ręka!`,
  lit: ['U2'],
  bare: ['U2']
 },
 {
  who: 'kuba',
  text: 'Teraz przełącznik. Siadam do stacji – maska /24 na chwilę.',
  lit: ['F8'],
  mini: { lit: ['stacja-lan2'] }
 },
 {
  who: 'ola',
  text: 'Adres na VLAN 1, Save. Stacji wróć /25 i ręka.',
  lit: ['F9', 'U3'],
  bare: ['U3'],
  mini: { lit: ['przelacznik'] }
 },
 {
  who: 'kuba',
  text: 'Wracam do serwera. Karta LAN 1, brama – brak.',
  lit: ['F10'],
  mini: { lit: ['serwer-lan1'] }
 },
 {
  who: 'ola',
  text: 'Rekord www to adres karty LAN 1, nie WAN.',
  lit: ['F11'],
  mini: { lit: ['serwer-lan1'] }
 },
 {
  who: 'kuba',
  text: 'Ping z serwera: stacja milczy. Idę do stacji – zapora!',
  lit: ['F12', 'F13'],
  mini: { lit: ['serwer-wan', 'serwer-lan1', 'stacja-lan2'] }
 },
 {
  who: 'kuba',
  text: 'Reguła włączona. Wracam: ping z serwera przechodzi. Ręka!',
  lit: ['U8'],
  bare: ['U8']
 },
 {
  who: 'kuba',
  text: `Na stacji maszyna wirtualna: adres ${VM_IP} wpisany. Tryb karty zostawiam.`,
  lit: ['F14'],
  bare: ['F14'],
  mini: { vm: 'nat' }
 },
 {
  who: 'kuba',
  text: 'Strona www.egzamin.local się nie otwiera 😩 A DNS dobry!',
  lit: ['F15'],
  mini: { vm: 'nat', vmBlink: true }
 },
 {
  who: 'ola',
  text: 'NAT chowa maszynę za stacją. Ustaw mostkowaną, do LAN 2.',
  focus: 'F14',
  blinkTag: 'F14',
  mini: { vm: 'nat' }
 },
 {
  who: 'kuba',
  text: 'Mostkowana… strona działa! Ręka – koniec arkusza.',
  lit: ['U9'],
  bare: ['U9'],
  mini: { vm: 'bridged' }
 }
];

function tourSteps(): Step[] {
 const done: string[] = [];
 return TOUR_9.map((t) => {
  const lit = t.lit ?? [];
  const tags = [...lit.filter((id) => !(t.bare ?? []).includes(id)), ...(t.blinkTag ? [t.blinkTag] : [])];
  const view = page9(
   { lit, done: [...done], tags, focus: t.focus, blinkTag: t.blinkTag },
   t.mini
  );
  done.push(...lit);
  return t.who === 'ola' ? ola(t.text, view) : kuba(t.text, view);
 });
}
const ALL_LIT_9 = TOUR_9.flatMap((t) => t.lit ?? []);

const NOTES_9: Note[] = [
 {
  q: 'Dlaczego zakreślacz skacze po stronie?',
  a: 'Bo idzie w kolejności pracy, a arkusz jest ułożony w kolejności oceniania (warstwa 7).'
 },
 {
  q: 'A zadanie 1?',
  a: 'To gniazdo i panel krosowy, sprawdzane testerem – dlatego strona zaczyna się od zadania 2.'
 },
 {
  q: 'Co robi karta mostkowana?',
  a: `Podłącza maszynę wirtualną do tej samej sieci, w której jest karta LAN 2 stacji. Maszyna ma wtedy własny adres z niebieskiej sieci: ${VM_IP}.`
 },
 {
  q: 'A NAT?',
  a: `Przy NAT maszyna jest w osobnej, wirtualnej sieci programu. Nawet z adresem ${VM_IP} nie dosięgnie serwera. Tryb karty to jej kabel: mostkowana = kabel do przełącznika.`
 },
 {
  q: 'Którą kartę wybrać przy mostkowanej?',
  a: 'Program pokazuje kartę stacji pod nazwą sprzętu (np. „Intel(R) Ethernet…”), nie „LAN 2”. Nazwę sprzętu karty LAN 2 zobaczysz w Połączeniach sieciowych.'
 },
 {
  q: `Dlaczego DNS maszyny to ${STATION_DNS_9}?`,
  a: 'To serwer – on zna nazwę www.egzamin.local (warstwa 4).'
 },
 {
  q: 'Czemu zadanie 5 jest szare?',
  a: 'Identyfikacja podzespołów w Linuksie nie dotyczy sieci.'
 },
 {
  q: 'Skąd tekst arkusza?',
  a: 'Arkusz CKE ze stycznia 2025, co do słowa. Pominięte fragmenty spoza sieci są oznaczone „…”.'
 }
];

const ETAP_9: Exercise = {
 code: '9',
 title: 'Cały arkusz',
 style: 'dialog',
 speakers: SPEAKERS,
 notes: NOTES_9,
 steps: [
  ...tourSteps(),
  quiz(
   `Maszyna ma ${VM_IP}, karta w NAT. Serwer ją widzi?`,
   page9({ done: ALL_LIT_9 }, { vm: 'nat' }),
   [
    ['A) Tak.', 'Adres to nie wszystko. NAT chowa maszynę za stacją.', false],
    ['B) Nie.', 'Właśnie tak – dopiero mostkowana wpina ją do niebieskiej sieci.', true]
   ]
  ),
  // Ćwiczenie: strona bez zakreśleń i plakietek, mały schemat bez ramki „maszyna”.
  task(
   'Kliknij obramowaną linijkę i wybierz zakładkę, która ją wyjaśnia.',
   page9({
    task: {
     kind: 'tags',
     lines: ['F1', 'F7', 'F9', 'F10', 'F11', 'F13'],
     options: [T1, T2, T3, T4, T5, T6, T7, T8],
     wrong: 'Haczyk: {pułapka}. Wyjaśnia to zakładka »{zakładka}«.',
     done: '✓ Wszystkie linijki rozpoznane.'
    }
   })
  ),
  task('Co robisz wcześniej?', page9({}), [
   {
    text: 'A) Adres przełącznika (zadanie 3).',
    feedback: 'Bez adresu stacji nie otworzysz panelu przełącznika.'
   },
   { text: 'B) Adres stacji – maska /24 na chwilę (zadanie 6).', correct: true }
  ]),
  task('Jaki tryb karty ustawisz maszynie wirtualnej?', page9({}), [
   { text: 'A) Sieć NAT.', feedback: '»Sieć NAT« to też NAT – maszyna dalej schowana za stacją.' },
   { text: 'B) Mostkowana karta sieciowa (bridged).', correct: true }
  ]),
  task(
   'Wybierz zakładkę – zobacz jej linijki w całym arkuszu.',
   page9({
    task: {
     kind: 'filter',
     options: [T1, T2, T3, T4, T5, T6, T7, T8, T9],
     schemaTab: T1,
     schemaNote: 'Ta zakładka czyta schemat, nie linijki.'
    }
   }),
   undefined,
   { end: '↺ Od początku', restart: true }
  )
 ]
};

// --- Wiersz „gdzie jest Kuba” (PYT-102a, PYT-104a) ---
// Pozycje z kolumny „Kuba (pod)” scenariuszy (test co do kroku). `undefined` – Kuba czyta arkusz
// albo rozmawia, sylwetki nie ma. W ćwiczeniach „uczeń sam” wiersza nie ma.

type KubaAt = Scene['kuba'];
const times = (n: number, at: KubaAt): KubaAt[] => Array.from({ length: n }, () => at);
const KUBA_3: KubaAt[] = [...times(5, undefined), ...times(12, 'serwer'), undefined];
const KUBA_4: KubaAt[] = [...times(3, undefined), ...times(6, 'stacja'), ...times(7, undefined)];
const KUBA_6: KubaAt[] = [...times(17, 'stacja'), undefined];
const KUBA_7: KubaAt[] = [
 ...times(4, undefined),
 ...times(2, 'ruter'),
 'przelacznik',
 ...times(4, 'serwer'),
 'ruter',
 ...times(7, 'serwer'),
 undefined
];
const KUBA_9: KubaAt[] = [
 ...times(2, undefined),
 ...times(6, 'serwer'),
 ...times(2, 'stacja'),
 ...times(4, 'serwer'),
 ...times(4, 'stacja'),
 undefined
];
const KUBA_8: KubaAt[] = [
 ...times(3, undefined),
 ...times(7, 'serwer'),
 'stacja',
 ...times(2, 'serwer'),
 ...times(4, 'stacja'),
 ...times(2, 'serwer'),
 undefined
];
const KUBA_5: KubaAt[] = [
 ...times(4, undefined),
 ...times(4, 'serwer'),
 ...times(10, 'stacja'),
 undefined
];

/** Wstawia pozycje Kuby do kroków sceny; ćwiczeniom „uczeń sam” zdejmuje wiersz. */
function withKuba(exercise: Exercise, plan: readonly KubaAt[]): Exercise {
 let scene = 0;
 return {
  ...exercise,
  steps: exercise.steps.map((step) => {
   if (step.view.type !== 'sheet') return step;
   if (step.speaker === 'task')
    return { ...step, view: { ...step.view, kubaRow: false, kuba: undefined } };
   const kuba = plan[scene++];
   return { ...step, view: { ...step.view, kubaRow: true, kuba } };
  })
 };
}

export const ARKUSZ: Course = {
 id: 'arkusz',
 title: 'Etapy ścieżki „Arkusz krok po kroku”',
 exercises: [
  ETAP_1,
  ETAP_2,
  withKuba(ETAP_3, KUBA_3),
  withKuba(ETAP_4, KUBA_4),
  withKuba(ETAP_5, KUBA_5),
  withKuba(ETAP_6, KUBA_6),
  withKuba(ETAP_7, KUBA_7),
  withKuba(ETAP_8, KUBA_8),
  withKuba(ETAP_9, KUBA_9)
 ]
};

/** Pod ćwiczeniami obu etapów: oryginalny schemat z arkusza, poglądowo (prośba operatora). */
export const ARKUSZ_FIGURE: Figure = {
 src: sheetDrawing,
 alt: 'Schemat sieci z arkusza: Ruter (port LAN) – Serwer (karty WAN i LAN 1) – Przełącznik (porty 1 i 3) – Stacja robocza (LAN 2)',
 caption: 'Tak ten schemat wygląda w arkuszu INF.02 (styczeń 2025, strona 3) – poglądowo.'
};
