// Treść Trybu swobodnego maski: gotowe przykłady z lekcjami, zdania paneli i układ diagramu.
// Pola w klamrach (np. `{dst}`) wypełnia kod; `**tekst**` oznacza pogrubienie.

import { formatIp } from '../lib/ipv4';
import { deviceIp, ZONES } from '../model/siec';
import { ROUTER_IP, routerIpIn } from '../net/mask';
import type { Preset } from '../ui/free/maskState';
import type { MaskExplorerContent } from '../ui/free/MaskExplorer';
import { CABLES, devicesFor, maskDiagram, PINS } from './maska-uklad';

// --- Gotowe przykłady (każdy to jedna lekcja) ---

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
  lesson: `Laptop jest w sieci .64–.127, a jego brama ${formatIp(ROUTER_IP)} leży w sieci .0–.63. Laptop nie ma komu oddać ramki. Naprawa: wpisz na Laptopie bramę z jego sieci – Router ma tam adres ${formatIp(routerIpIn(deviceIp('laptop'), 26))}.`
 },
 {
  id: 'trap',
  title: 'Pułapka: różne maski',
  settings: { prefix: 24, target: 'nas', trap: true, phase: 'back' },
  lesson:
   'Tam: Laptop (/24) uważa Serwer NAS za swojego i wysyła bezpośrednio. Z powrotem: Serwer NAS (/26) uważa Laptop za obcego i odpowiada przez Router. Bez bramy odpowiedź by nie wróciła. Kierunek zmienisz w Trybie swobodnym.'
 }
];

export const FREE_MODE: MaskExplorerContent = {
 presets: PRESETS,
 devicesFor,
 cables: CABLES,
 diagram: maskDiagram,
 pins: PINS,

 freeHint: 'Tryb swobodny: zmieniasz ustawienia ręcznie. Kliknij przykład, żeby wrócić do lekcji.',

 physicalNote:
  '🔌 **Warstwa fizyczna się nie zmienia:** wszystkie urządzenia wiszą na jednym Switchu, a ramka Broadcast (np. ARP) nadal dociera do każdego. Maska nie stawia ściany w kablu – zmienia tylko **decyzję nadawcy**: wysłać bezpośrednio czy przez bramę.',

 // Panel „Decyzja nadawcy”: zdania wypowiada nadawca. {dst} = cel, {gateway} = brama, {src} = nadawca.
 decision: {
  verdict: {
   direct: '{dst} jest w mojej sieci → wysyłam ramkę bezpośrednio, przez sam Switch.',
   'via-router':
    '{dst} jest poza moją siecią → oddaję ramkę bramie (Routerowi). Oba urządzenia wiszą na tym samym Switchu, a mimo to ramka robi objazd.',
   'gateway-outside':
    '{dst} jest poza moją siecią, a moja brama {gateway} też jest poza nią → nie mam komu oddać ramki. Nic nie wychodzi z karty sieciowej.'
  },
  noReply:
   'Brak odpowiedzi: zapytanie w ogóle nie wyszło z Laptopa (zobacz kierunek „Tam”). Pokazujemy tylko, co zrobiłby {src}.'
 },

 // Panel „Bity”. {shared} = trzy pierwsze oktety, {mask} = maska dziesiętnie, {bit} = numer bitu.
 bits: {
  intro:
   'Pierwsze 3 oktety ({shared}) są takie same u wszystkich i w całości należą do sieci. Pokazujemy tylko ostatni oktet. Maska **{mask}**: jedynki = bity sieci (kolorowe), zera = bity hosta (szare).',
  noNetBits:
   'Maska /24 nie zabiera żadnego bitu z ostatniego oktetu. Liczą się tylko pierwsze 3 oktety ({shared}), a te są takie same → ta sama sieć.',
  different: 'Bit nr {bit} ostatniego oktetu jest różny (czerwony) → różne sieci.',
  same: 'Wszystkie {count} {bits} sieci w ostatnim oktecie są takie same → ta sama sieć.',
  bitForms: ['bit', 'bity', 'bitów']
 }
};
