// Warstwa 9 „Cały arkusz” (scenariusz-arkusz-9.md, PYT-121a–125a): w miejscu schematu strona arkusza
// w układzie z PDF, zakreślacz w kolejności pracy, plakietki „zakładka + pułapka” na marginesie, pod
// stroną mały schemat z wierszem Kuby i ramką „maszyna”. Ćwiczenia: „linijka → zakładka” i filtr
// „jedno pytanie naraz” (PYT-088). Tekst strony przychodzi z `content/` – widok go nie zna.
import { useLayoutEffect, useRef, useState } from 'react';
import type { SheetCard, SheetDevice } from '../../model/arkusz';
import { setTask } from '../taskState';

/** Kawałek tekstu strony: zwykły tekst albo fragment, który można zakreślić (F1…, U2…). */
export type PageSeg = string | { id: string; text: string };

/** Blok strony: numer zadania, akapit, UWAGA (kursywa), punkt listy, stopka, schemat, podpis. */
export interface PageBlock {
 kind: 'task' | 'p' | 'uwaga' | 'li' | 'foot' | 'fig' | 'cap';
 segs?: readonly PageSeg[];
 /** Wcięcie punktu listy (0–3). */
 depth?: number;
 /** Treść spoza sieci – wyszarzona. */
 off?: boolean;
 /** Obrazek schematu (blok `fig`). */
 src?: string;
 alt?: string;
}

/** Plakietka fragmentu: zakładki, które go wyjaśniają, i pułapka. */
export interface PageFragment {
 tabs: readonly string[];
 trap: string;
}

/** Ćwiczenie „kliknij linijkę i wybierz zakładkę”. */
export interface PageTagTask {
 kind: 'tags';
 lines: readonly string[];
 options: readonly string[];
 /** Reakcja na złą zakładkę; {pułapka} i {zakładka} z plakietki fragmentu. */
 wrong: string;
 done: string;
}

/** Filtr „jedno pytanie naraz”: wybór zakładki zakreśla jej fragmenty (bez oceny). */
export interface PageFilterTask {
 kind: 'filter';
 options: readonly string[];
 /** Zakładka bez linijek (czyta schemat) i dopisek przy schemacie. */
 schemaTab: string;
 schemaNote: string;
}

export interface PageSpec {
 blocks: readonly PageBlock[];
 fragments: Readonly<Record<string, PageFragment>>;
 /** Zakreślane w tym kroku (zakreślacz „przejeżdża”). */
 lit?: readonly string[];
 /** Zakreślone wcześniej – blade. */
 done?: readonly string[];
 /** Fragmenty z plakietką na marginesie. */
 tags?: readonly string[];
 /** Plakietka, która miga (pułapka rodzi się w tym kroku). */
 blinkTag?: string;
 /** Do którego fragmentu strona się przewija (bez pola – pierwszy zakreślany albo góra strony). */
 focus?: string;
 task?: PageTagTask | PageFilterTask;
}

/** Co świeci na małym schemacie: karta, przełącznik, kable. */
export type MiniMark = SheetCard | 'cables';

export interface MiniSpec {
 lit?: readonly MiniMark[];
 /** Ramka „maszyna” przy stacji: karta w NAT (szara) albo mostkowana (niebieska). */
 vm?: 'nat' | 'bridged';
 vmBlink?: boolean;
}

const fill = (template: string, trap: string, tab: string) =>
 template.replace('{pułapka}', trap.replace(/^⚠\s*/, '')).replace('{zakładka}', tab);

