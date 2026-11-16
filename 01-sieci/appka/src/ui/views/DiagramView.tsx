import { useMemo } from 'react';
import { Diagram } from '../diagram/Diagram';
import { buildEdges, buildNodes } from '../diagram/graph';
import type { Cable, Device, DiagramState } from '../diagram/types';

/** Scena „diagram sieci”: karty urządzeń, kable między nimi i ruch w tym kroku. */
export interface DiagramSpec {
 type: 'diagram';
 devices: Device[];
 cables: Cable[];
 state: DiagramState;
}

interface DiagramViewProps {
 spec: DiagramSpec;
 /** Zmiana = animacja ramek startuje od początku. */
 runId: number;
}

export function DiagramView({ spec, runId }: DiagramViewProps) {
 const nodes = useMemo(() => buildNodes(spec.devices, spec.state), [spec]);
 const edges = useMemo(() => buildEdges(spec.cables, spec.state, runId), [spec, runId]);
 return <Diagram nodes={nodes} edges={edges} />;
}
