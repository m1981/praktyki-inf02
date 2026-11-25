import { useLayoutEffect, useState, type KeyboardEvent } from 'react';
import {
 SHEET_CARDS,
 SHEET_NAMES,
 type SheetCard,
 type SheetDevice,
 type SheetNet
} from '../../model/arkusz';
import { resetTask, setTask, useTask } from '../taskState';
import {
 Lines,
 Reservation,
 Wizard,
 type LinesSpec,
 type LinesTask,
 type ReservationSpec,
 type WizardSpec
} from './SheetParts';

/** Pole karty z arkusza: adres, brama, DNS albo „uzyskiwane automatycznie”. */
export type Field = 'ip' | 'gw' | 'dns' | 'auto';
/** Kabel na schemacie: świat–Ruter, Ruter–Serwer, Serwer–Przełącznik, Przełącznik–Stacja. */
export type Cable = 'c-world' | 'c-green' | 'c-lan1' | 'c-stacja';
/** Strzałka nad schematem: brama Stacji, droga zablokowana, wyjście Serwera w świat. */
export type Arrow = 'gw' | 'blocked' | 'out';
/** Co może pulsować: karta, urządzenie, kabel, adres przy karcie, strzałka. */
export type Mark = SheetCard | SheetDevice | Cable | `addr:${SheetCard}` | `arrow:${Arrow}`;

/** Jeden wiersz wycinka arkusza: karta i jej nagłówek, np. „Stacja, karta „LAN 2””. */
export interface ExcerptRow {
 card: SheetCard;
 heading: string;
}

/** Ćwiczenie „kliknij kartę”: klikalne są `targets`, dobre są wszystkie z `answer`. */
export interface PickTask {
 kind: 'pick';
 targets: readonly SheetCard[];
 answer: readonly SheetCard[];
 /** Reakcja na złe kliknięcie (scenariusz). */
 wrong: string;
}

/** Wiersz tabeli adresów: karta, nazwa w tabeli i „o czym mówi linijka” do podpowiedzi. */
export interface TableRow {
 card: SheetCard;
 name: string;
 /** Miejscownik do podpowiedzi „Ta linijka mówi o {about}.” */
 about: string;
}

/** Ćwiczenie „tabela adresów”: linijka arkusza → pole tabeli (PYT-077a). */
export interface TableTask {
 kind: 'table';
 rows: readonly TableRow[];
 /** Podpowiedzi z polami {about}, {is}, {cell}. */
 hints: { row: string; column: string };
 /** Nagłówki tabeli. Kolor sieci karty to tło jej nazwy (wynik etapu 1). */
 head: { card: string; ip: string; gw: string; dns: string };
 /** Nazwy pól w podpowiedzi „To jest {is}, nie {cell}.” */
 fieldNames: Record<'ip' | 'gw' | 'dns', string>;
 /** Nazwy kolorów dla czytnika ekranu, np. „sieć niebieska”. */
 netNames: Record<SheetNet, string>;
}

/**
 * Schemat z arkusza (styczeń 2025): świat – Ruter – Serwer (dwie karty) – Przełącznik – Stacja
 * robocza. Opis mówi, CO widać w kroku; jak to narysować, wie ten widok.
 */
