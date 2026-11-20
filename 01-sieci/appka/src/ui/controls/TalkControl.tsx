import { useState } from 'react';
import type { StepNav } from '../../engine/nav';
import { setTask, useTask } from '../taskState';

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
 /** Napis na przycisku „dalej”, gdy po zagadce scena idzie dalej (np. „Teraz Ty ▶”). */
 next?: string;
 end?: string;
 /** Ostatnia scena: przycisk na końcu wraca na początek kursu. */
 restart?: boolean;
}

/** Odpowiedź do wyboru w ćwiczeniu „uczeń sam”. */
export interface TaskOption {
 text: string;
 correct?: boolean;
 /** Reakcja na złą odpowiedź. */
 feedback?: string;
}

/**
 * Ćwiczenie „uczeń sam”: polecenie jest kwestią kroku, a „Dalej” działa dopiero po dobrej odpowiedzi.
 * Z `options` – uczeń wybiera odpowiedź tutaj; bez nich – klika na schemacie (widok zapisuje wynik
 * w `taskState`).
 */
export interface TaskSpec {
 type: 'task';
 options?: readonly TaskOption[];
 end?: string;
 restart?: boolean;
}

/** Krótki napis interfejsu po dobrej odpowiedzi (scenariusz podaje tylko reakcje na błąd). */
const RIGHT = '✓ Dobrze.';

export function TalkControl({ spec, nav }: { spec: TalkSpec; nav: StepNav }) {
 return <Actions nav={nav} next={spec.next} end={spec.end} restart={spec.restart} />;
}

export function TaskControl({ spec, nav }: { spec: TaskSpec; nav: StepNav }) {
 // Klucz kroku: dwa ćwiczenia z wyborem pod rząd nie mogą dzielić zaznaczenia.
 return <Task key={nav.stepIndex} spec={spec} nav={nav} />;
}

function Task({ spec, nav }: { spec: TaskSpec; nav: StepNav }) {
 const task = useTask();
 const [chosen, setChosen] = useState<number>();
 const options = spec.options;
 const choose = (i: number) => {
  setChosen(i);
  const option = options![i];
  setTask(
   option.correct
    ? { solved: true, feedback: { text: RIGHT, ok: true } }
    : { solved: false, feedback: { text: option.feedback ?? '', ok: false } }
  );
 };
 const short = options?.every((o) => o.text.length <= 4);
 return (
  <>
   {options && (
    <div className={`dl-quiz${short ? ' dl-quiz--row' : ''}`}>
     {options.map((option, i) => (
      <button
       key={option.text}
       type="button"
       data-ok={option.correct ? '1' : '0'}
       className={chosen === i ? (option.correct ? 'dl-right' : 'dl-wrong') : undefined}
       aria-pressed={chosen === i}
       onClick={() => choose(i)}
      >
       {option.text}
      </button>
     ))}
    </div>
   )}
   {task.feedback && (
    <p className={`dl-feedback${task.feedback.ok ? ' dl-feedback--ok' : ''}`}>
     {task.feedback.text}
    </p>
   )}
   <Actions nav={nav} end={spec.end} restart={spec.restart} locked={!task.solved} />
  </>
 );
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
   <Actions nav={nav} next={spec.next} end={spec.end} restart={spec.restart} />
  </>
 );
}

interface ActionsProps {
 nav: StepNav;
 next?: string;
 end?: string;
 restart?: boolean;
 /** Ćwiczenie jeszcze niezrobione: „dalej” czeka na dobrą odpowiedź. */
 locked?: boolean;
}

function Actions({ nav, next, end, restart, locked }: ActionsProps) {
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
    disabled={(isCourseEnd && !restart) || locked}
   >
    {label}
   </button>
  </div>
 );
}