export function SheetPage({
 spec,
 mini,
 kuba,
 kubaRow
}: {
 spec: PageSpec;
 mini?: MiniSpec;
 kuba?: SheetDevice;
 kubaRow?: boolean;
}) {
 const viewRef = useRef<HTMLDivElement>(null);
 const contentRef = useRef<HTMLDivElement>(null);
 const [tops, setTops] = useState<Record<string, number>>({});
 const [picked, setPicked] = useState<Record<string, 'ok' | 'bad'>>({});
 const [menu, setMenu] = useState<{ id: string; top: number } | null>(null);
 const [filter, setFilter] = useState<string>();
 const task = spec.task;
 const tagTask = task?.kind === 'tags' ? task : undefined;
 const filterTask = task?.kind === 'filter' ? task : undefined;

 // Filtr: fragmenty wybranej zakładki zakreślone, reszta strony przygaszona.
 const filtered = filter
  ? Object.keys(spec.fragments).filter((id) => spec.fragments[id].tabs.includes(filter))
  : [];
 const lit = new Set(filterTask ? filtered : (spec.lit ?? []));
 const done = new Set(spec.done ?? []);
 const showTags = filterTask ? filtered : (spec.tags ?? []);
 const schemaLit = !!filterTask && filter === filterTask.schemaTab;
 const focus = filterTask
  ? (filtered[0] ?? (schemaLit ? 'fig' : undefined))
  : (spec.focus ?? spec.lit?.[0]);

 // Pozycje fragmentów w treści strony – do plakietek i przewijania.
 useLayoutEffect(() => {
  const content = contentRef.current;
  if (!content) return;
  // Położenie względem całej treści strony (offsetTop liczyłby od wcięcia punktu listy).
  const base = content.getBoundingClientRect().top;
  const next: Record<string, number> = {};
  content.querySelectorAll<HTMLElement>('[data-frag]').forEach((el) => {
   next[el.dataset.frag!] = el.getBoundingClientRect().top - base;
  });
  setTops(next);
 }, [spec.blocks]);

 useLayoutEffect(() => {
  const view = viewRef.current;
  if (!view) return;
  const top = focus ? (tops[focus] ?? 0) : 0;
  view.scrollTo({ top: Math.max(0, top - 60), behavior: 'smooth' });
 }, [focus, tops]);

 const choose = (id: string, tab: string) => {
  if (!tagTask) return;
  const frag = spec.fragments[id];
  const ok = frag.tabs.includes(tab);
  const next = { ...picked, [id]: ok ? ('ok' as const) : ('bad' as const) };
  setPicked(next);
  setMenu(null);
  const all = tagTask.lines.every((l) => next[l] === 'ok');
  setTask(
   ok
    ? { solved: all, feedback: { text: all ? tagTask.done : '✓ Dobrze.', ok: true } }
    : { solved: false, feedback: { text: fill(tagTask.wrong, frag.trap, frag.tabs[0]), ok: false } }
  );
 };

 // Plakietki jedna pod drugą: gdy dwa fragmenty są blisko, druga zjeżdża niżej.
 let floor = 0;
 const tagTops = showTags.map((id) => {
  const top = Math.max(tops[id] ?? 0, floor);
  floor = top + 58;
  return top;
 });

 const segment = (seg: PageSeg, i: number) => {
  if (typeof seg === 'string') return <span key={i}>{seg}</span>;
  const isTaskLine = tagTask?.lines.includes(seg.id);
  const cls = [
   'pg-hl',
   lit.has(seg.id) && 'on',
   !lit.has(seg.id) && done.has(seg.id) && 'done',
   isTaskLine && 'pg-pick',
   picked[seg.id]
  ]
   .filter(Boolean)
   .join(' ');
  if (isTaskLine) {
   return (
    <button
     key={i}
     type="button"
     className={cls}
     data-frag={seg.id}
     data-tagline={seg.id}
     data-ans={spec.fragments[seg.id].tabs.join('|')}
     onClick={(e) => {
      const base = contentRef.current?.getBoundingClientRect().top ?? 0;
      setMenu({ id: seg.id, top: e.currentTarget.getBoundingClientRect().bottom - base + 4 });
     }}
    >
     {seg.text}
    </button>
   );
  }
  return (
   <span key={i} className={cls} data-frag={seg.id}>
    {seg.text}
   </span>
  );
 };

 return (
  <div className={`pg${filterTask && filter ? ' pg--filter' : ''}`}>
   {filterTask && (
    <div className="pg-filter" role="group" aria-label="Zakładki">
     {filterTask.options.map((tab) => (
      <button
       key={tab}
       type="button"
       data-filter={tab}
       aria-pressed={filter === tab}
       onClick={() => {
        setFilter(tab);
        setTask({ solved: true });
       }}
      >
       {tab}
      </button>
     ))}
    </div>
   )}
   <div className="pg-view" ref={viewRef} data-scroll>
    <div className="pg-content" ref={contentRef}>
     <div className="pg-sheet">
      {spec.blocks.map((b, i) => {
       if (b.kind === 'fig') {
        return (
         <div key={i} className={`pg-fig${schemaLit ? ' on' : ''}`} data-frag="fig">
          <img src={b.src} alt={b.alt} />
          {schemaLit && <div className="pg-fig-note">{filterTask?.schemaNote}</div>}
         </div>
        );
       }
       const cls = [`pg-${b.kind}`, b.off && 'pg-off'].filter(Boolean).join(' ');
       const style = b.kind === 'li' ? { paddingLeft: `${16 + (b.depth ?? 0) * 26}px` } : undefined;
       return (
        <div key={i} className={cls} style={style}>
         {b.kind === 'li' && (
          <span className="pg-dash" style={{ left: `${(b.depth ?? 0) * 26}px` }}>
           –
          </span>
         )}
         {(b.segs ?? []).map(segment)}
        </div>
       );
      })}
     </div>
     <div className="pg-gutter">
      {showTags.map((id, k) => {
       const frag = spec.fragments[id];
       if (!frag) return null;
       return (
        <div
         key={id}
         className={`pg-tag${spec.blinkTag === id ? ' blink' : ''}`}
         style={{ top: `${tagTops[k]}px` }}
        >
         <span className="pg-pill">{frag.tabs.join(' · ')}</span>
         <span className="pg-pill pg-pill--trap">{frag.trap}</span>
        </div>
       );
      })}
     </div>
     {tagTask && menu && (
      <div className="pg-menu" style={{ top: `${menu.top}px` }}>
       {tagTask.options.map((tab) => (
        <button key={tab} type="button" data-tag={tab} onClick={() => choose(menu.id, tab)}>
         {tab}
        </button>
       ))}
      </div>
     )}
    </div>
   </div>
   <MiniSchema mini={mini} kuba={kuba} kubaRow={kubaRow} />
  </div>
 );
}

