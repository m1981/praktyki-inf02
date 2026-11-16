import { useEffect, useMemo, useReducer } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Diagram } from '../sim/Diagram';
import { buildEdges, buildNodes } from '../sim/graph';
import { FenceLine } from './AddressLine';
import MaskExplorer from './MaskExplorer';
import {
 COMPARE_ROWS,
 exFromHash,
 EXERCISES,
 FREE_MODE,
 hashOf,
 seriesReducer,
 type SeriesStep
} from './series';

// Szablon ekranu z audytu (audyt.md, rozdz. 5.0): pytanie na górze, wizualizacja 340 px po lewej,
// tekst kroku + jeden element sterujący po prawej. Wzrok nie opuszcza jednego obszaru.
export default function SeriesView() {
 const [state, dispatch] = useReducer(seriesReducer, undefined, () => ({
  ex: exFromHash(window.location.hash),
  step: 0
 }));
 const isFree = state.ex === FREE_MODE;

 // Adres w pasku (#m1 …) bez dopisywania historii przy każdym kroku.
 useEffect(() => {
  history.replaceState(null, '', hashOf(state.ex));
 }, [state.ex]);

 // Wklejony link z innym #m… w tej samej karcie nie przeładowuje strony – reagujemy na zmianę adresu.
 useEffect(() => {
  const onHash = () => dispatch({ type: 'GOTO', ex: exFromHash(window.location.hash) });
  window.addEventListener('hashchange', onHash);
  return () => window.removeEventListener('hashchange', onHash);
 }, []);

 // Strzałki ← → jak w Symulatorze ARP. W Trybie swobodnym strzałki obsługują suwak maski.
 useEffect(() => {
  if (isFree) return;
  const onKey = (e: KeyboardEvent) => {
   if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
   if (e.key === 'ArrowRight') dispatch({ type: 'NEXT' });
   if (e.key === 'ArrowLeft') dispatch({ type: 'PREV' });
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [isFree]);

 return (
  <div className="sim">
   <nav className="sr-tabs" aria-label="Ćwiczenia z maską">
    {EXERCISES.map((ex, i) => (
     <button
      key={ex.code}
      type="button"
      className="sr-tab"
      aria-current={state.ex === i ? 'step' : undefined}
      onClick={() => dispatch({ type: 'GOTO', ex: i })}
     >
      <strong>{ex.code}</strong> {ex.title}
     </button>
    ))}
    <button
     type="button"
     className="sr-tab"
     aria-current={isFree ? 'step' : undefined}
     onClick={() => dispatch({ type: 'GOTO', ex: FREE_MODE })}
    >
     🛠️ Tryb swobodny
    </button>
   </nav>

   {isFree ? (
    <MaskExplorer />
   ) : (
    <ExerciseScreen
     exIndex={state.ex}
     step={state.step}
     onNext={() => dispatch({ type: 'NEXT' })}
     onPrev={() => dispatch({ type: 'PREV' })}
     onSetStep={(step) => dispatch({ type: 'SET_STEP', step })}
    />
   )}
  </div>
 );
}

interface ExerciseScreenProps {
 exIndex: number;
 step: number;
 onNext: () => void;
 onPrev: () => void;
 onSetStep: (step: number) => void;
}

function ExerciseScreen({ exIndex, step, onNext, onPrev, onSetStep }: ExerciseScreenProps) {
 const ex = EXERCISES[exIndex];
 const current = ex.steps[step];
 const isLastStep = step === ex.steps.length - 1;
 const nextTitle = exIndex + 1 < EXERCISES.length ? EXERCISES[exIndex + 1].code : 'Tryb swobodny';
 // runId zmienia się z każdym krokiem → animacja ramek startuje od początku.
 const runId = exIndex * 10 + step;

 return (
  <>
   <p className="sr-question">
    <span className="sr-code">{ex.code}</span> ❓ {ex.question}
   </p>

   <div className="sim-stage sim-stage--steps">
    {/* key: nowe ćwiczenie = nowy diagram, więc widok dopasowuje się do jego urządzeń. */}
    <Visual key={exIndex} step={current} runId={runId} />

    <section className="sim-step" aria-live="polite">
     <div className="sim-step__meta">
      <span className="sim-badge">
       Krok {step + 1} z {ex.steps.length}
      </span>
     </div>
     <p>{current.text}</p>
     <p className="sr-change">
      <strong>Zmiana:</strong> {current.change}
     </p>
     {isLastStep && (
      <p className="sr-bridge">
       <strong>Na następne ćwiczenie:</strong> {ex.nextQuestion}
      </p>
     )}

     <div className="sim-controls">
      {ex.controlKind === 'toggle' && (
       <div className="mk-segmented" role="group" aria-label="Maska">
        {ex.steps.map((s, i) => (
         <button
          key={s.control}
          type="button"
          aria-pressed={i === step}
          onClick={() => onSetStep(i)}
         >
          Maska {s.control}
         </button>
        ))}
       </div>
      )}
      {ex.controlKind === 'next' && !isLastStep && (
       <button type="button" className="sim-btn sim-btn--primary" onClick={onNext}>
        {current.control}
       </button>
      )}
      {isLastStep && (
       <button type="button" className="sim-btn sim-btn--primary" onClick={onNext}>
        Dalej: {nextTitle} <ChevronRight size={16} aria-hidden />
       </button>
      )}
     </div>
     <button
      type="button"
      className="sr-back"
      onClick={onPrev}
      disabled={exIndex === 0 && step === 0}
     >
      <ChevronLeft size={14} aria-hidden /> Wstecz
     </button>
    </section>
   </div>
  </>
 );
}

function Visual({ step, runId }: { step: SeriesStep; runId: number }) {
 const v = step.visual;
 const nodes = useMemo(() => (v.kind === 'diagram' ? buildNodes(v.devices, v.state) : []), [v]);
 const edges = useMemo(
  () => (v.kind === 'diagram' ? buildEdges(v.cables, v.state, runId) : []),
  [v, runId]
 );

 if (v.kind === 'diagram') return <Diagram nodes={nodes} edges={edges} />;
 if (v.kind === 'fence') {
  return (
   <div className="sr-board">
    <FenceLine src="laptop" dst="printer" prefix={v.prefix} only={['laptop', 'printer']} />
   </div>
  );
 }
 return (
  <div className="sr-board">
   <CompareTable revealed={v.revealed} />
  </div>
 );
}

/** M1: numer sieci (3 pierwsze liczby przy /24) obok części hosta; kolejne adresy odsłaniane po jednym. */
function CompareTable({ revealed }: { revealed: number }) {
 const [laptop, ...others] = COMPARE_ROWS;
 const netOf = (ip: string) => ip.split('.').slice(0, 3).join('.');
 const hostOf = (ip: string) => `.${ip.split('.')[3]}`;
 return (
  <table className="sr-compare">
   <thead>
    <tr>
     <th scope="col">Urządzenie</th>
     <th scope="col">numer sieci</th>
     <th scope="col">host</th>
     <th scope="col">wynik</th>
    </tr>
   </thead>
   <tbody>
    <tr className="sr-compare__ref">
     <th scope="row">{laptop.label}</th>
     <td className="sr-net">{netOf(laptop.ip)}</td>
     <td className="sr-host">{hostOf(laptop.ip)}</td>
     <td>(wzór)</td>
    </tr>
    {others.map((row, i) => {
     const shown = i < revealed;
     const same = netOf(row.ip) === netOf(laptop.ip);
     return (
      <tr key={row.label} className={i === revealed - 1 ? 'sr-compare__new' : undefined}>
       <th scope="row">{shown ? row.label : '?'}</th>
       <td className="sr-net">{shown ? netOf(row.ip) : ''}</td>
       <td className="sr-host">{shown ? hostOf(row.ip) : ''}</td>
       <td>{shown ? (same ? '✅ ta sama sieć' : '❌ inna sieć') : ''}</td>
      </tr>
     );
    })}
   </tbody>
  </table>
 );
}
