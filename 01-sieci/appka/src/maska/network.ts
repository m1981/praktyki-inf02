// Model sieci dla wizualizacji maski i decyzja nadawcy.
// DLACZEGO CZYSTE FUNKCJE: decyzja „bezpośrednio czy przez bramę” to sedno lekcji. Liczymy ją
// jedną funkcją (`decide`), z której korzystają diagram, tabela i testy – nie ma dwóch prawd.

import type { Cable, Device, DeviceKind, DeviceTone, DiagramState, Flow } from '../sim/types';
import { formatIp, networkOf, parseIp, sameNetwork, type Ip } from './ipMath';

export type HostId = 'laptop' | 'nas' | 'printer' | 'camera';
export type Phase = 'there' | 'back';

interface Host {
 id: HostId;
 kind: DeviceKind;
 label: string;
 /** Dopełniacz do etykiet ramek: „do Drukarki”. */
 toLabel: string;
 ip: Ip;
 position: { x: number; y: number };
}

export const HOSTS: Record<HostId, Host> = {
 laptop: {
  id: 'laptop',
  kind: 'laptop',
  label: 'Laptop',
  toLabel: 'do Laptopa',
  ip: parseIp('10.10.10.105'),
  position: { x: 0, y: 230 }
 },
 nas: {
  id: 'nas',
  kind: 'nas',
  label: 'Serwer NAS',
  toLabel: 'do Serwera NAS',
  ip: parseIp('10.10.10.30'),
  position: { x: 0, y: 480 }
 },
 printer: {
  id: 'printer',
  kind: 'printer',
  label: 'Drukarka',
  toLabel: 'do Drukarki',
  ip: parseIp('10.10.10.130'),
  position: { x: 260, y: 480 }
 },
 camera: {
  id: 'camera',
  kind: 'camera',
  label: 'Kamera',
  toLabel: 'do Kamery',
  ip: parseIp('10.10.10.200'),
  position: { x: 520, y: 480 }
 }
};

export const TARGETS: HostId[] = ['nas', 'printer', 'camera'];
export const ROUTER_IP = parseIp('10.10.10.1');
export const MIN_PREFIX = 24;
export const MAX_PREFIX = 30;
/** Maska wpisana „przez pomyłkę” na Serwerze NAS w pułapce. */
export const TRAP_PREFIX = 26;

/**
 * Brama Laptopa została wpisana dawno temu, przy masce /24, i NIE zmienia się razem z maską.
 * Na tym polega lekcja „brama za płotem” (/26). Pozostałe urządzenia mają bramę poprawną:
 * adres Routera w ich własnej podsieci (pierwszy adres hosta).
 */
export function gatewayOf(host: HostId, prefix: number): Ip {
 return host === 'laptop' ? ROUTER_IP : networkOf(HOSTS[host].ip, prefix) + 1;
}

export interface MaskSettings {
 prefix: number;
 target: HostId;
 trap: boolean;
 phase: Phase;
}

export function prefixOf(host: HostId, s: MaskSettings): number {
 return host === 'nas' && s.trap ? TRAP_PREFIX : s.prefix;
}

export type Outcome = 'direct' | 'via-router' | 'gateway-outside';

export interface Decision {
 src: HostId;
 dst: HostId;
 /** Maska NADAWCY – tylko jej używa nadawca, także do liczenia sieci celu. */
 prefix: number;
 srcNet: Ip;
 dstNet: Ip;
 gateway: Ip;
 gatewayInside: boolean;
 outcome: Outcome;
}

/** Decyzja nadawcy: wysłać bezpośrednio, przez bramę, czy nie da się wysłać wcale. */
export function decide(src: HostId, dst: HostId, s: MaskSettings): Decision {
 const prefix = prefixOf(src, s);
 const srcIp = HOSTS[src].ip;
 const gateway = gatewayOf(src, prefix);
 const gatewayInside = sameNetwork(gateway, srcIp, prefix);
 const local = sameNetwork(HOSTS[dst].ip, srcIp, prefix);
 return {
  src,
  dst,
  prefix,
  srcNet: networkOf(srcIp, prefix),
  dstNet: networkOf(HOSTS[dst].ip, prefix),
  gateway,
  gatewayInside,
  outcome: local ? 'direct' : gatewayInside ? 'via-router' : 'gateway-outside'
 };
}

