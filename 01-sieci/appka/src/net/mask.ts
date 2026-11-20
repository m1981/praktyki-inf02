// Ćwiczenia z maską: decyzja nadawcy przy zadanych ustawieniach i droga ramki, która z niej wynika.
// DLACZEGO CZYSTE FUNKCJE: decyzja „bezpośrednio czy przez bramę” to sedno lekcji. Liczymy ją
// jedną funkcją (`decide`), z której korzystają diagram, tabela i testy – nie ma dwóch prawd.
// Tu nie ma tekstów dla ucznia ani układu ekranu: te są w `content/`.

import { networkOf, sameNetwork, type Ip } from '../lib/ipv4';
import { deviceIp, LINKS, type DeviceId } from '../model/siec';
import { decideRoute, type Outcome, type RouteDecision } from './decide';
import { framePath, type Hop } from './path';
import { unicastRoles, type DeviceRole, type DeviceTone } from './traffic';

export type { Outcome };
/** Urządzenia końcowe sieci ćwiczebnej (biuro), które biorą udział w ćwiczeniach z maską. */
export type HostId = Extract<DeviceId, 'laptop' | 'nas' | 'printer' | 'camera'>;
export type Phase = 'there' | 'back';

/** Brama wszystkich urządzeń i jedyne urządzenie łączące podsieci. */
export const GATEWAY = 'router' satisfies DeviceId;

/** Urządzenia końcowe biorące udział w ćwiczeniach z maską. */
export const MASK_HOSTS: HostId[] = ['laptop', 'nas', 'printer', 'camera'];
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
 return host === 'laptop' ? ROUTER_IP : routerIpIn(deviceIp(host), prefix);
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
 const config = { ip: deviceIp(src), prefix, gateway: gatewayOf(src, prefix) };
 return { src, dst, ...decideRoute(config, deviceIp(dst)) };
}

/** Kto wysyła w danej fazie: „Tam” = Laptop → cel, „Z powrotem” = cel → Laptop. */
export function endpoints(s: MaskSettings): { src: HostId; dst: HostId } {
 return s.phase === 'there' ? { src: 'laptop', dst: s.target } : { src: s.target, dst: 'laptop' };
}

/** Odpowiedź istnieje tylko wtedy, gdy zapytanie („Tam”) w ogóle wyszło z Laptopa. */
export function requestFailed(s: MaskSettings): boolean {
 return decide('laptop', s.target, s).outcome === 'gateway-outside';
}

/** Skutek decyzji na kablach: role urządzeń, skoki ramki i podział „w sieci / poza siecią”. */
export interface MaskRoute {
 roles: Partial<Record<string, DeviceRole>>;
 /** Skoki ramki; `toward` mówi, do kogo ramka jest adresowana na danym odcinku. */
 hops: Hop<DeviceId>[];
 tones: Partial<Record<string, DeviceTone>>;
}

/** Decyzja → droga ramki po kablach z modelu sieci (warstwa fizyczna się NIE zmienia). */
export function maskRoute(s: MaskSettings): MaskRoute {
 const { src, dst } = endpoints(s);
 const decision = decide(src, dst, s);
 const tones = Object.fromEntries(
  MASK_HOSTS.map((id): [string, DeviceTone] => [
   id,
   sameNetwork(deviceIp(id), deviceIp(src), decision.prefix) ? 'inside' : 'outside'
  ])
 );

 if (s.phase === 'back' && requestFailed(s)) return { roles: {}, hops: [], tones };

 if (decision.outcome === 'gateway-outside')
  return { roles: { [src]: 'blocked' }, hops: [], tones };

 // Objazd: ta sama ramka-dane, ale pierwsza połowa drogi ma MAC Routera jako odbiorcę.
 const via = decision.outcome === 'via-router' ? GATEWAY : undefined;
 const hops = framePath<DeviceId>(LINKS, src, dst, via);
 return { roles: unicastRoles(hops, src, dst), hops, tones };
}