export interface SheetSpec {
 type: 'sheet';
 /** Sieci pokolorowane. */
 colored?: readonly SheetNet[];
 /** Ta sieć koloruje się w tym kroku – kolor rozlewa się po kolei. */
 spread?: SheetNet;
 pulse?: readonly Mark[];
 /** Adresy przy kartach: które pola pokazać. */
 shown?: Partial<Record<SheetCard, readonly Field[]>>;
 /** Ten adres właśnie przylatuje z arkusza do karty. */
 fly?: SheetCard;
 arrows?: readonly Arrow[];
 /** Napis nad strzałką bramy, np. adres bramy. */
 gwLabel?: string;
 /** Notatka przy Stacji, np. „DNS → serwer”. */
 note?: string;
 /** Wycinek arkusza pod schematem. */
 excerpt?: {
  title: string;
  rows: readonly ExcerptRow[];
  /** Pola podświetlone: `karta:pole`. */
  lit?: readonly `${SheetCard}:${Field}`[];
  dim?: boolean;
  /** Napisy pól jak w arkuszu. */
  labels: Record<Field, string>;
 };
 task?: PickTask | TableTask | LinesTask;
 /** Sieci pokolorowane po dobrze zrobionym ćwiczeniu. */
 solvedColored?: readonly SheetNet[];
 // --- warstwy 3+ (PYT-089a) ---
 /** Własne napisy pod kartą – zamiast pól z arkusza (np. „?”, przykładowy adres, MAC). */
 labels?: Partial<Record<SheetCard, readonly CardLabel[]>>;
 /** Adresy z arkusza przygaszone – tło, nie temat kroku. */
 shownDim?: boolean;
 /** Strzałka DHCP: interfejs LAN rutera ↔ karta „WAN” serwera; `run` – prośba i odpowiedź jadą teraz. */
 dhcp?: { label: string; run?: boolean };
 /** Na którym urządzeniu jesteśmy, np. „Jesteś na: ruter”. */
 youAreOn?: string;
 /** Polecenia przy serwerze, np. „ipconfig /release”. */
 commands?: readonly string[];
 /** Wycinek arkusza jako zwykłe linijki (zamiast `excerpt`). */
 lines?: LinesSpec;
 /** Okno rezerwacji w panelu rutera (zamiast wycinka). */
 reservation?: ReservationSpec;
 /** Mniejszy schemat – gdy pod nim stoją dwa bloki. */
 compact?: boolean;
 /** Strzałki „pytanie o nazwę” (DNS, warstwa 4). */
 asks?: readonly Ask[];
 /** Dymek nad schematem: pytanie, które zadaje stacja, np. „www.egzamin.local = ?”. */
 bubble?: string;
 /** Strzałka „przeglądarka” (warstwa 5): od komputera do panelu urządzenia, z wpisanym adresem. */
 browse?: { from: SheetCard; to: SheetCard; label: string };
 /**
  * Wiersz „gdzie jest Kuba” pod schematem (PYT-102a): sylwetka pod urządzeniem, przy którym Kuba
  * pracuje w tym kroku. `kubaRow` – wiersz jest na całej zakładce (stała wysokość schematu);
  * `kuba` – pod którym urządzeniem stoi sylwetka (bez pola – Kuba czyta arkusz, sylwetki nie ma).
  */
 kubaRow?: boolean;
 kuba?: SheetDevice;
 /** Okienko kreatora przełącznika (warstwa 6). */
 wizard?: WizardSpec;
}

/** Pytanie o nazwę: od karty do karty, w stronę świata albo do siebie (pętla). */
export interface Ask {
 from: SheetCard;
 to: SheetCard | 'world' | 'self';
 label?: string;
 /** Pytanie nie dochodzi – kończy się ✕ na serwerze (serwer nie przekazuje ruchu, warstwa 2). */
 blocked?: boolean;
}

/** Napis pod kartą: zwykły, ostrzeżenie (zły adres), dobrze (✓), przykład, przekreślony. */
export interface CardLabel {
 text: string;
 tone?: 'warn' | 'ok' | 'example' | 'strike' | 'frame';
}

// --- Geometria (jednostki viewBox) ---
const VIEW = { w: 960, h: 214 };
/** Wysokość wiersza „gdzie jest Kuba” pod schematem. */
const KUBA_ROW_H = 40;
const DEV_Y = 50;
const DEV_H = 100;
const CARD_Y = 92;
const CARD_H = 42;
const CARD_W = 78;
const LINE_Y = CARD_Y + CARD_H / 2;
const ADDR_Y = [170, 186, 202];

const DEVICES: Record<SheetDevice, { x: number; w: number }> = {
 ruter: { x: 110, w: 200 },
 serwer: { x: 360, w: 200 },
 przelacznik: { x: 610, w: 110 },
 stacja: { x: 770, w: 170 }
};
/** Karta przy lewej albo prawej krawędzi urządzenia (Przełącznik – całe urządzenie). */
const CARD_SIDE: Record<SheetCard, 'left' | 'right' | 'whole'> = {
 'ruter-wan': 'left',
 'ruter-lan': 'right',
 'serwer-wan': 'left',
 'serwer-lan1': 'right',
 przelacznik: 'whole',
 'stacja-lan2': 'left'
};