/** Kto wysyła w danej fazie: „Tam” = Laptop → cel, „Z powrotem” = cel → Laptop. */
export function endpoints(s: MaskSettings): { src: HostId; dst: HostId } {
 return s.phase === 'there' ? { src: 'laptop', dst: s.target } : { src: s.target, dst: 'laptop' };
}

/** Odpowiedź istnieje tylko wtedy, gdy zapytanie („Tam”) w ogóle wyszło z Laptopa. */
export function requestFailed(s: MaskSettings): boolean {
 return decide('laptop', s.target, s).outcome === 'gateway-outside';
}

// --- Topologia: jedna gwiazda wokół Switcha (warstwa fizyczna się NIE zmienia) ---

export const CABLES: Cable[] = [
 { id: 'laptop-switch', a: 'laptop', aSide: 'right', b: 'switch', bSide: 'left' },
 { id: 'switch-router', a: 'switch', aSide: 'top', b: 'router', bSide: 'bottom' },
 { id: 'switch-nas', a: 'switch', aSide: 'bottom', b: 'nas', bSide: 'top' },
 { id: 'switch-printer', a: 'switch', aSide: 'bottom', b: 'printer', bSide: 'top' },
 { id: 'switch-camera', a: 'switch', aSide: 'bottom', b: 'camera', bSide: 'top' }
];

/** Karty urządzeń z adresami i bramami dla bieżących ustawień. */
export function devicesFor(s: MaskSettings): Device[] {
 const hosts = Object.values(HOSTS).map((h) => {
  const prefix = prefixOf(h.id, s);
  return {
   id: h.id,
   kind: h.kind,
   label: h.label,
   ip: `${formatIp(h.ip)}/${prefix}`,
   note: `Brama: ${formatIp(gatewayOf(h.id, prefix))}`,
   position: h.position
  };
 });
 return [
  {
   id: 'router',
   kind: 'router',
   label: 'Router (Brama)',
   ip: formatIp(ROUTER_IP),
   // Uproszczenie: Router ma adres w każdej podsieci (jak Router-on-a-Stick w Lab 2).
   note: '+ adres w każdej podsieci',
   position: { x: 300, y: 0 }
  },
  {
   id: 'switch',
   kind: 'switch',
   label: 'Switch',
   note: 'Nie zna masek – czyta MAC',
   position: { x: 300, y: 230 }
  },
  ...hosts
 ];
}

/** Decyzja → stan diagramu (role, droga ramki, tło kart). */
export function toDiagram(s: MaskSettings): DiagramState {
 const { src, dst } = endpoints(s);
 const decision = decide(src, dst, s);
 const tones = Object.fromEntries(
  Object.values(HOSTS).map((h): [string, DeviceTone] => [
   h.id,
   sameNetwork(h.ip, HOSTS[src].ip, decision.prefix) ? 'inside' : 'outside'
  ])
 );

 if (s.phase === 'back' && requestFailed(s)) return { roles: {}, flows: [], tones };

 const toDst = HOSTS[dst].toLabel;
 let flows: Flow[] = [];
 if (decision.outcome === 'direct') {
  flows = [
   { from: src, to: 'switch', hop: 0, label: toDst },
   { from: 'switch', to: dst, hop: 1, label: toDst }
  ];
 } else if (decision.outcome === 'via-router') {
  // Objazd: ta sama ramka-dane, ale pierwsza połowa drogi ma MAC Routera jako odbiorcę.
  flows = [
   { from: src, to: 'switch', hop: 0, label: 'do Routera' },
   { from: 'switch', to: 'router', hop: 1, label: 'do Routera' },
   { from: 'router', to: 'switch', hop: 2, label: toDst },
   { from: 'switch', to: dst, hop: 3, label: toDst }
  ];
 }

 const roles: DiagramState['roles'] =
  decision.outcome === 'gateway-outside'
   ? { [src]: 'blocked' }
   : {
      [src]: 'sends',
      switch: 'forwards',
      [dst]: 'receives',
      ...(decision.outcome === 'via-router' ? { router: 'forwards' as const } : {})
     };

 return { roles, flows, tones };
}

