// Czyste funkcje: stan diagramu → węzły i krawędzie React Flow.
// DLACZEGO STAN POCHODNY: diagram liczymy z danych, więc nie da się go „rozsynchronizować”
// z opisem kroku ani z decyzją nadawcy.

import { MarkerType, type Edge, type Node } from '@xyflow/react';
import { hasLink, type DeviceId } from '../model/siec';
import { isBroadcast } from '../net/frame';
import type { Cable, Device, DeviceRole, DeviceTone, DiagramState, Flow, Side } from './types';

export type PacketKind = 'broadcast' | 'unicast';

export const PACKET_COLORS: Record<PacketKind, string> = {
 broadcast: '#e67e22',
 unicast: '#00b894'
};

export interface DeviceNodeData extends Record<string, unknown> {
 device: Device;
 role?: DeviceRole;
 tone?: DeviceTone;
}
export type DeviceNodeType = Node<DeviceNodeData, 'device'>;

export interface Packet {
 /** true = ramka płynie od `target` do `source` krawędzi. */
 reverse: boolean;
 hop: number;
}

export interface PacketEdgeData extends Record<string, unknown> {
 traffic?: {
  kind: PacketKind;
  label: string;
  /** Kilka ramek na jednym kablu, np. do Routera i z powrotem (objazd). */
  packets: Packet[];
  hopCount: number;
  /** Zmiana = restart animacji na wszystkich kablach naraz. */
  runId: number;
 };
}
export type PacketEdgeType = Edge<PacketEdgeData, 'packet'>;

export function buildNodes(devices: Device[], state: DiagramState): DeviceNodeType[] {
 return devices.map((device) => ({
  id: device.id,
  type: 'device',
  position: device.position,
  data: { device, role: state.roles[device.id], tone: state.tones?.[device.id] }
 }));
}

/**
 * Kabel na diagramie: który bok karty łączy się z którym. Rysować wolno tylko kable, które
 * istnieją w modelu sieci – widok wybiera układ, nie topologię.
 */
export function cable(a: DeviceId, aSide: Side, b: DeviceId, bSide: Side): Cable {
 if (!hasLink(a, b)) throw new Error(`W modelu sieci nie ma kabla między ${a} a ${b}.`);
 return { id: `${a}-${b}`, a, aSide, b, bSide };
}

const isOnCable = (f: Flow, c: Cable) =>
 (f.from === c.a && f.to === c.b) || (f.from === c.b && f.to === c.a);

export function buildEdges(cables: Cable[], state: DiagramState, runId: number): PacketEdgeType[] {
 const kind: PacketKind = isBroadcast(state.frame) ? 'broadcast' : 'unicast';
 const hopCount = Math.max(0, ...state.flows.map((f) => f.hop + 1));

 // Krawędzie = zawsze te same kable. Stan tylko „zapala” kabel i ustawia kierunek ruchu.
 // Kierunek obsługuje animacja (keyPoints) i strzałka (markerStart/markerEnd) –
 // nie odwracamy source/target, więc topologia zostaje nietknięta.
 return cables.map((cable) => {
  const base: PacketEdgeType = {
   id: cable.id,
   type: 'packet',
   source: cable.a,
   sourceHandle: cable.aSide,
   target: cable.b,
   targetHandle: cable.bSide,
   data: {}
  };

  const flows = state.flows.filter((f) => isOnCable(f, cable));
  if (flows.length === 0) return base;

  const packets = flows.map((f) => ({ reverse: f.from === cable.b, hop: f.hop }));
  const labels = [...new Set(flows.map((f) => f.label ?? state.frame?.name ?? ''))];
  const marker = {
   type: MarkerType.ArrowClosed,
   color: PACKET_COLORS[kind],
   width: 16,
   height: 16
  };

  return {
   ...base,
   ...(packets.some((p) => !p.reverse) ? { markerEnd: marker } : {}),
   ...(packets.some((p) => p.reverse) ? { markerStart: marker } : {}),
   data: { traffic: { kind, label: labels.join(' / '), packets, hopCount, runId } }
  };
 });
}

/**
 * Sprawdza, czy każdy skok idzie po istniejącym kablu. Wywoływane w trybie deweloperskim:
 * błąd w danych wychodzi od razu, a nie jako „brakująca strzałka” na diagramie.
 */
export function assertFlowsOnCables(cables: Cable[], flows: Flow[], where: string): void {
 for (const flow of flows) {
  if (!cables.some((c) => isOnCable(flow, c))) {
   throw new Error(`${where}: brak kabla między ${flow.from} a ${flow.to}.`);
  }
 }
}
