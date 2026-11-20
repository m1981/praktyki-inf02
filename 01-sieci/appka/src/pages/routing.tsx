// Strona „Routing: list za płot”: sceny w stylu „rozmowa” na wspólnym szablonie ekranu.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ROUTING } from '../content/routing';
import { LessonShell } from '../ui/LessonShell';
import '../ui/tokens.css';
import '../ui/sim.css';
import '../ui/maska.css';
import '../ui/dialog.css';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <LessonShell course={ROUTING} />
 </StrictMode>
);
