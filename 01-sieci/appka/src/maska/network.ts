// Model sieci dla wizualizacji maski i decyzja nadawcy.
// DLACZEGO CZYSTE FUNKCJE: decyzja „bezpośrednio czy przez bramę” to sedno lekcji. Liczymy ją
// jedną funkcją (`decide`), z której korzystają diagram, tabela i testy – nie ma dwóch prawd.

import { genitiveOf, nameOf } from '../model/glossary';
import { device, deviceIp, LINKS, ZONES, type DeviceId } from '../model/siec';
import { decideRoute, type Outcome, type RouteDecision } from '../net/decide';
import { formatIp, networkOf, sameNetwork, type Ip } from '../net/ipMath';
import { framePath } from '../net/path';
import { cable } from '../sim/graph';
import type { Cable, Device, DeviceKind, DeviceTone, DiagramState, Flow } from '../sim/types';

export type { Outcome };
export type HostId = Exclude<DeviceId, 'router' | 'switch'>;
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

/** Brama wszystkich urządzeń i jedyne urządzenie łączące podsieci. */
export const GATEWAY: DeviceId = 'router';

// --- Układ diagramu: Router u góry, Switch pośrodku, urządzenia w rzędzie na dole ---

const POSITIONS: Record<DeviceId, { x: number; y: number }> = {
 router: { x: 300, y: 0 },
 switch: { x: 300, y: 230 },
 laptop: { x: 0, y: 230 },
 nas: { x: 0, y: 480 },
 printer: { x: 260, y: 480 },
 camera: { x: 520, y: 480 }
};

const toLabel = (id: DeviceId) => `do ${genitiveOf(id)}`;

function host(id: HostId): Host {
 return {
  id,
  kind: device(id).kind,
  label: nameOf(id),
  toLabel: toLabel(id),
  ip: deviceIp(id),
  position: POSITIONS[id]
 };
}

export const HOSTS: Record<HostId, Host> = {
 laptop: host('laptop'),
 nas: host('nas'),
 printer: host('printer'),
 camera: host('camera')
};

export const TARGETS: HostId[] = ['nas', 'printer', 'camera'];
export const ROUTER_IP = deviceIp(GATEWAY);
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
 return host === 'laptop' ? ROUTER_IP : routerIpIn(HOSTS[host].ip, prefix);
}

/** Adres Routera w podsieci, do której należy `ip`: pierwszy adres hosta. */
export function routerIpIn(ip: Ip, prefix: number): Ip {
 return networkOf(ip, prefix) + 1;
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

export interface Decision extends RouteDecision {
 src: HostId;
 dst: HostId;
}

/** Decyzja nadawcy: wysłać bezpośrednio, przez bramę, czy nie da się wysłać wcale. */
export function decide(src: HostId, dst: HostId, s: MaskSettings): Decision {
 const prefix = prefixOf(src, s);
 const config = { ip: HOSTS[src].ip, prefix, gateway: gatewayOf(src, prefix) };
 return { src, dst, ...decideRoute(config, HOSTS[dst].ip) };
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
 cable('laptop', 'right', 'switch', 'left'),
 cable('switch', 'top', 'router', 'bottom'),
 cable('switch', 'bottom', 'nas', 'top'),
 cable('switch', 'bottom', 'printer', 'top'),
 cable('switch', 'bottom', 'camera', 'top')
];

/** Stopka karty Switcha w widokach maski. */
export const SWITCH_NOTE = 'Nie zna masek – czyta MAC';

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
   id: GATEWAY,
   kind: device(GATEWAY).kind,
   label: nameOf(GATEWAY),
   ip: formatIp(ROUTER_IP),
   // Uproszczenie: Router ma adres w każdej podsieci (jak Router-on-a-Stick w Lab 2).
   note: '+ adres w każdej podsieci',
   position: POSITIONS[GATEWAY]
  },
  {
   id: 'switch',
   kind: device('switch').kind,
   label: nameOf('switch'),
   note: SWITCH_NOTE,
   position: POSITIONS.switch
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

 if (decision.outcome === 'gateway-outside')
  return { roles: { [src]: 'blocked' }, flows: [], tones };

 // Objazd: ta sama ramka-dane, ale pierwsza połowa drogi ma MAC Routera jako odbiorcę.
 const via = decision.outcome === 'via-router' ? GATEWAY : undefined;
 const hops = framePath<DeviceId>(LINKS, src, dst, via);
 const flows: Flow[] = hops.map(({ from, to, hop, toward }) => ({
  from,
  to,
  hop,
  label: toLabel(toward)
 }));

 // Każde urządzenie po drodze (Switch, przy objeździe także Router) przekazuje ramkę dalej.
 const roles: DiagramState['roles'] = { [src]: 'sends', [dst]: 'receives' };
 for (const { to } of hops) if (to !== dst) roles[to] = 'forwards';

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
  lesson: `Maska /24: wszystkie urządzenia są w sieci ${ZONES.biuro.net}. Laptop wysyła do Drukarki bezpośrednio, przez sam Switch – tak jak w Symulatorze ARP.`
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
  lesson: `Laptop jest w sieci .64–.127, a jego brama ${formatIp(ROUTER_IP)} leży w sieci .0–.63. Laptop nie ma komu oddać ramki. Naprawa: wpisz na Laptopie bramę z jego sieci – Router ma tam adres ${formatIp(routerIpIn(HOSTS.laptop.ip, 26))}.`
 },
 {
  id: 'trap',
  title: 'Pułapka: różne maski',
  settings: { prefix: 24, target: 'nas', trap: true, phase: 'back' },
  lesson:
   'Tam: Laptop (/24) uważa Serwer NAS za swojego i wysyła bezpośrednio. Z powrotem: Serwer NAS (/26) uważa Laptop za obcego i odpowiada przez Router. Bez bramy odpowiedź by nie wróciła. Kierunek zmienisz w Trybie swobodnym.'
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
