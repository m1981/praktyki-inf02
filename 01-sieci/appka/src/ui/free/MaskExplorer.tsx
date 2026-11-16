import { useMemo, useReducer } from 'react';
import { formatIp, lastOctet, maskOf } from '../../lib/ipv4';
import { nameOf } from '../../model/glossary';
import { deviceIp } from '../../model/siec';
import {
 decide,
 endpoints,
 MAX_PREFIX,
 MIN_PREFIX,
 requestFailed,
 TARGETS,
 TRAP_PREFIX,
 type MaskSettings
} from '../../net/mask';
import { Diagram } from '../diagram/Diagram';
import { buildEdges, buildNodes } from '../diagram/graph';
import type { Cable, Device, DiagramState } from '../diagram/types';
import { AddressLine } from '../panels/AddressLine';
import { BitRuler, type BitTexts } from '../panels/BitRuler';
import { DecisionPanel, type DecisionTexts } from '../panels/DecisionPanel';
import { Rich } from '../text';
import type { Pin } from '../views/FenceLine';
import { initMaskState, matchingPreset, maskReducer, type Preset } from './maskState';

/** Treść i układ, które Tryb swobodny dostaje z `content/` (sam ich nie zna). */
export interface MaskExplorerContent {
 presets: readonly Preset[];
 /** Karty urządzeń dla ustawień. */
 devicesFor: (s: MaskSettings) => Device[];
 cables: Cable[];
 /** Ruch na diagramie dla ustawień. */
 diagram: (s: MaskSettings) => DiagramState;
 /** Urządzenia na osi adresów. */
 pins: readonly Pin[];
 /** Podpowiedź, gdy ustawienia nie pasują do żadnego gotowego przykładu. */
 freeHint: string;
 /** Uwaga pod diagramem; `**…**` = pogrubienie. */
 physicalNote: string;
 decision: DecisionTexts;
 bits: BitTexts;
}

const PREFIXES = Array.from({ length: MAX_PREFIX - MIN_PREFIX + 1 }, (_, i) => MIN_PREFIX + i);

/** Tryb swobodny maski: uczeń sam ustawia maskę, cel i kierunek, a diagram pokazuje skutek. */
export function MaskExplorer({ content }: { content: MaskExplorerContent }) {
 const { presets, devicesFor, cables, pins } = content;
 const [state, dispatch] = useReducer(maskReducer, presets[0].settings, initMaskState);
 const { src, dst } = endpoints(state);
 const decision = decide(src, dst, state);
 const noReply = state.phase === 'back' && requestFailed(state);
 const preset = matchingPreset(presets, state);
 const targetLabel = nameOf(state.target);

 const diagram = useMemo(() => content.diagram(state), [content, state]);
 const nodes = useMemo(() => buildNodes(devicesFor(state), diagram), [devicesFor, state, diagram]);
 const edges = useMemo(
  () => buildEdges(cables, diagram, state.runId),
  [cables, diagram, state.runId]
 );

 return (
  <div className="sim">
   {/* --- Gotowe przykłady --- */}
   <section className="sim-panel">
    <h3>📚 Gotowe przykłady – kliknij po kolei</h3>
    <div className="mk-presets">
     {presets.map((p, i) => (
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
      <Rich text={content.physicalNote} />
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
       {content.freeHint}
      </p>
     )}
     <DecisionPanel decision={decision} texts={content.decision} noReply={noReply} />
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
         {nameOf(t)} .{lastOctet(deviceIp(t))}
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
   <AddressLine src={src} dst={dst} prefix={decision.prefix} pins={pins} />
   <BitRuler
    srcLabel={nameOf(src)}
    srcIp={deviceIp(src)}
    dstLabel={nameOf(dst)}
    dstIp={deviceIp(dst)}
    prefix={decision.prefix}
    texts={content.bits}
   />
  </div>
 );
}