// --- Mały schemat (bez adresów) ---

const MINI_DEVICES: Record<SheetDevice, { x: number; w: number }> = {
 ruter: { x: 20, w: 150 },
 serwer: { x: 250, w: 160 },
 przelacznik: { x: 480, w: 90 },
 stacja: { x: 630, w: 100 }
};
const MINI_CARDS: Record<Exclude<SheetCard, 'przelacznik'>, { x: number; label: string; net: string }> = {
 'ruter-wan': { x: 28, label: 'WAN', net: 'fioletowa' },
 'ruter-lan': { x: 102, label: 'LAN', net: 'zielona' },
 'serwer-wan': { x: 258, label: 'WAN', net: 'zielona' },
 'serwer-lan1': { x: 340, label: 'LAN 1', net: 'niebieska' },
 'stacja-lan2': { x: 649, label: 'LAN 2', net: 'niebieska' }
};
const CARD_W = 62;
const LINE_Y = 38;
const MINI_CABLES = [
 { x1: 170, x2: 250, net: 'zielona' },
 { x1: 410, x2: 480, net: 'niebieska' },
 { x1: 570, x2: 630, net: 'niebieska' }
];

function MiniSchema({
 mini,
 kuba,
 kubaRow
}: {
 mini?: MiniSpec;
 kuba?: SheetDevice;
 kubaRow?: boolean;
}) {
 const lit = new Set(mini?.lit ?? []);
 const rowH = kubaRow ? 30 : 0;
 return (
  <svg
   className="pg-mini"
   viewBox={`0 0 804 ${66 + rowH}`}
   role="img"
   aria-label="Mały schemat: Ruter, Serwer, Przełącznik, Stacja robocza"
  >
   {MINI_CABLES.map((c, i) => (
    <line
     key={i}
     className={`pg-mini-cable pg-mini--${c.net}${lit.has('cables') ? ' lit' : ''}`}
     x1={c.x1}
     y1={LINE_Y}
     x2={c.x2}
     y2={LINE_Y}
    />
   ))}
   {(Object.keys(MINI_DEVICES) as SheetDevice[]).map((id) => {
    const d = MINI_DEVICES[id];
    const sw = id === 'przelacznik';
    return (
     <g key={id} className={sw ? `pg-mini--niebieska${lit.has('przelacznik') ? ' lit' : ''}` : ''}>
      <rect className="pg-mini-dev" x={d.x} y={6} width={d.w} height={58} rx={7} />
      <text x={d.x + d.w / 2} y={sw ? 41 : 19}>
       {sw ? 'Przełącznik' : id === 'ruter' ? 'Ruter' : id === 'serwer' ? 'Serwer' : 'Stacja robocza'}
      </text>
     </g>
    );
   })}
   {(Object.keys(MINI_CARDS) as (keyof typeof MINI_CARDS)[]).map((id) => {
    const c = MINI_CARDS[id];
    return (
     <g key={id} className={`pg-mini--${c.net}${lit.has(id) ? ' lit' : ''}`}>
      <rect className="pg-mini-card" x={c.x} y={26} width={CARD_W} height={28} rx={5} />
      <text x={c.x + CARD_W / 2} y={44}>
       {c.label}
      </text>
     </g>
    );
   })}
   {mini?.vm && (
    <g
     className={`pg-mini-vm pg-mini-vm--${mini.vm}${mini.vmBlink ? ' lit' : ''}`}
     aria-label={mini.vm === 'nat' ? 'Maszyna wirtualna: karta w NAT' : 'Maszyna wirtualna: karta mostkowana'}
    >
     <rect x={738} y={14} width={62} height={44} rx={6} />
     <text x={769} y={33}>
      maszyna
     </text>
     <text x={769} y={48}>
      {mini.vm === 'nat' ? 'NAT' : 'mostek'}
     </text>
    </g>
   )}
   {kubaRow && (
    <g className="sh-kuba-row">
     <line x1={0} y1={68} x2={804} y2={68} />
     {kuba && (
      <text
       className="sh-kuba"
       x={MINI_DEVICES[kuba].x + MINI_DEVICES[kuba].w / 2}
       y={90}
       textAnchor="middle"
       aria-label="Kuba"
      >
       🧑‍💻
      </text>
     )}
    </g>
   )}
  </svg>
 );
}
