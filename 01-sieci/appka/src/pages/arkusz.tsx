// Strona „Arkusz krok po kroku”, etapy 1–2: sceny „rozmowa” i ćwiczenia na wspólnym szablonie.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ARKUSZ, ARKUSZ_FIGURE } from '../content/arkusz';
import { ExamFigure } from '../ui/ExamFigure';
import { LessonShell } from '../ui/LessonShell';
import '../ui/tokens.css';
import '../ui/sim.css';
import '../ui/maska.css';
import '../ui/dialog.css';
import '../ui/arkusz.css';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <LessonShell course={ARKUSZ} />
  <ExamFigure figure={ARKUSZ_FIGURE} />
 </StrictMode>
);
