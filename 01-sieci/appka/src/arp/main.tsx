import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import NetworkSimulation from './NetworkSimulation';
import { assertScenario, SIMULATION_STEPS } from './scenario';
import '../ui/tokens.css';
import '../ui/sim.css';

if (import.meta.env.DEV) assertScenario(SIMULATION_STEPS);

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <NetworkSimulation />
 </StrictMode>
);
