// Strona „Symulator ARP”: jeden scenariusz krok po kroku na wspólnym szablonie ekranu.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ARP } from '../content/arp';
import { assertCourse } from '../engine/check';
import { LessonShell } from '../ui/LessonShell';
import '../ui/tokens.css';
import '../ui/sim.css';

if (import.meta.env.DEV) assertCourse(ARP);

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <LessonShell course={ARP} />
 </StrictMode>
);
