import { useEffect, useMemo, useReducer } from 'react';
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
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

import { SIMULATION_STEPS } from './simulationConfig';
import { initSimulation, simulationReducer } from './simulationReducer';
import { buildEdges, buildNodes, PACKET_COLORS, tablesAt } from './graph';
import { DeviceNode } from './DeviceNode';
import { PacketEdge } from './PacketEdge';
import { FramePanel, TablesPanel } from './InfoPanels';

// Typy węzłów/krawędzi poza komponentem: nowy obiekt przy każdym renderze
// zmusiłby React Flow do przebudowy wszystkich węzłów (i daje ostrzeżenie w konsoli).
const nodeTypes: NodeTypes = { device: DeviceNode };
const edgeTypes: EdgeTypes = { packet: PacketEdge };

export default function NetworkSimulation() {
 const [state, dispatch] = useReducer(simulationReducer, SIMULATION_STEPS.length, initSimulation);
 const { stepIndex, stepCount } = state;
 const step = SIMULATION_STEPS[stepIndex];
 const isFirst = stepIndex === 0;
 const isLast = stepIndex === stepCount - 1;

 const nodes = useMemo(() => buildNodes(step), [step]);
 const edges = useMemo(() => buildEdges(step, stepIndex), [step, stepIndex]);
 const tables = useMemo(() => tablesAt(SIMULATION_STEPS, stepIndex), [stepIndex]);

 // Strzałki ← → na klawiaturze (wygodne przy rzutniku). Pomijamy, gdy fokus jest w polu tekstowym.
 useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
   if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
   if (e.key === 'ArrowRight') dispatch({ type: 'NEXT' });
   if (e.key === 'ArrowLeft') dispatch({ type: 'PREV' });
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, []);

 return (
  <div className="sim">
   <div className="sim-legend" aria-label="Legenda">
    <span>
     <i style={{ background: PACKET_COLORS.broadcast }} /> Broadcast – ramka do wszystkich
    </span>
    <span>
     <i style={{ background: PACKET_COLORS.unicast }} /> Unicast – ramka do jednego urządzenia
    </span>
   </div>

   <div className="sim-stage">
    <div className="sim-canvas">
     <ReactFlowProvider>
      <ReactFlow
       nodes={nodes}
       edges={edges}
       nodeTypes={nodeTypes}
       edgeTypes={edgeTypes}
       // Loose: kabel może kończyć się na dowolnym punkcie zaczepienia (jeden na bok karty).
       connectionMode={ConnectionMode.Loose}
       fitView
       fitViewOptions={{ padding: 0.08 }}
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

    <aside className="sim-side">
     <FramePanel frame={step.frame} />
     <TablesPanel arp={tables.arp} mac={tables.mac} />
    </aside>
   </div>

   <section className="sim-step" aria-live="polite">
    <div className="sim-step__meta">
     <span className="sim-badge">{isFirst ? 'Start' : `Krok ${stepIndex} z ${stepCount - 1}`}</span>
     <span className="sim-muted">{step.layer}</span>
    </div>
    <h2>{step.title}</h2>
    <p>{step.description}</p>

    {step.questions && (
     <div className="sim-questions">
      <h3>❓ Sprawdź się</h3>
      {step.questions.map((q) => (
       <details key={q.question}>
        <summary>{q.question}</summary>
        <p>{q.answer}</p>
       </details>
      ))}
     </div>
    )}

    <div className="sim-controls">
     <button
      type="button"
      className="sim-btn"
      onClick={() => dispatch({ type: 'RESET' })}
      disabled={isFirst}
      title="Wróć do początku"
      aria-label="Wróć do początku"
     >
      <RotateCcw size={16} aria-hidden />
     </button>
     <button
      type="button"
      className="sim-btn"
      onClick={() => dispatch({ type: 'PREV' })}
      disabled={isFirst}
     >
      <ChevronLeft size={16} aria-hidden /> Poprzedni krok
     </button>
     <button
      type="button"
      className="sim-btn sim-btn--primary"
      onClick={() => dispatch({ type: 'NEXT' })}
      disabled={isLast}
     >
      Następny krok <ChevronRight size={16} aria-hidden />
     </button>
     <span className="sim-muted sim-hint">Klawiatura: ← →</span>
    </div>
   </section>
  </div>
 );
}

/** Dopasowuje widok po zmianie rozmiaru okna (np. obrót telefonu). `fitView` działa tylko na starcie. */
function FitViewOnResize() {
 const { fitView } = useReactFlow();
 const width = useStore((s) => s.width);
 const height = useStore((s) => s.height);
 useEffect(() => {
  void fitView({ padding: 0.08 });
 }, [width, height, fitView]);
 return null;
}
