// Typy diagramu. Diagram nie wie nic o ARP ani o maskach – dostaje tylko karty urządzeń, kable
// i ruch w sieci (`Traffic`: kto co robi, jakie ramki płyną).

import type { DeviceKind } from '../../model/siec';
import type { Flow, Frame } from '../../net/frame';
import type { DeviceRole, DeviceTone, Traffic } from '../../net/traffic';

export type { DeviceKind, DeviceRole, DeviceTone, Flow, Frame };
export type Side = 'top' | 'right' | 'bottom' | 'left';

/** Stan diagramu = ruch w sieci w jednej chwili. */
export type DiagramState = Traffic;

/** Karta urządzenia na diagramie: co pokazać i gdzie. */
export interface Device {
 id: string;
 kind: DeviceKind;
 label: string;
 ip?: string;
 mac?: string;
 /** Stopka karty (np. brama albo uwaga o Switchu). */
 note?: string;
 /** Nazwy portów widoczne na karcie (tylko Switch). */
 ports?: Partial<Record<Side, string>>;
 position: { x: number; y: number };
}

/** Fizyczny kabel. Kierunek a → b nie ma znaczenia dla ruchu – liczy się `Flow.from`. */
export interface Cable {
 id: string;
 a: string;
 aSide: Side;
 b: string;
 bSide: Side;
}
