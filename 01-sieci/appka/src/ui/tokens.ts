// Kolory znaczeń potrzebne także w JavaScripcie (groty strzałek SVG nie czytają zmiennych CSS).
// To jedyne miejsce z tymi kolorami: `LessonShell` przekazuje je do CSS jako `--c-broadcast`
// i `--c-unicast`. Wymiary układu są w `tokens.css`.

import type { CSSProperties } from 'react';

export type PacketKind = 'broadcast' | 'unicast';

/** Pomarańczowy znaczy TYLKO Broadcast, zielony – Unicast (audyt.md, rozdz. 6). */
export const PACKET_COLORS: Record<PacketKind, string> = {
 broadcast: '#e67e22',
 unicast: '#00b894'
};

/** Zmienne CSS z kolorami ramek – do atrybutu `style` korzenia ekranu. */
export const COLOR_VARS = {
 '--c-broadcast': PACKET_COLORS.broadcast,
 '--c-unicast': PACKET_COLORS.unicast
} as CSSProperties;
