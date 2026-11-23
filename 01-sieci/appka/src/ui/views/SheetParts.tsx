// Części widoku „schemat z arkusza” dla warstw 3+ (PYT-089a): wycinek arkusza jako zwykłe linijki
// (z ćwiczeniem „zaznacz linijki i sprawdź”) i uproszczone okno rezerwacji z panelu rutera.
import { useState } from 'react';
import { setTask } from '../taskState';

/** Linijka wycinka arkusza: identyfikator (L1…) i tekst co do słowa. */
export interface SheetLine {
 id: string;
 text: string;
}

/** Pasek zakresu DHCP pod linijką: ostatnie liczby adresów od–do i zaznaczony adres. */
export interface PoolSpec {
 /** Pod którą linijką. */
 after: string;
 from: number;
 to: number;
 mark: number;
}

export interface LinesSpec {
 title: string;
 items: readonly SheetLine[];
 lit?: readonly string[];
 pool?: PoolSpec;
}

/** Ćwiczenie „kliknij linijki”: uczeń zaznacza kilka linijek, potem „Sprawdź”. */
export interface LinesTask {
 kind: 'lines';
 answer: readonly string[];
 /** Napis na przycisku sprawdzania. */
 check: string;
 /** Reakcja: zaznaczona linijka spoza odpowiedzi. */
 wrong: string;
 /** Reakcja: brakuje dokładnie jednej linijki – tej z `missingOneId`. */
 missingOne: string;
 missingOneId: string;
 /** Reakcja: brakuje więcej linijek. */
 missingMore: string;
}

/** Okno rezerwacji w panelu rutera (napisy jak w panelu TP-Link, mapa-menu-urzadzen.md). */
export interface ReservationSpec {
 /** `list` – lista podłączonych otwarta; `picked` – karta wybrana; `fixed` – adres z arkusza. */
 stage: 'list' | 'picked' | 'fixed';
 labels: { title: string; mac: string; ip: string; view: string; save: string; list: string };
 device: { name: string; mac: string; ip: string };
 /** Adres wpisany w pole po poprawce. */
 fixedIp: string;
 /** Dopisek „przykład” przy zmyślonych danych. */
 example: string;
}

export function Lines({ spec, task }: { spec: LinesSpec; task?: LinesTask }) {
 const [chosen, setChosen] = useState<string[]>([]);
 const lit = new Set(spec.lit ?? []);

 const toggle = (id: string) => {
  setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  setTask({ solved: false });
 };
 const check = () => {
  if (!task) return;
  const extra = chosen.filter((id) => !task.answer.includes(id));
  const missing = task.answer.filter((id) => !chosen.includes(id));
  if (extra.length > 0) setTask({ solved: false, feedback: { text: task.wrong, ok: false } });
  else if (missing.length === 1 && missing[0] === task.missingOneId)
   setTask({ solved: false, feedback: { text: task.missingOne, ok: false } });
  else if (missing.length > 0)
   setTask({ solved: false, feedback: { text: task.missingMore, ok: false } });
  else setTask({ solved: true, feedback: { text: '✓ Dobrze.', ok: true } });
 };

 return (
  <section className="sh-excerpt sh-lines">
   <h3>{spec.title}</h3>
   <ul>
    {spec.items.map((line) => (
     <li key={line.id}>
      {task ? (
       <button
        type="button"
        className="sh-line-pick"
        data-line={line.id}
        data-ok={task.answer.includes(line.id) ? '1' : '0'}
        aria-pressed={chosen.includes(line.id)}
        onClick={() => toggle(line.id)}
       >
        {line.text}
       </button>
      ) : (
       <span className={lit.has(line.id) ? 'sh-lit' : undefined}>{line.text}</span>
      )}
      {spec.pool?.after === line.id && <Pool pool={spec.pool} />}
     </li>
    ))}
   </ul>
   {task && (
    <button type="button" className="sim-btn sh-check" data-check onClick={check}>
     {task.check}
    </button>
   )}
  </section>
 );
}

function Pool({ pool }: { pool: PoolSpec }) {
 const cells = Array.from({ length: pool.to - pool.from + 1 }, (_, i) => pool.from + i);
 return (
  <span className="sh-pool" aria-hidden="true">
   {cells.map((n) => (
    <i key={n} className={n === pool.mark ? 'on' : undefined}>
     {n === pool.from || n === pool.to || n === pool.mark ? `.${n}` : ''}
    </i>
   ))}
  </span>
 );
}

export function Reservation({ spec }: { spec: ReservationSpec }) {
 const { labels, device, stage } = spec;
 const picked = stage !== 'list';
 return (
  <section className="sh-panel" aria-label={labels.title}>
   <h3>{labels.title}</h3>
   <div className="sh-panel-row">
    <span>{labels.mac}</span>
    <code className="sh-field">{picked ? device.mac : '--'}</code>
    <span className="sh-panel-btn">{labels.view}</span>
   </div>
   <div className="sh-panel-row">
    <span>{labels.ip}</span>
    <code
     className={`sh-field${stage === 'picked' ? ' sh-field--warn' : ''}${
      stage === 'fixed' ? ' sh-field--ok' : ''
     }`}
    >
     {stage === 'fixed' ? spec.fixedIp : picked ? device.ip : ''}
    </code>
    <span className="sh-panel-btn sh-panel-btn--save">{labels.save}</span>
   </div>
   {stage === 'list' && (
    <div className="sh-panel-list">
     <b>{labels.list}</b>
     <span className="sh-panel-device">
      {device.name} · {device.mac} · {device.ip}
     </span>
    </div>
   )}
   <small className="sh-example">{spec.example}</small>
  </section>
 );
}
