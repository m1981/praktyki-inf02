import { useState } from 'react';
import type { StepNav } from '../../engine/nav';

/** Sterowanie rozmową: wstecz i dalej. Napis na „dalej” może zapowiadać akcję („✉️ Wyślij ▶”). */
export interface TalkSpec {
 type: 'talk';
 /** Napis na przycisku zamiast „Dalej ▶” – gdy następny krok to akcja na schemacie. */
 next?: string;
 /** Napis na ostatnim kroku sceny, np. „Zobacz to samo w sieci ▶”. */
 end?: string;
 /** Ostatnia scena: przycisk na końcu wraca na początek kursu. */
 restart?: boolean;
}

export interface QuizOption {
 text: string;
 /** Reakcja po wybraniu tej odpowiedzi. */
 feedback: string;
 correct?: boolean;
}

/** Zagadka na koniec sceny: kilka odpowiedzi, każda z własną reakcją. */
export interface QuizSpec {
 type: 'quiz';
 options: readonly QuizOption[];
 end?: string;
 /** Ostatnia scena: przycisk na końcu wraca na początek kursu. */
 restart?: boolean;
}

export function TalkControl({ spec, nav }: { spec: TalkSpec; nav: StepNav }) {
 return <Actions nav={nav} next={spec.next} end={spec.end} restart={spec.restart} />;
}

export function QuizControl({ spec, nav }: { spec: QuizSpec; nav: StepNav }) {
 const [chosen, setChosen] = useState<number>();
 const picked = chosen === undefined ? undefined : spec.options[chosen];
 return (
  <>
   <div className="dl-quiz">
    {spec.options.map((option, i) => (
     <button
      key={option.text}
      type="button"
      className={chosen === i ? (option.correct ? 'dl-right' : 'dl-wrong') : undefined}
      aria-pressed={chosen === i}
      onClick={() => setChosen(i)}
     >
      {option.text}
     </button>
    ))}
   </div>
   {picked && (
    <p className={`dl-feedback${picked.correct ? ' dl-feedback--ok' : ''}`}>{picked.feedback}</p>
   )}
   <Actions nav={nav} end={spec.end} restart={spec.restart} />
  </>
 );
}

interface ActionsProps {
 nav: StepNav;
 next?: string;
 end?: string;
 restart?: boolean;
}

function Actions({ nav, next, end, restart }: ActionsProps) {
 // Ostatni krok ostatniej sceny: dalej nie ma nic – można najwyżej wrócić na początek.
 const isCourseEnd = nav.isLastStep && nav.nextTitle === undefined;
 const label = nav.isLastStep ? (end ?? 'Dalej ▶') : (next ?? 'Dalej ▶');
 return (
  <div className="dl-actions">
   <button type="button" className="sim-btn" onClick={nav.prev} disabled={nav.atStart}>
    ◀ Wstecz
   </button>
   <button
    type="button"
    className="sim-btn sim-btn--primary"
    onClick={isCourseEnd && restart ? nav.restart : nav.next}
    disabled={isCourseEnd && !restart}
   >
    {label}
   </button>
  </div>
 );
}
