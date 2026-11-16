import type { StepNav } from '../../engine/nav';
import { BackLink, NextExercise } from './parts';

/** Jeden przycisk, który odsłania następny krok. */
export interface NextSpec {
 type: 'next';
 /** Napis na przycisku: co się stanie po kliknięciu. */
 label: string;
}

export function NextControl({ spec, nav }: { spec: NextSpec; nav: StepNav }) {
 return (
  <>
   <div className="sim-controls">
    {!nav.isLastStep && (
     <button type="button" className="sim-btn sim-btn--primary" onClick={nav.next}>
      {spec.label}
     </button>
    )}
    <NextExercise nav={nav} />
   </div>
   <BackLink nav={nav} />
  </>
 );
}
