import type { ReactNode } from 'react';
import type { Exercise, Step } from '../engine/types';

interface DialogStepProps {
 exercise: Exercise;
 step: Step;
 stepIndex: number;
 /** Element sterujący kroku (rozmowa albo zagadka). */
 children: ReactNode;
}

/**
 * Krok w stylu „rozmowa” (jak Laboratorium VLAN): kto mówi, jedna krótka kwestia, kropki postępu
 * i przyciski. Krok-akcja nie ma mówcy – jego tekst opisuje, co dzieje się na schemacie.
 */
export function DialogStep({ exercise, step, stepIndex, children }: DialogStepProps) {
 const speaker = step.speaker ? exercise.speakers?.[step.speaker] : undefined;
 return (
  <aside className="dl" aria-live="polite">
   <div className="dl-scene">{exercise.title}</div>
   {speaker && (
    <div className="dl-who">
     <span className="dl-avatar" style={{ background: speaker.color }}>
      {speaker.avatar}
     </span>
     <span>
      <b>{speaker.name}</b>
      {speaker.role}
     </span>
    </div>
   )}
   <p className={`dl-say${step.action ? ' dl-say--action' : ''}`}>{step.text}</p>
   <div className="dl-dots" aria-label={`Krok ${stepIndex + 1} z ${exercise.steps.length}`}>
    {exercise.steps.map((_, i) => (
     <i key={i} className={i <= stepIndex ? 'on' : undefined} />
    ))}
    <span>
     {stepIndex + 1} / {exercise.steps.length}
    </span>
   </div>
   {children}
  </aside>
 );
}