function cardBox(card: SheetCard) {
 const dev = DEVICES[SHEET_CARDS[card].device];
 const side = CARD_SIDE[card];
 if (side === 'whole') return { x: dev.x, y: DEV_Y, w: dev.w, h: DEV_H };
 const x = side === 'left' ? dev.x + 8 : dev.x + dev.w - CARD_W - 8;
 return { x, y: CARD_Y, w: CARD_W, h: CARD_H };
}
const centerOf = (card: SheetCard) => {
 const b = cardBox(card);
 return b.x + b.w / 2;
};

const WORLD = { cx: 40, rx: 32, ry: 24 };
const CABLES: Record<Cable, { x1: number; x2: number; net: SheetNet }> = {
 'c-world': { x1: WORLD.cx + WORLD.rx, x2: DEVICES.ruter.x, net: 'fioletowa' },
 'c-green': {
  x1: DEVICES.ruter.x + DEVICES.ruter.w,
  x2: DEVICES.serwer.x,
  net: 'zielona'
 },
 'c-lan1': {
  x1: DEVICES.serwer.x + DEVICES.serwer.w,
  x2: DEVICES.przelacznik.x,
  net: 'niebieska'
 },
 'c-stacja': {
  x1: DEVICES.przelacznik.x + DEVICES.przelacznik.w,
  x2: DEVICES.stacja.x,
  net: 'niebieska'
 }
};

/** Kolejność rozlewania się koloru w sieci (od Stacji, od Serwera, od Rutera). */
const SPREAD_ORDER: Record<SheetNet, readonly string[]> = {
 niebieska: ['stacja-lan2', 'c-stacja', 'przelacznik', 'c-lan1', 'serwer-lan1'],
 zielona: ['serwer-wan', 'c-green', 'ruter-lan'],
 fioletowa: ['ruter-wan', 'c-world', 'world']
};
const SPREAD_STEP_S = 0.45;

const netOf = (part: string): SheetNet | undefined => {
 if (part === 'world') return 'fioletowa';
 if (part in CABLES) return CABLES[part as Cable].net;
 if (part in SHEET_CARDS) return SHEET_CARDS[part as SheetCard].net;
 return undefined;
};

/** Pola karty, które ma arkusz (Serwer „WAN”: tylko „automatycznie”). */
export function fieldsOf(card: SheetCard): Field[] {
 const c = SHEET_CARDS[card];
 if (c.auto) return ['auto'];
 return [
  ...(c.cidr ? (['ip'] as const) : []),
  ...(c.gateway !== undefined ? (['gw'] as const) : []),
  ...(c.dns ? (['dns'] as const) : [])
 ];
}

/** Wartość pola tak, jak stoi w arkuszu. */
export function valueOf(card: SheetCard, field: Field): string {
 const c = SHEET_CARDS[card];
 if (field === 'ip') return c.cidr ?? '';
 if (field === 'gw') return c.gateway ?? 'brak';
 if (field === 'dns') return c.dns ?? '';
 return 'uzyskiwane automatycznie';
}

/** Krótki napis przy karcie na schemacie. */
function addressText(card: SheetCard, field: Field): string {
 if (field === 'ip') return valueOf(card, 'ip');
 if (field === 'gw') return `brama: ${valueOf(card, 'gw')}`;
 if (field === 'dns') return `DNS: ${valueOf(card, 'dns')}`;
 return 'automatycznie';
}

