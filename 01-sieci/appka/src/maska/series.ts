// Seria mikro-ćwiczeń M1–M4 (audyt.md, rozdz. 4–5): każde ćwiczenie = jedno pytanie, jedno nowe
// pojęcie, jeden element sterujący, jeden ekran. Ostatnia zakładka to „Tryb swobodny” (PYT-002a).
// DLACZEGO DANE, A NIE KOMPONENTY: teksty i stany kroków są w jednym miejscu, test pilnuje limitu
// słów i tego, że każda ramka idzie po istniejącym kablu.

import { BROADCAST_MAC, type Cable, type Device, type DiagramState } from '../sim/types';
import { devicesFor, CABLES, HOSTS, toDiagram, type HostId } from './network';
import { formatIp } from './ipMath';

export type Visual =
 /** M1: porównanie numerów sieci; `revealed` = ile adresów (poza Laptopem) już odsłonięto. */
 | { kind: 'compare'; revealed: number }
 /** M2: oś adresów z płotami; tylko Laptop i Drukarka. */
 | { kind: 'fence'; prefix: number }
 /** M3–M4: diagram sieci. */
 | { kind: 'diagram'; devices: Device[]; cables: Cable[]; state: DiagramState };

export interface SeriesStep {
 text: string;
 /** Pasek „Zmiana”: tylko to, co zmieniło się w tym kroku. */
 change: string;
 visual: Visual;
 /** Napis na przycisku (ćwiczenia z przyciskiem) albo w przełączniku (ćwiczenia z przełącznikiem). */
 control: string;
}

export interface Exercise {
 code: string;
 title: string;
 question: string;
 /** `next` – jeden przycisk „Dalej”; `toggle` – przełącznik, każdy krok to jedna pozycja. */
 controlKind: 'next' | 'toggle';
 steps: SeriesStep[];
 /** Pytanie, które ćwiczenie zostawia dla następnego (zasada z plan.md). */
 nextQuestion: string;
}

// --- M1: porównanie numerów sieci ---

export const COMPARE_ROWS: { label: string; ip: string }[] = [
 { label: 'Laptop', ip: formatIp(HOSTS.laptop.ip) },
 { label: 'Serwer NAS', ip: formatIp(HOSTS.nas.ip) },
 { label: 'Drukarka', ip: formatIp(HOSTS.printer.ip) },
 { label: 'Adres w Internecie', ip: '8.8.8.8' }
];

// --- M3: mała topologia – tylko urządzenia z ćwiczenia ---

const M3_CABLES: Cable[] = [
 { id: 'laptop-switch', a: 'laptop', aSide: 'right', b: 'switch', bSide: 'left' },
 { id: 'switch-router', a: 'switch', aSide: 'top', b: 'router', bSide: 'bottom' },
 { id: 'switch-printer', a: 'switch', aSide: 'right', b: 'printer', bSide: 'left' }
];

function m3Devices(prefix: 24 | 25): Device[] {
 const local = prefix === 24;
 return [
  {
   id: 'router',
   kind: 'router',
   label: 'Router (Brama)',
   ip: '10.10.10.1',
   // Router potrzebuje adresu w sieci Drukarki – pokazujemy go bez komentarza (Lab 2: RoaS).
   note: local ? undefined : '+ 10.10.10.129 (sieć Drukarki)',
   position: { x: 300, y: 0 }
  },
  {
   id: 'laptop',
   kind: 'laptop',
   label: 'Laptop',
   ip: `10.10.10.105/${prefix}`,
   note: local ? 'Myśl: .130 – moja sieć → bezpośrednio' : 'Myśl: .130 – inna sieć → do bramy',
   position: { x: 0, y: 210 }
  },
  {
   id: 'switch',
   kind: 'switch',
   label: 'Switch',
   note: 'Nie zna masek – czyta MAC',
   position: { x: 300, y: 210 }
  },
  {
   id: 'printer',
   kind: 'printer',
   label: 'Drukarka',
   ip: `10.10.10.130/${prefix}`,
   position: { x: 600, y: 210 }
  }
 ];
}

function m3State(prefix: 24 | 25): DiagramState {
 // Ta sama decyzja co w Trybie swobodnym – bez tła kart (audyt: trzeci kod wizualny był zbędny).
 const { roles, flows } = toDiagram({ prefix, target: 'printer', trap: false, phase: 'there' });
 return { roles, flows };
}

