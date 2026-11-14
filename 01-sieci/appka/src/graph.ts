// Czyste funkcje: krok scenariusza → węzły i krawędzie React Flow.
// DLACZEGO STAN POCHODNY: jedynym stanem aplikacji jest numer kroku. Diagram i tabele liczymy
// z danych, więc nie da się ich „rozsynchronizować” z opisem kroku.

import { MarkerType, type Edge, type Node } from '@xyflow/react';
import {
 BROADCAST_MAC,
 CABLES,
 DEVICES,
 type ArpEntry,
 type Device,
 type DeviceRole,
 type MacEntry,
 type SimulationStep
} from './simulationConfig';

export type PacketKind = 'broadcast' | 'unicast';

export const PACKET_COLORS: Record<PacketKind, string> = {
 broadcast: '#e67e22',
 unicast: '#00b894'
};

export interface DeviceNodeData extends Record<string, unknown> {
 device: Device;
 role?: DeviceRole;
}
export type DeviceNodeType = Node<DeviceNodeData, 'device'>;

export interface PacketEdgeData extends Record<string, unknown> {
 packet?: {
  kind: PacketKind;
  label: string;
  /** true = ramka płynie od `target` do `source` krawędzi. */
  reverse: boolean;
  hop: number;
  hopCount: number;
  /** Zmienia się przy każdym kroku – restartuje animację na wszystkich kablach naraz. */
  runId: number;
 };
}
export type PacketEdgeType = Edge<PacketEdgeData, 'packet'>;

export function buildNodes(step: SimulationStep): DeviceNodeType[] {
 return DEVICES.map((device) => ({
  id: device.id,
  type: 'device',
  position: device.position,
  data: { device, role: step.roles[device.id] }
 }));
}

export function buildEdges(step: SimulationStep, stepIndex: number): PacketEdgeType[] {
 const kind: PacketKind = step.frame?.dstMac === BROADCAST_MAC ? 'broadcast' : 'unicast';
 const hopCount = Math.max(0, ...step.flows.map((f) => f.hop + 1));

 // Krawędzie = zawsze te same kable. Krok tylko „zapala” kabel i ustawia kierunek ruchu.
 // DLACZEGO NIE ODWRACAMY source/target (jak w pierwszym szkicu): kierunek obsługuje sama
 // animacja (keyPoints) i strzałka (markerStart/markerEnd). Topologia zostaje nietknięta.
 return CABLES.map((cable) => {
  const base: PacketEdgeType = {
   id: cable.id,
   type: 'packet',
   source: cable.a,
   sourceHandle: cable.aSide,
   target: cable.b,
   targetHandle: cable.bSide,
   data: {}
  };

  const flow = step.flows.find(
   (f) => (f.from === cable.a && f.to === cable.b) || (f.from === cable.b && f.to === cable.a)
  );
  if (!flow) return base;

  const reverse = flow.from === cable.b;
  const marker = {
   type: MarkerType.ArrowClosed,
   color: PACKET_COLORS[kind],
   width: 16,
   height: 16
  };

  return {
   ...base,
   ...(reverse ? { markerStart: marker } : { markerEnd: marker }),
   data: {
    packet: {
     kind,
     label: flow.label ?? step.frame?.name ?? '',
     reverse,
     hop: flow.hop,
     hopCount,
     runId: stepIndex
    }
   }
  };
 });
}

export interface TableRow<T> {
 entry: T;
 isNew: boolean;
}

/** Stan tablic ARP (Laptop) i MAC (Switch) po wykonaniu kroków 0..stepIndex. */
export function tablesAt(steps: SimulationStep[], stepIndex: number) {
 const arp: TableRow<ArpEntry>[] = [];
 const mac: TableRow<MacEntry>[] = [];
 steps.slice(0, stepIndex + 1).forEach((step, i) => {
  const isNew = i === stepIndex;
  step.learns?.laptopArp?.forEach((entry) => arp.push({ entry, isNew }));
  step.learns?.switchMac?.forEach((entry) => mac.push({ entry, isNew }));
 });
 return { arp, mac };
}