export function SheetView({ spec, runId }: { spec: SheetSpec; runId: number }) {
 // Nowy krok = nowe ćwiczenie: reakcja i „zrobione” od zera – przed narysowaniem, bez mignięcia.
 useLayoutEffect(() => resetTask(), [runId]);
 const task = useTask();
 const table = spec.task?.kind === 'table' ? spec.task : undefined;
 const linesTask = spec.task?.kind === 'lines' ? spec.task : undefined;
 const colored = new Set<SheetNet>([
  ...(spec.colored ?? []),
  ...(task.solved ? (spec.solvedColored ?? []) : [])
 ]);
 return (
  <div
   className={`sr-board sh-board${table ? ' sh-board--table' : ''}${spec.compact ? ' sh-board--compact' : ''}`}
  >
   {(spec.youAreOn || spec.bubble) && (
    <div className="sh-top">
     {spec.youAreOn && <div className="sh-on">{spec.youAreOn}</div>}
     {spec.bubble && <div className="sh-bubble">💬 {spec.bubble}</div>}
    </div>
   )}
   <Schema key={`schema-${runId}`} spec={spec} colored={colored} />
   {spec.reservation && <Reservation spec={spec.reservation} />}
   {spec.wizard && <Wizard spec={spec.wizard} />}
   {table ? (
    <TableTaskView key={`table-${runId}`} spec={spec} task={table} />
   ) : spec.lines ? (
    <Lines key={`lines-${runId}`} spec={spec.lines} task={linesTask} />
   ) : (
    spec.excerpt && <Excerpt excerpt={spec.excerpt} />
   )}
  </div>
 );
}

// --- Schemat ---

function Schema({ spec, colored }: { spec: SheetSpec; colored: Set<SheetNet> }) {
 const pick = spec.task?.kind === 'pick' ? spec.task : undefined;
 const [picked, setPicked] = useState<SheetCard[]>([]);
 const [wrong, setWrong] = useState<SheetCard>();
 const pulse = new Set<string>(spec.pulse ?? []);

 const onPick = (card: SheetCard) => {
  if (!pick) return;
  if (!pick.answer.includes(card)) {
   setWrong(card);
   setTask({ solved: false, feedback: { text: pick.wrong, ok: false } });
   return;
  }
  setWrong(undefined);
  const next = picked.includes(card) ? picked : [...picked, card];
  setPicked(next);
  const done = pick.answer.every((c) => next.includes(c));
  setTask(done ? { solved: true, feedback: { text: '✓ Dobrze.', ok: true } } : { solved: false });
 };

 /** Klasa koloru części schematu: pokolorowana sieć, kliknięta dobra karta, rozlewanie. */
 const paint = (part: string) => {
  const net = netOf(part);
  const on = net && (colored.has(net) || picked.includes(part as SheetCard));
  if (!net || !on) return { className: '', style: undefined };
  const order = spec.spread === net ? SPREAD_ORDER[net].indexOf(part) : -1;
  return {
   className: ` sh-net sh-net--${net}`,
   style: order >= 0 ? { transitionDelay: `${order * SPREAD_STEP_S}s` } : undefined
  };
 };

 return (
  <svg
   viewBox={`0 0 ${VIEW.w} ${VIEW.h + (spec.kubaRow ? KUBA_ROW_H : 0)}`}
   className="sh"
   role="img"
   aria-label="Schemat z arkusza: Ruter, Serwer, Przełącznik, Stacja robocza"
  >
   {/* Świat */}
   {(() => {
    const p = paint('world');
    return (
     <g className={`sh-world${p.className}`} style={p.style}>
      <ellipse cx={WORLD.cx} cy={LINE_Y} rx={WORLD.rx} ry={WORLD.ry} />
      <text x={WORLD.cx} y={LINE_Y + 5} textAnchor="middle">
       świat
      </text>
     </g>
    );
   })()}

   {/* Kable */}
   {(Object.keys(CABLES) as Cable[]).map((id) => {
    const c = CABLES[id];
    const p = paint(id);
    return (
     <line
      key={id}
      className={`sh-cable${p.className}${pulse.has(id) ? ' sh-pulse' : ''}`}
      style={p.style}
      x1={c.x1}
      y1={LINE_Y}
      x2={c.x2}
      y2={LINE_Y}
     />
    );
   })}

   {/* Urządzenia */}
   {(Object.keys(DEVICES) as SheetDevice[]).map((id) => {
    const d = DEVICES[id];
    const whole = id === 'przelacznik';
    const p = whole ? paint('przelacznik') : { className: '', style: undefined };
    const clickable = whole && pick?.targets.includes('przelacznik');
    return (
     <g
      key={id}
      className={[
       'sh-device',
       p.className,
       pulse.has(id) && 'sh-pulse',
       clickable && 'sh-pick',
       whole && wrong === 'przelacznik' && 'sh-wrong'
      ]
       .filter(Boolean)
       .join(' ')}
      style={p.style}
      {...(clickable ? pickProps('przelacznik', pick!, onPick) : {})}
     >
      <rect x={d.x} y={DEV_Y} width={d.w} height={DEV_H} rx={10} />
      <text x={d.x + d.w / 2} y={whole ? DEV_Y + DEV_H / 2 + 5 : DEV_Y + 21} textAnchor="middle">
       {SHEET_NAMES[id].nom}
      </text>
     </g>
    );
   })}

   {/* Karty */}
   {(Object.keys(CARD_SIDE) as SheetCard[])
    .filter((card) => CARD_SIDE[card] !== 'whole')
    .map((card) => {
     const b = cardBox(card);
     const p = paint(card);
     const clickable = pick?.targets.includes(card);
     return (
      <g
       key={card}
       className={[
        'sh-card',
        p.className,
        pulse.has(card) && 'sh-pulse',
        clickable && 'sh-pick',
        wrong === card && 'sh-wrong'
       ]
        .filter(Boolean)
        .join(' ')}
       style={p.style}
       {...(clickable ? pickProps(card, pick!, onPick) : {})}
      >
       <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={7} />
       <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 5} textAnchor="middle">
        {SHEET_CARDS[card].label}
       </text>
      </g>
     );
    })}

   {/* Adresy przy kartach */}
   {(Object.entries(spec.shown ?? {}) as [SheetCard, readonly Field[]][])
    .filter(([card]) => !spec.labels?.[card])
    .map(([card, fields]) => (
     <g
      key={card}
      className={[
       'sh-addr',
       spec.fly === card && 'sh-fly',
       pulse.has(`addr:${card}`) && 'sh-pulse',
       spec.shownDim && 'sh-addr--dim'
      ]
       .filter(Boolean)
       .join(' ')}
     >
      {fields.map((field, i) => (
       <text key={field} x={centerOf(card)} y={ADDR_Y[i]} textAnchor="middle">
        {addressText(card, field)}
       </text>
      ))}
     </g>
    ))}

   {/* Własne napisy pod kartami (warstwy 3+) */}
   {(Object.entries(spec.labels ?? {}) as [SheetCard, readonly CardLabel[]][]).map(
    ([card, items]) => (
     <g key={`l-${card}`} className={`sh-addr${pulse.has(`addr:${card}`) ? ' sh-pulse' : ''}`}>
      {items.map((item, i) => (
       <text
        key={i}
        className={item.tone ? `sh-label--${item.tone}` : undefined}
        x={centerOf(card)}
        y={ADDR_Y[i]}
        textAnchor="middle"
       >
        {item.text}
       </text>
      ))}
     </g>
    )
   )}

   <Arrows spec={spec} pulse={pulse} />

   {spec.commands?.map((cmd, i) => (
    <text key={cmd} className="sh-cmd" x={centerOf('serwer-lan1') + 50} y={18 + i * 17}>
     {cmd}
    </text>
   ))}

   {spec.note && (
    <text className="sh-note" x={centerOf('stacja-lan2') + 22} y={40}>
     {spec.note}
    </text>
   )}
  </svg>
 );
}