// --- M4: Broadcast dociera do wszystkich, bez względu na maskę ---

const M4_NOTES: Partial<Record<HostId | 'router' | 'switch', string>> = {
 laptop: 'Działka .0–.127',
 nas: 'Na działce Laptopa',
 printer: 'Za płotem',
 camera: 'Za płotem',
 switch: 'Nie zna masek – czyta MAC'
};

function m4Devices(): Device[] {
 return devicesFor({ prefix: 25, target: 'nas', trap: false, phase: 'there' }).map((d) => ({
  ...d,
  note: M4_NOTES[d.id as keyof typeof M4_NOTES]
 }));
}

const M4_BROADCAST: DiagramState = {
 frame: {
  name: 'ARP Request',
  srcMac: 'AA:BB:CC:00:01:05',
  dstMac: BROADCAST_MAC,
  payload: 'Kto ma 10.10.10.30?'
 },
 roles: {
  laptop: 'sends',
  switch: 'forwards',
  router: 'receives',
  nas: 'receives',
  printer: 'receives',
  camera: 'receives'
 },
 flows: [
  { from: 'laptop', to: 'switch', hop: 0, label: 'ARP Request' },
  ...(['router', 'nas', 'printer', 'camera'] as const).map((to) => ({
   from: 'switch',
   to,
   hop: 1,
   label: 'kopia'
  }))
 ]
};

// --- Seria ---

export const EXERCISES: Exercise[] = [
 {
  code: 'M1',
  title: 'Moja sieć czy inna?',
  question: 'Laptop ma adres 10.10.10.105/24. Które adresy są w jego sieci?',
  controlKind: 'next',
  steps: [
   {
    text:
     'Maska /24: pierwsze 24 bity, czyli pierwsze 3 liczby adresu, to numer sieci. Laptop: 10.10.10. Serwer NAS: 10.10.10. Ten sam numer, więc Serwer NAS jest w sieci Laptopa.',
    change: 'nowy wiersz: Serwer NAS – ta sama sieć',
    visual: { kind: 'compare', revealed: 1 },
    control: 'Pokaż następny adres →'
   },
   {
    text:
     'Drukarka 10.10.10.130: numer sieci 10.10.10 – taki sam. Drukarka jest w sieci Laptopa. Laptop wyśle do niej ramkę bezpośrednio, przez Switch.',
    change: 'nowy wiersz: Drukarka – ta sama sieć',
    visual: { kind: 'compare', revealed: 2 },
    control: 'Pokaż następny adres →'
   },
   {
    text:
     'Adres 8.8.8.8: numer sieci 8.8.8 – inny. To inna sieć. Laptop nie wyśle ramki prosto do 8.8.8.8. Jak to zrobi, zobaczysz w M3.',
    change: 'nowy wiersz: 8.8.8.8 – inna sieć',
    visual: { kind: 'compare', revealed: 3 },
    control: 'Pokaż następny adres →'
   }
  ],
  nextQuestion: 'Czy płot może stanąć wewnątrz sieci 10.10.10.0?'
 },
 {
  code: 'M2',
  title: 'Płot na ulicy',
  question: 'Przełącz maskę na /25. Czy Drukarka .130 jest w sieci Laptopa?',
  controlKind: 'toggle',
  steps: [
   {
    text:
     'Maska /24: jedna sieć .0–.255, bez płotów. Laptop .105 i Drukarka .130 są w tej samej sieci.',
    change: 'brak płotów: jedna działka .0–.255',
    visual: { kind: 'fence', prefix: 24 },
    control: '/24'
   },
   {
    text:
     'Maska /25 dzieli adresy .0–.255 na dwie sieci po 128 adresów. Płot stoi na .128. Laptop .105 jest przed płotem, Drukarka .130 za płotem. To dwie różne sieci.',
    change: 'płot wyrasta na .128',
    visual: { kind: 'fence', prefix: 25 },
    control: '/25'
   }
  ],
  nextQuestion: 'Ten sam Switch. Jak Laptop wyśle plik do Drukarki?'
 },
 {
  code: 'M3',
  title: 'Objazd przez Router',
  question: 'Maska /25. Którą drogą pójdzie ramka z Laptopa do Drukarki?',
  controlKind: 'toggle',
  steps: [
   {
    text:
     'Maska /24: Drukarka .130 jest w sieci Laptopa. Laptop wysyła ramkę bezpośrednio, przez sam Switch. Router (Brama) nie bierze udziału.',
    change: 'droga: Laptop → Switch → Drukarka',
    visual: { kind: 'diagram', devices: m3Devices(24), cables: M3_CABLES, state: m3State(24) },
    control: '/24'
   },
   {
    text:
     'Laptop liczy swoją maską /25: Drukarka .130 jest w innej sieci. Laptop wysyła więc ramkę do Routera (Brama), a Router przekazuje ją Drukarce. Ten sam Switch i te same kable – inna droga.',
    change: 'droga: Laptop → Switch → Router → Switch → Drukarka',
    visual: { kind: 'diagram', devices: m3Devices(25), cables: M3_CABLES, state: m3State(25) },
    control: '/25'
   }
  ],
  nextQuestion: 'Czy maska /25 zatrzyma Broadcast przed Drukarką?'
 },
 {
  code: 'M4',
  title: 'Maska to nie ściana',
  question: 'Maska /25. Czy Drukarka .130 dostanie ARP Request od Laptopa?',
  controlKind: 'next',
  steps: [
   {
    text:
     'Laptop wysyła ARP Request: „Kto ma 10.10.10.30?”. Przy masce /25 Drukarka .130 i Kamera .200 są za płotem. Kliknij i sprawdź, kto dostanie ramkę.',
    change: 'nic jeszcze nie płynie',
    visual: {
     kind: 'diagram',
     devices: m4Devices(),
     cables: CABLES,
     state: { roles: {}, flows: [] }
    },
    control: 'Wyślij ARP Request →'
   },
   {
    text:
     'Tak – Drukarka, Kamera i Router też. Switch nie zna masek, czyta tylko adresy MAC. Broadcast dostaje każde urządzenie podłączone do tego Switcha. Maska to reguła nadawcy, nie ściana w kablu.',
    change: 'kopie Broadcastu docierają do wszystkich 4 urządzeń',
    visual: { kind: 'diagram', devices: m4Devices(), cables: CABLES, state: M4_BROADCAST },
    control: 'Wyślij ARP Request →'
   }
  ],
  nextQuestion:
   'Sieci naprawdę rozdziela Router. Co Router zmienia w ramce, gdy przekazuje ją dalej? (scenariusz 2 – w przygotowaniu)'
 }
];

