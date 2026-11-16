import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MaskExplorer from './MaskExplorer';
import '../sim/sim.css';
import './maska.css';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <MaskExplorer />
 </StrictMode>
);
