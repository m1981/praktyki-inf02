import type { StepNav } from '../../engine/nav';
import { BackLink, NextExercise } from './parts';

/** Przełącznik: każda pozycja to jeden krok ćwiczenia (pozycja nr i = krok nr i). */
export interface ToggleSpec {
 type: 'toggle';
 /** Co przełączamy, np. „Maska”. */
 label: string;
 /** Pozycje przełącznika, np. „/24”, „/25”. */
 options: readonly string[];
}

export function ToggleControl({ spec, nav }: { spec: ToggleSpec; nav: StepNav }) {
 return (
  <>
   <div className="sim-controls">
    <div className="mk-segmented" role="group" aria-label={spec.label}>
     {spec.options.map((option, i) => (
      <button
       key={option}
       type="button"
       aria-pressed={i === nav.stepIndex}
       onClick={() => nav.setStep(i)}
      >
       {`${spec.label} `}
       {option}
      </button>
     ))}
    </div>
    <NextExercise nav={nav} />
   </div>
   <BackLink nav={nav} />
  </>
 );
}