function pickProps(card: SheetCard, pick: PickTask, onPick: (card: SheetCard) => void) {
 return {
  role: 'button',
  tabIndex: 0,
  'data-pick': card,
  'data-ok': pick.answer.includes(card) ? '1' : '0',
  'aria-label': SHEET_CARDS[card].label || SHEET_NAMES.przelacznik.nom,
  onClick: () => onPick(card),
  onKeyDown: (e: KeyboardEvent) => {
   if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onPick(card);
   }
  }
 };
}

function Arrows({ spec, pulse }: { spec: SheetSpec; pulse: Set<string> }) {
 const arrows = new Set(spec.arrows ?? []);
 const stacja = centerOf('stacja-lan2');
 const lan1 = centerOf('serwer-lan1');
 const srvWan = centerOf('serwer-wan');
 const rutLan = centerOf('ruter-lan');
 const top = CARD_Y - 4;
 // Strzałki od Stacji wychodzą z górnej krawędzi urządzenia – nie przecinają jego nazwy.
 const fromStation = DEV_Y - 2;
 return (
  <>
   <defs>
    {(['niebieska', 'zielona', 'czerwona', 'ciemna', 'szara'] as const).map((c) => (
     <marker
      key={c}
      id={`sh-head-${c}`}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
     >
      <path d="M 0 0 L 10 5 L 0 10 z" className={`sh-head sh-head--${c}`} />
     </marker>
    ))}
   </defs>
   {arrows.has('gw') && (
    <g className={`sh-arrow sh-arrow--niebieska${pulse.has('arrow:gw') ? ' sh-pulse' : ''}`}>
     <path
      d={`M ${stacja} ${fromStation} C ${stacja} 22, ${lan1} 22, ${lan1} ${top}`}
      markerEnd="url(#sh-head-niebieska)"
     />
     {spec.gwLabel && (
      <text x={(stacja + lan1) / 2} y={22} textAnchor="middle">
       {spec.gwLabel}
      </text>
     )}
    </g>
   )}
   {arrows.has('blocked') && (
    <g className="sh-arrow sh-arrow--blocked">
     <path
      d={`M ${stacja} ${fromStation} C ${stacja} 4, ${rutLan} 4, ${rutLan} ${top}`}
      markerEnd="url(#sh-head-czerwona)"
     />
     <text
      className="sh-cross"
      x={DEVICES.serwer.x + DEVICES.serwer.w / 2}
      y={30}
      textAnchor="middle"
     >
      ✕
     </text>
    </g>
   )}
   {spec.browse && <BrowseArrow browse={spec.browse} />}
   {spec.kubaRow && <KubaRow at={spec.kuba} />}
   {(spec.asks ?? []).map((ask) => (
    <AskArrow key={`${ask.from}-${ask.to}`} ask={ask} />
   ))}
   {spec.dhcp && (
    <g className={`sh-arrow sh-dhcp${spec.dhcp.run ? ' sh-dhcp--run' : ''}`}>
     {/* Prośba: od karty „WAN” serwera do rutera; odpowiedź: z powrotem, trochę wyżej. */}
     <path
      className="sh-dhcp-ask"
      d={`M ${srvWan - 6} ${top} C ${srvWan - 6} 52, ${rutLan + 6} 52, ${rutLan + 6} ${top}`}
      markerEnd="url(#sh-head-zielona)"
     />
     <path
      className="sh-dhcp-reply"
      d={`M ${rutLan - 6} ${top} C ${rutLan - 6} 30, ${srvWan + 6} 30, ${srvWan + 6} ${top}`}
      markerEnd="url(#sh-head-zielona)"
     />
     <text x={(srvWan + rutLan) / 2} y={26} textAnchor="middle">
      {spec.dhcp.label}
     </text>
    </g>
   )}
   {arrows.has('out') && (
    <g className={`sh-arrow sh-arrow--zielona${pulse.has('arrow:out') ? ' sh-pulse' : ''}`}>
     <path
      d={`M ${srvWan} ${top} C ${srvWan} 40, ${rutLan} 40, ${rutLan} ${top}`}
      markerEnd="url(#sh-head-zielona)"
     />
    </g>
   )}
  </>
 );
}

