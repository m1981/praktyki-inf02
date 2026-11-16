// Strona „Maska podsieci”: seria M1–M4 + Tryb swobodny na wspólnym szablonie ekranu.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MASKA } from '../content/maska';
import { FREE_MODE } from '../content/maska-swobodny';
import { assertCourse } from '../engine/check';
import type { Course } from '../engine/types';
import { MaskExplorer } from '../ui/free/MaskExplorer';
import { LessonShell } from '../ui/LessonShell';
import '../ui/tokens.css';
import '../ui/sim.css';
import '../ui/maska.css';

const course: Course = {
 ...MASKA,
 freeMode: {
  hash: 'swobodny',
  tab: '🛠️ Tryb swobodny',
  name: 'Tryb swobodny',
  component: () => <MaskExplorer content={FREE_MODE} />
 }
};

if (import.meta.env.DEV) assertCourse(course);

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <LessonShell course={course} />
 </StrictMode>
);
