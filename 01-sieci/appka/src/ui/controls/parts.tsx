// Wspólne części elementów sterujących serii ćwiczeń.

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StepNav } from '../../engine/nav';

/** Na ostatnim kroku: przejście do następnego ćwiczenia (to nawigacja, nie sterowanie ćwiczeniem). */
export function NextExercise({ nav }: { nav: StepNav }) {
 if (!nav.isLastStep || nav.nextTitle === undefined) return null;
 return (
  <button type="button" className="sim-btn sim-btn--primary" onClick={nav.next}>
   Dalej: {nav.nextTitle} <ChevronRight size={16} aria-hidden />
  </button>
 );
}

/** Dyskretny powrót o krok – pod elementem sterującym, żeby z nim nie konkurował. */
export function BackLink({ nav }: { nav: StepNav }) {
 return (
  <button type="button" className="sr-back" onClick={nav.prev} disabled={nav.atStart}>
   <ChevronLeft size={14} aria-hidden /> Wstecz
  </button>
 );
}
