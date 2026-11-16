import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SeriesView from './SeriesView';
import '../sim/sim.css';
import './maska.css';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <SeriesView />
 </StrictMode>
);
