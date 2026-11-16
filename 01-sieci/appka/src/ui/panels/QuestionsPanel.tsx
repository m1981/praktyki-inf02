export interface Question {
 question: string;
 answer: string;
}

/** Panel „Sprawdź się”: pytania z odpowiedzią schowaną do kliknięcia. */
export interface QuestionsSpec {
 type: 'questions';
 items: Question[];
}

export function QuestionsPanel({ spec }: { spec: QuestionsSpec }) {
 return (
  <section className="sim-panel sim-questions">
   <h3>❓ Sprawdź się</h3>
   {spec.items.map((q) => (
    <details key={q.question}>
     <summary>{q.question}</summary>
     <p>{q.answer}</p>
    </details>
   ))}
  </section>
 );
}