/** Indeks zakładki „Tryb swobodny” (po ostatnim ćwiczeniu). */
export const FREE_MODE = EXERCISES.length;

// --- Stan serii (reducer) ---

export interface SeriesState {
 ex: number;
 step: number;
}

export type SeriesAction =
 | { type: 'NEXT' }
 | { type: 'PREV' }
 | { type: 'GOTO'; ex: number }
 | { type: 'SET_STEP'; step: number };

export function seriesReducer(state: SeriesState, action: SeriesAction): SeriesState {
 const last = (ex: number) => EXERCISES[ex].steps.length - 1;
 switch (action.type) {
  case 'NEXT':
   if (state.ex === FREE_MODE) return state;
   if (state.step < last(state.ex)) return { ...state, step: state.step + 1 };
   return { ex: state.ex + 1, step: 0 };
  case 'PREV':
   if (state.ex === FREE_MODE) return { ex: FREE_MODE - 1, step: 0 };
   if (state.step > 0) return { ...state, step: state.step - 1 };
   return state.ex > 0 ? { ex: state.ex - 1, step: 0 } : state;
  case 'GOTO':
   return { ex: Math.min(Math.max(action.ex, 0), FREE_MODE), step: 0 };
  case 'SET_STEP':
   return state.ex === FREE_MODE ? state : { ...state, step: action.step };
 }
}

/** Adres w pasku (#m1 … #m4, #swobodny) – nauczyciel może podać link do konkretnego ćwiczenia. */
export function hashOf(ex: number): string {
 return ex === FREE_MODE ? '#swobodny' : `#${EXERCISES[ex].code.toLowerCase()}`;
}

export function exFromHash(hash: string): number {
 if (hash === '#swobodny') return FREE_MODE;
 const i = EXERCISES.findIndex((e) => `#${e.code.toLowerCase()}` === hash);
 return i >= 0 ? i : 0;
}
