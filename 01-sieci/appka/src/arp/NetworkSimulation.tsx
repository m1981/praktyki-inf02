import { useEffect, useMemo, useReducer } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

import { Diagram } from '../ui/diagram/Diagram';
import { buildEdges, buildNodes, PACKET_COLORS } from '../ui/diagram/graph';
import { COLOR_VARS } from '../ui/tokens';
import { tablesAt } from '../net/arp';
import { CABLES, DEVICES, SIMULATION_STEPS } from './scenario';
import { initSimulation, simulationReducer } from './reducer';
import { FramePanel, TablesPanel } from './InfoPanels';

export default function NetworkSimulation() {
 const [state, dispatch] = useReducer(simulationReducer, SIMULATION_STEPS.length, initSimulation);
 const { stepIndex, stepCount } = state;
 const step = SIMULATION_STEPS[stepIndex];
 const isFirst = stepIndex === 0;
 const isLast = stepIndex === stepCount - 1;

 const nodes = useMemo(() => buildNodes(DEVICES, step), [step]);
 const edges = useMemo(() => buildEdges(CABLES, step, stepIndex), [step, stepIndex]);
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
  <div className="sim" style={COLOR_VARS}>
   <div className="sim-legend" aria-label="Legenda">
    <span>
     <i style={{ background: PACKET_COLORS.broadcast }} /> Broadcast – ramka do wszystkich
    </span>
    <span>
     <i style={{ background: PACKET_COLORS.unicast }} /> Unicast – ramka do jednego urządzenia
    </span>
   </div>

   {/* Tekst kroku i przyciski OBOK animacji: wzrok nie opuszcza jednego obszaru (audyt.md, rozdz. 2.4). */}
   <div className="sim-stage sim-stage--steps">
    <Diagram nodes={nodes} edges={edges} />

    <section className="sim-step" aria-live="polite">
     <div className="sim-step__meta">
      <span className="sim-badge">
       {isFirst ? 'Start' : `Krok ${stepIndex} z ${stepCount - 1}`}
      </span>
      <span className="sim-muted">{step.layer}</span>
     </div>
     <h2>{step.title}</h2>
     <p>{step.description}</p>

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
       <ChevronLeft size={16} aria-hidden /> Wstecz
      </button>
      <button
       type="button"
       className="sim-btn sim-btn--primary"
       onClick={() => dispatch({ type: 'NEXT' })}
       disabled={isLast}
      >
       Następny krok <ChevronRight size={16} aria-hidden />
      </button>
     </div>
     <span className="sim-muted sim-hint">Klawiatura: ← →</span>
    </section>
   </div>

   <div className="sim-details">
    <FramePanel frame={step.frame} />
    <TablesPanel arp={tables.arp} mac={tables.mac} />
    {step.questions && (
     <section className="sim-panel sim-questions">
      <h3>❓ Sprawdź się</h3>
      {step.questions.map((q) => (
       <details key={q.question}>
        <summary>{q.question}</summary>
        <p>{q.answer}</p>
       </details>
      ))}
     </section>
    )}
   </div>
  </div>
 );
}
