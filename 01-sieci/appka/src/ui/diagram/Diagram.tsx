import { useEffect, useMemo } from 'react';
import {
 Background,
 ConnectionMode,
 ReactFlow,
 ReactFlowProvider,
 useReactFlow,
 useStore,
 type EdgeTypes,
 type NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DeviceNode } from './DeviceNode';
import { PacketEdge } from './PacketEdge';
import type { DeviceNodeType, PacketEdgeType } from './graph';

// Typy węzłów/krawędzi poza komponentem: nowy obiekt przy każdym renderze
// zmusiłby React Flow do przebudowy wszystkich węzłów (i daje ostrzeżenie w konsoli).
const nodeTypes: NodeTypes = { device: DeviceNode };
const edgeTypes: EdgeTypes = { packet: PacketEdge };
const FIT = { padding: 0.08 };

interface DiagramProps {
 nodes: DeviceNodeType[];
 edges: PacketEdgeType[];
}

/** Diagram sieci jako animowany slajd (bez edycji). Wspólny dla wszystkich symulatorów. */
export function Diagram({ nodes, edges }: DiagramProps) {
 // Układ = które karty i gdzie stoją. Zmiana samej treści kart (adres, rola) układu nie zmienia.
 // DLACZEGO KLUCZ: React Flow dopasowuje widok tylko na starcie. Inny układ (inne ćwiczenie) =
 // nowy diagram, więc widok sam dopasowuje się do nowych kart – ekran nie musi o tym pamiętać.
 const layout = useMemo(
  () => nodes.map((n) => `${n.id}@${n.position.x},${n.position.y}`).join(' '),
  [nodes]
 );
 return (
  <div className="sim-canvas">
   <ReactFlowProvider key={layout}>
    <ReactFlow
     nodes={nodes}
     edges={edges}
     nodeTypes={nodeTypes}
     edgeTypes={edgeTypes}
     // Loose: kabel może kończyć się na dowolnym punkcie zaczepienia (jeden na bok karty).
     connectionMode={ConnectionMode.Loose}
     fitView
     fitViewOptions={FIT}
     // Domyślne minZoom (0.5) nie mieści całej sieci na ekranie telefonu.
     minZoom={0.1}
     // To animowany slajd, a nie edytor: blokujemy przeciąganie, zoom i zaznaczanie.
     nodesDraggable={false}
     nodesConnectable={false}
     elementsSelectable={false}
     panOnDrag={false}
     zoomOnScroll={false}
     zoomOnPinch={false}
     zoomOnDoubleClick={false}
     // Kółko myszy przewija stronę, a nie „utyka” na diagramie.
     preventScrolling={false}
    >
     <Background gap={20} color="#dfe6e9" />
     <FitViewOnResize />
    </ReactFlow>
   </ReactFlowProvider>
  </div>
 );
}

/** Dopasowuje widok po zmianie rozmiaru okna (np. obrót telefonu). `fitView` działa tylko na starcie. */
function FitViewOnResize() {
 const { fitView } = useReactFlow();
 const width = useStore((s) => s.width);
 const height = useStore((s) => s.height);
 useEffect(() => {
  void fitView(FIT);
 }, [width, height, fitView]);
 return null;
}
