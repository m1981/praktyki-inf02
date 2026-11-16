// Treść Trybu swobodnego maski: gotowe przykłady z lekcjami oraz układ diagramu.

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
 pins: PINS
};
