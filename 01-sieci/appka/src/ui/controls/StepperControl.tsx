import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { StepNav } from '../../engine/nav';

/** Sterowanie scenariuszem krok po kroku: od początku, wstecz, następny krok. */
export interface StepperSpec {
 type: 'stepper';
}

export function StepperControl({ nav }: { spec: StepperSpec; nav: StepNav }) {
 // Ostatni krok kursu: nie ma następnego kroku ani następnego ćwiczenia.
 const atEnd = nav.isLastStep && nav.nextTitle === undefined;
 return (
  <>
   <div className="sim-controls">
    <button
     type="button"
     className="sim-btn"
     onClick={nav.reset}
     disabled={nav.atStart}
     title="Wróć do początku"
     aria-label="Wróć do początku"
    >
     <RotateCcw size={16} aria-hidden />
    </button>
    <button type="button" className="sim-btn" onClick={nav.prev} disabled={nav.atStart}>
     <ChevronLeft size={16} aria-hidden /> Wstecz
    </button>
    <button type="button" className="sim-btn sim-btn--primary" onClick={nav.next} disabled={atEnd}>
     Następny krok <ChevronRight size={16} aria-hidden />
    </button>
   </div>
   <span className="sim-muted sim-hint">Klawiatura: ← →</span>
  </>
 );
}
