// Ruch w sieci w jednej chwili: kto co robi i którędy płyną ramki. To pojęcia sieciowe, bez
// Reacta – diagram (ui/diagram) tylko je rysuje.

import type { Flow, Frame } from './frame';
import type { Hop } from './path';

/** Co urządzenie robi w danej chwili (etykieta przy karcie urządzenia). */
export type DeviceRole = 'analyzes' | 'sends' | 'receives' | 'forwards' | 'drops' | 'blocked';

/** Urządzenie w sieci nadawcy (`inside`) albo poza nią (`outside`) – według maski nadawcy. */
export type DeviceTone = 'inside' | 'outside';

export interface Traffic {
 roles: Partial<Record<string, DeviceRole>>;
 flows: Flow[];
 /** Broadcast/Unicast wynika z `frame.dstMac`. Bez ramki = Unicast. */
 frame?: Frame;
 tones?: Partial<Record<string, DeviceTone>>;
}

/**
 * Role przy ramce Unicast: nadawca wysyła, cel odbiera, a każde urządzenie po drodze (Switch,
 * przy objeździe także Router) przekazuje ramkę dalej.
 */
export function unicastRoles<Id extends string>(
 hops: readonly Hop<Id>[],
 src: Id,
 dst: Id
): Partial<Record<string, DeviceRole>> {
 const roles: Partial<Record<string, DeviceRole>> = { [src]: 'sends', [dst]: 'receives' };
 for (const { to } of hops) if (to !== dst) roles[to] = 'forwards';
 return roles;
}

/** Role przy ramce Broadcast: kto rozsyła kopie dalej, ten przekazuje; pozostali odbierają. */
export function floodRoles<Id extends string>(
 hops: readonly Hop<Id>[],
 src: Id
): Partial<Record<string, DeviceRole>> {
 const forwarders = new Set(hops.filter((h) => h.from !== src).map((h) => h.from));
 const roles: Partial<Record<string, DeviceRole>> = { [src]: 'sends' };
 for (const { to } of hops) roles[to] = forwarders.has(to) ? 'forwards' : 'receives';
 return roles;
}