// --- Wycinek arkusza (sceny) ---

function Excerpt({ excerpt }: { excerpt: NonNullable<SheetSpec['excerpt']> }) {
 const lit = new Set<string>(excerpt.lit ?? []);
 return (
  <section className={`sh-excerpt${excerpt.dim ? ' sh-excerpt--dim' : ''}`}>
   <h3>{excerpt.title}</h3>
   <ul>
    {excerpt.rows.map((row) => (
     <li key={row.card}>
      <b>{row.heading}:</b>{' '}
      {fieldsOf(row.card).map((field, i) => (
       <span key={field}>
        {i > 0 && ', '}
        <span className={lit.has(`${row.card}:${field}`) ? 'sh-lit' : undefined}>
         {excerpt.labels[field]} {field === 'auto' ? '' : valueOf(row.card, field)}
        </span>
       </span>
      ))}
     </li>
    ))}
   </ul>
  </section>
 );
}

// --- Ćwiczenie „tabela adresów” ---

type Column = 'ip' | 'gw' | 'dns';
const COLUMNS: readonly Column[] = ['ip', 'gw', 'dns'];
type Tile = `${SheetCard}:${Field}`;

/** Do których pól tabeli należy linijka: „automatycznie” wypełnia cały wiersz. */
const cellsOf = (tile: Tile): string[] => {
 const [card, field] = tile.split(':') as [SheetCard, Field];
 return field === 'auto' ? COLUMNS.map((c) => `${card}:${c}`) : [tile];
};