// --- Gotowe przykłady (każdy to jedna lekcja) ---

export interface Preset {
 id: string;
 title: string;
 settings: MaskSettings;
 lesson: string;
}

export const PRESETS: Preset[] = [
 {
  id: 'p24',
  title: '/24: jedna sieć',
  settings: { prefix: 24, target: 'printer', trap: false, phase: 'there' },
  lesson:
   'Maska /24: wszystkie urządzenia są w sieci 10.10.10.0. Laptop wysyła do Drukarki bezpośrednio, przez sam Switch – tak jak w Symulatorze ARP.'
 },
 {
  id: 'p25',
  title: '/25: płot na .128',
  settings: { prefix: 25, target: 'printer', trap: false, phase: 'there' },
  lesson:
   'Ten sam Switch i te same kable, a ramka robi objazd przez Router. Maska /25 postawiła płot na adresie .128: Laptop (.105) jest przed płotem, Drukarka (.130) za płotem – w innej sieci.'
 },
 {
  id: 'p26',
  title: '/26: brama za płotem',
  settings: { prefix: 26, target: 'nas', trap: false, phase: 'there' },
  lesson:
   'Laptop jest w sieci .64–.127, a jego brama 10.10.10.1 leży w sieci .0–.63. Laptop nie może oddać ramki bramie, której nie ma w jego sieci. Windows pokazuje przy takiej konfiguracji ostrzeżenie, Linux odrzuca taką trasę. Naprawa: wpisz na Laptopie bramę z jego sieci – Router ma tam adres 10.10.10.65.'
 },
 {
  id: 'trap',
  title: 'Pułapka: różne maski',
  settings: { prefix: 24, target: 'nas', trap: true, phase: 'back' },
  lesson:
   'Tam: Laptop (/24) uważa Serwer NAS za „swojego” i wysyła bezpośrednio. Z powrotem: Serwer NAS (/26) uważa Laptop za „obcego” i odpowiada przez Router. Ruch krąży różnymi drogami. Gdyby Serwer NAS nie miał bramy, odpowiedź nie wróciłaby wcale – „ping nie odpowiada”, choć kabel jest dobry. Przełącz kierunek na „Tam” i porównaj.'
 }
];

export function matchingPreset(s: MaskSettings): Preset | undefined {
 return PRESETS.find(
  (p) =>
   p.settings.prefix === s.prefix &&
   p.settings.target === s.target &&
   p.settings.trap === s.trap &&
   p.settings.phase === s.phase
 );
}

// --- Stan (reducer) ---

export interface MaskState extends MaskSettings {
 /** Rośnie przy każdej zmianie – restartuje animację ramek od początku. */
 runId: number;
}

export type MaskAction =
 | { type: 'SET_PREFIX'; prefix: number }
 | { type: 'SET_TARGET'; target: HostId }
 | { type: 'SET_TRAP'; trap: boolean }
 | { type: 'SET_PHASE'; phase: Phase }
 | { type: 'APPLY_PRESET'; settings: MaskSettings };

export const INITIAL_MASK_STATE: MaskState = { ...PRESETS[0].settings, runId: 0 };

export function maskReducer(state: MaskState, action: MaskAction): MaskState {
 const next = { ...state, runId: state.runId + 1 };
 switch (action.type) {
  case 'SET_PREFIX':
   return { ...next, prefix: Math.min(MAX_PREFIX, Math.max(MIN_PREFIX, action.prefix)) };
  case 'SET_TARGET':
   return { ...next, target: action.target };
  case 'SET_TRAP':
   return { ...next, trap: action.trap };
  case 'SET_PHASE':
   return { ...next, phase: action.phase };
  case 'APPLY_PRESET':
   return { ...next, ...action.settings };
 }
}
