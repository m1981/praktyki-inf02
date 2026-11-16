import { useMemo, useReducer } from 'react';
import { Diagram } from '../sim/Diagram';
import { buildEdges, buildNodes } from '../sim/graph';
import { formatIp, lastOctet, maskOf } from './ipMath';
import {
 CABLES,
 decide,
 devicesFor,
 endpoints,
 HOSTS,
 INITIAL_MASK_STATE,
 matchingPreset,
 maskReducer,
 MAX_PREFIX,
 MIN_PREFIX,
 PRESETS,
 requestFailed,
 TARGETS,
 toDiagram,
 TRAP_PREFIX
} from './network';
import { DecisionPanel } from './DecisionPanel';
import { AddressLine } from './AddressLine';
import { BitRuler } from './BitRuler';

const PREFIXES = Array.from({ length: MAX_PREFIX - MIN_PREFIX + 1 }, (_, i) => MIN_PREFIX + i);

// DLACZEGO useReducer: kilka powiązanych ustawień (maska, cel, pułapka, kierunek) zmienia się
// razem (gotowe przykłady), a każda zmiana musi też zrestartować animację (runId).
export default function MaskExplorer() {
 const [state, dispatch] = useReducer(maskReducer, INITIAL_MASK_STATE);
 const { src, dst } = endpoints(state);
 const decision = decide(src, dst, state);
 const noReply = state.phase === 'back' && requestFailed(state);
 const preset = matchingPreset(state);
 const targetLabel = HOSTS[state.target].label;

 const diagram = useMemo(() => toDiagram(state), [state]);
 const nodes = useMemo(() => buildNodes(devicesFor(state), diagram), [state, diagram]);
 const edges = useMemo(() => buildEdges(CABLES, diagram, state.runId), [diagram, state.runId]);

 return (
  <div className="sim">
   {/* --- Gotowe przykłady --- */}
   <section className="sim-panel">
    <h3>📚 Gotowe przykłady – kliknij po kolei</h3>
    <div className="mk-presets">
     {PRESETS.map((p, i) => (
      <button
       key={p.id}
       type="button"
       className={`mk-preset${preset?.id === p.id ? ' mk-preset--active' : ''}`}
       aria-pressed={preset?.id === p.id}
       onClick={() => dispatch({ type: 'APPLY_PRESET', settings: p.settings })}
      >
       <span className="mk-preset__num">{i + 1}</span> {p.title}
      </button>
     ))}
    </div>
   </section>

   {/* --- Diagram + decyzja --- */}
   <div className="sim-stage">
    <div className="mk-diagram">
     <Diagram nodes={nodes} edges={edges} />
     <div className="sim-legend" aria-label="Legenda">
      <span>
       <i className="mk-dot mk-dot--inside" /> w sieci nadawcy (według jego maski)
      </span>
      <span>
       <i className="mk-dot mk-dot--outside" /> poza siecią nadawcy
      </span>
     </div>
     <p className="mk-physical">
      🔌 <strong>Warstwa fizyczna się nie zmienia:</strong> wszystkie urządzenia wiszą na jednym
      Switchu, a ramka Broadcast (np. ARP) nadal dociera do każdego. Maska nie stawia ściany w kablu
      – zmienia tylko <strong>decyzję nadawcy</strong>: wysłać bezpośrednio czy przez bramę.
     </p>
    </div>
    <aside className="sim-side">
     {/* Lekcja OBOK diagramu, nie nad nim (audyt: lekcja ↔ diagram 843–894 px). */}
     {preset ? (
      <p className="mk-lesson" aria-live="polite">
       💡 {preset.lesson}
      </p>
     ) : (
      <p className="sim-muted mk-small" aria-live="polite">
       Tryb swobodny: zmieniasz ustawienia ręcznie. Kliknij przykład, żeby wrócić do lekcji.
      </p>
     )}
     <DecisionPanel decision={decision} noReply={noReply} />
    </aside>
   </div>

   {/* --- Sterowanie: schowane w „Trybie swobodnym”, pod diagramem (audyt: 11 elementów naraz) --- */}
   <details className="sim-panel mk-free">
    <summary>🛠️ Tryb swobodny: sam ustaw maskę, cel i kierunek</summary>
    <div className="mk-controls">
     <div className="mk-control">
      <label htmlFor="mk-prefix">
       <strong>Maska</strong> (na wszystkich urządzeniach{state.trap ? ' oprócz Serwera NAS' : ''})
      </label>
      <input
       id="mk-prefix"
       type="range"
       min={MIN_PREFIX}
       max={MAX_PREFIX}
       step={1}
       value={state.prefix}
       onChange={(e) => dispatch({ type: 'SET_PREFIX', prefix: Number(e.target.value) })}
      />
      <div className="mk-ticks" aria-hidden>
       {PREFIXES.map((p) => (
        <span key={p}>/{p}</span>
       ))}
      </div>
      <output htmlFor="mk-prefix" className="mk-output">
       /{state.prefix} = {formatIp(maskOf(state.prefix))}
      </output>
     </div>

     <div className="mk-control">
      <span id="mk-target">
       <strong>Laptop rozmawia z</strong>
      </span>
      <div className="mk-segmented" role="group" aria-labelledby="mk-target">
       {TARGETS.map((t) => (
        <button
         key={t}
         type="button"
         aria-pressed={state.target === t}
         onClick={() => dispatch({ type: 'SET_TARGET', target: t })}
        >
         {HOSTS[t].label} .{lastOctet(HOSTS[t].ip)}
        </button>
       ))}
      </div>

      <span id="mk-phase">
       <strong>Kierunek</strong>
      </span>
      <div className="mk-segmented" role="group" aria-labelledby="mk-phase">
       <button
        type="button"
        aria-pressed={state.phase === 'there'}
        onClick={() => dispatch({ type: 'SET_PHASE', phase: 'there' })}
       >
        ➡️ Tam: Laptop → {targetLabel}
       </button>
       <button
        type="button"
        aria-pressed={state.phase === 'back'}
        onClick={() => dispatch({ type: 'SET_PHASE', phase: 'back' })}
       >
        ⬅️ Z powrotem: {targetLabel} → Laptop
       </button>
      </div>

      <label className="mk-check">
       <input
        type="checkbox"
        checked={state.trap}
        onChange={(e) => dispatch({ type: 'SET_TRAP', trap: e.target.checked })}
       />
       Pułapka: na Serwerze NAS ktoś wpisał maskę /{TRAP_PREFIX}
      </label>
     </div>
    </div>
   </details>

   {/* --- Widoki pomocnicze --- */}
   <AddressLine src={src} dst={dst} prefix={decision.prefix} />
   <BitRuler
    srcLabel={HOSTS[src].label}
    srcIp={HOSTS[src].ip}
    dstLabel={HOSTS[dst].label}
    dstIp={HOSTS[dst].ip}
    prefix={decision.prefix}
   />
  </div>
 );
}