function TableTaskView({ spec, task }: { spec: SheetSpec; task: TableTask }) {
 const excerpt = spec.excerpt!;
 const tiles: Tile[] = task.rows.flatMap((r) =>
  fieldsOf(r.card).map((f): Tile => `${r.card}:${f}`)
 );
 const [placed, setPlaced] = useState<Tile[]>([]);
 const [selected, setSelected] = useState<Tile>();
 const filled = new Map(placed.flatMap((t) => cellsOf(t).map((cell) => [cell, t] as const)));

 const choose = (tile: Tile) => {
  setSelected(tile);
  setTask({ solved: false });
 };

 const drop = (row: TableRow, col: Column) => {
  if (!selected) return;
  const [card, field] = selected.split(':') as [SheetCard, Field];
  const target = task.rows.find((r) => r.card === card)!;
  const fits = card === row.card && (field === 'auto' || field === col);
  if (!fits) {
   const text =
    card !== row.card
     ? task.hints.row.replace('{about}', target.about)
     : task.hints.column
        .replace('{is}', task.fieldNames[field as Column])
        .replace('{cell}', task.fieldNames[col]);
   setTask({ solved: false, feedback: { text, ok: false } });
   setSelected(undefined);
   return;
  }
  const next = [...placed, selected];
  setPlaced(next);
  setSelected(undefined);
  const done = next.length === tiles.length;
  setTask(done ? { solved: true, feedback: { text: '✓ Dobrze.', ok: true } } : { solved: false });
 };

 return (
  <div className="sh-work">
   <section className="sh-excerpt sh-excerpt--tiles">
    <h3>{excerpt.title}</h3>
    <ul>
     {task.rows.map((row) => (
      <li key={row.card}>
       <b>{excerpt.rows.find((r) => r.card === row.card)?.heading}:</b>
       {fieldsOf(row.card).map((field) => {
        const tile: Tile = `${row.card}:${field}`;
        const used = placed.includes(tile);
        return (
         <button
          key={field}
          type="button"
          className={`sh-tile${selected === tile ? ' sh-tile--on' : ''}`}
          data-tile={tile}
          disabled={used}
          aria-pressed={selected === tile}
          onClick={() => choose(tile)}
         >
          {excerpt.labels[field]} {field === 'auto' ? '' : valueOf(row.card, field)}
         </button>
        );
       })}
      </li>
     ))}
    </ul>
   </section>
   <table className="sh-table">
    <thead>
     <tr>
      <th scope="col">{task.head.card}</th>
      <th scope="col">{task.head.ip}</th>
      <th scope="col">{task.head.gw}</th>
      <th scope="col">{task.head.dns}</th>
     </tr>
    </thead>
    <tbody>
     {task.rows.map((row) => {
      const net = SHEET_CARDS[row.card].net;
      const has = new Set(fieldsOf(row.card).flatMap((f) => (f === 'auto' ? COLUMNS : [f])));
      // „Uzyskiwane automatycznie” to jedna linijka na cały wiersz – jedno szerokie pole.
      const auto = SHEET_CARDS[row.card].auto;
      return (
       <tr key={row.card}>
        <th scope="row" className={`sh-rowname sh-net--${net}`}>
         {row.name}
         <span className="sh-sr"> ({task.netNames[net]})</span>
        </th>
        {(auto ? (['ip'] as const) : COLUMNS).map((col) => {
         const cell = `${row.card}:${col}`;
         if (!has.has(col)) {
          return (
           <td key={col} className="sh-cell sh-cell--none">
            –
           </td>
          );
         }
         const tile = filled.get(cell);
         return (
          <td key={col} className="sh-cell" colSpan={auto ? 3 : undefined}>
           {tile ? (
            <span className="sh-filled">{shortValue(tile)}</span>
           ) : (
            <button
             type="button"
             className="sh-slot"
             data-cell={cell}
             aria-label={`${row.name}: ${task.head[col]}`}
             onClick={() => drop(row, col)}
            />
           )}
          </td>
         );
        })}
       </tr>
      );
     })}
    </tbody>
   </table>
  </div>
 );
}

