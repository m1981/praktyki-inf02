import type { ReactNode } from 'react';
import { Control, Panel, View } from '../engine/registry';
import type { StepNav } from '../engine/nav';
import { hasTabs, type Course, type Exercise, type LegendItem, type Step } from '../engine/types';
import { useCourseNav } from '../engine/useCourseNav';
import { DialogStep } from './DialogStep';
import { COLOR_VARS, PACKET_COLORS } from './tokens';

// JEDYNE miejsce układu ekranu (audyt.md, rozdz. 5.0): zakładki ćwiczeń · pytanie · scena po lewej ·
// tekst kroku i jeden element sterujący po prawej · panele pod sceną. Wzrok nie opuszcza jednego
// obszaru.
// Szablon nie zna ARP ani masek: pokazuje to, co opisują dane kursu (`content/`).
export function LessonShell({ course }: { course: Course }) {
 const { state, dispatch, isFree } = useCourseNav(course);
 const { exercises, freeMode } = course;
 const Free = freeMode?.component;

 return (
  <div className="sim" style={COLOR_VARS}>
   {hasTabs(course) && (
    <nav className="sr-tabs" aria-label={course.title}>
     {exercises.map((ex, i) => (
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
     {freeMode && (
      <button
       type="button"
       className="sr-tab"
       aria-current={isFree ? 'step' : undefined}
       onClick={() => dispatch({ type: 'GOTO', ex: exercises.length })}
      >
       {freeMode.tab}
      </button>
     )}
    </nav>
   )}

   {isFree && Free ? (
    <Free />
   ) : (
    <ExerciseScreen
     exercise={exercises[state.ex]}
     // runId zmienia się z każdym krokiem → animacja ramek startuje od początku.
     runId={state.ex * 10 + state.step}
     nav={{
      stepIndex: state.step,
      atStart: state.ex === 0 && state.step === 0,
      isLastStep: state.step === exercises[state.ex].steps.length - 1,
      nextTitle: exercises[state.ex + 1]?.code ?? freeMode?.name,
      next: () => dispatch({ type: 'NEXT' }),
      prev: () => dispatch({ type: 'PREV' }),
      reset: () => dispatch({ type: 'RESET' }),
      restart: () => dispatch({ type: 'GOTO', ex: 0 }),
      setStep: (step) => dispatch({ type: 'SET_STEP', step })
     }}
    />
   )}
  </div>
 );
}

interface ExerciseScreenProps {
 exercise: Exercise;
 runId: number;
 nav: StepNav;
}

function ExerciseScreen({ exercise: ex, runId, nav }: ExerciseScreenProps) {
 const step = ex.steps[nav.stepIndex];
 // Krok wstępny („Start”) nie liczy się do numeracji.
 const counted = ex.steps.filter((s) => !s.intro);
 const badge = step.intro ? 'Start' : `Krok ${counted.indexOf(step) + 1} z ${counted.length}`;

 return (
  <>
   {ex.legend && <Legend items={ex.legend} />}
   {ex.question && (
    <p className="sr-question">
     <span className="sr-code">{ex.code}</span> ❓ {ex.question}
    </p>
   )}

   <div className="sim-stage sim-stage--steps">
    <View spec={step.view} runId={runId} />

    {ex.style === 'dialog' ? (
     <DialogStep exercise={ex} step={step} stepIndex={nav.stepIndex}>
      <Control spec={step.control} nav={nav} />
     </DialogStep>
    ) : (
     <LessonStep exercise={ex} step={step} badge={badge} isLastStep={nav.isLastStep}>
      <Control spec={step.control} nav={nav} />
     </LessonStep>
    )}
   </div>

   {ex.notes && ex.notes.length > 0 && (
    <details className="sr-notes">
     <summary>📘 Dla dociekliwych: dlaczego tak?</summary>
     <dl>
      {ex.notes.map((note) => (
       <div key={note.q}>
        <dt>{note.q}</dt>
        <dd>{note.a}</dd>
       </div>
      ))}
     </dl>
    </details>
   )}

   {step.panels && step.panels.length > 0 && (
    <div className="sim-details">
     {step.panels.map((panel) => (
      <Panel key={panel.type} spec={panel} />
     ))}
    </div>
   )}
  </>
 );
}

interface LessonStepProps {
 exercise: Exercise;
 step: Step;
 badge: string;
 isLastStep: boolean;
 children: ReactNode;
}

/** Krok w stylu „lekcja”: numer kroku, tekst, pasek „Zmiana”, pytanie na następne ćwiczenie. */
function LessonStep({ exercise: ex, step, badge, isLastStep, children }: LessonStepProps) {
 return (
  <section className="sim-step" aria-live="polite">
   <div className="sim-step__meta">
    <span className="sim-badge">{badge}</span>
    {step.layer && <span className="sim-muted">{step.layer}</span>}
   </div>
   {step.title && <h2>{step.title}</h2>}
   <p>{step.text}</p>
   {step.change && (
    <p className="sr-change">
     <strong>Zmiana:</strong> {step.change}
    </p>
   )}
   {isLastStep && ex.nextQuestion && (
    <p className="sr-bridge">
     <strong>Na następne ćwiczenie:</strong> {ex.nextQuestion}
     {ex.nextLink && (
      <>
       {' '}
       <a href={ex.nextLink.href}>{ex.nextLink.label}</a>
      </>
     )}
    </p>
   )}
   {children}
  </section>
 );
}

function Legend({ items }: { items: LegendItem[] }) {
 return (
  <div className="sim-legend" aria-label="Legenda">
   {items.map((item) => (
    <span key={item.color}>
     <i style={{ background: PACKET_COLORS[item.color] }} />
     {` ${item.text}`}
    </span>
   ))}
  </div>
 );
}