function shortValue(tile: Tile): string {
 const [card, field] = tile.split(':') as [SheetCard, Field];
 return valueOf(card, field);
}

/** Strzałka „pytanie o nazwę”: przerywana, ciemna – kolor zostaje dla sieci. */
function AskArrow({ ask }: { ask: Ask }) {
 const from = centerOf(ask.from);
 const top = CARD_Y - 4;
 // Od stacji – z górnej krawędzi urządzenia, żeby nie przecinać nazwy.
 const y0 = ask.from === 'stacja-lan2' ? DEV_Y - 2 : top;
 const server = DEVICES.serwer.x + DEVICES.serwer.w / 2;
 let d: string;
 let label = { x: from, y: 30 };
 if (ask.to === 'self') {
  d = `M ${from - 12} ${top} C ${from - 34} 52, ${from + 34} 52, ${from + 12} ${top}`;
  label = { x: from, y: 48 };
 } else if (ask.to === 'world' && ask.blocked) {
  d = `M ${from} ${y0} C ${from} 8, ${server + 40} 8, ${server + 6} 26`;
  label = { x: server + 70, y: 14 };
 } else if (ask.to === 'world') {
  d = `M ${from} ${y0} C ${from} 30, ${WORLD.cx} 30, ${WORLD.cx} ${LINE_Y - WORLD.ry - 4}`;
  label = { x: (from + WORLD.cx) / 2, y: 26 };
 } else {
  const to = centerOf(ask.to);
  d = `M ${from} ${y0} C ${from} 22, ${to} 22, ${to} ${top}`;
  label = { x: (from + to) / 2, y: 22 };
 }
 return (
  <g className="sh-arrow sh-ask">
   <path d={d} markerEnd={ask.blocked ? undefined : 'url(#sh-head-ciemna)'} />
   {ask.blocked && (
    <text className="sh-cross" x={server} y={34} textAnchor="middle">
     ✕
    </text>
   )}
   {ask.label && (
    <text x={label.x} y={label.y} textAnchor="middle">
     {ask.label}
    </text>
   )}
  </g>
 );
}

/** Strzałka „przeglądarka”: ciągła, szara – od komputera do urządzenia, którego panel otwieramy. */
function BrowseArrow({ browse }: { browse: NonNullable<SheetSpec['browse']> }) {
 const topOf = (card: SheetCard) =>
  CARD_SIDE[card] === 'whole' || card === 'stacja-lan2' ? DEV_Y - 2 : CARD_Y - 4;
 const from = centerOf(browse.from);
 const to = centerOf(browse.to);
 const peak = Math.abs(from - to) > 200 ? 14 : 34;
 return (
  <g className="sh-arrow sh-browse">
   <path
    d={`M ${from} ${topOf(browse.from)} C ${from} ${peak}, ${to} ${peak}, ${to} ${topOf(browse.to)}`}
    markerEnd="url(#sh-head-szara)"
   />
   <text x={(from + to) / 2} y={peak + 4} textAnchor="middle">
    {browse.label}
   </text>
  </g>
 );
}

/** Wiersz „gdzie jest Kuba”: cienka linia i sylwetka dokładnie pod urządzeniem. */
function KubaRow({ at }: { at?: SheetDevice }) {
 const y = VIEW.h + KUBA_ROW_H / 2;
 const x = at ? DEVICES[at].x + DEVICES[at].w / 2 : undefined;
 return (
  <g className="sh-kuba-row">
   <line x1={0} y1={VIEW.h + 4} x2={VIEW.w} y2={VIEW.h + 4} />
   {x !== undefined && (
    <text className="sh-kuba" x={x} y={y + 10} textAnchor="middle" aria-label="Kuba">
     🧑‍💻
    </text>
   )}
  </g>
 );
}
