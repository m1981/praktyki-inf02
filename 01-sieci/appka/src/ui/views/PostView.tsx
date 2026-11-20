import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../diagram/usePrefersReducedMotion';

/** Miejsce na drodze przesyłki: przy Laptopie, przy bramie (Routerze) albo przy serwerze. */
export type Spot = 'laptop' | 'router' | 'server';

/** Przesyłka nad schematem: list albo koperta z jednym napisem. */
export interface Parcel {
 /** Napis na przesyłce, np. „Dla: Router”. */
 text: string;
 at: Spot;
 /** Skąd przesyłka przyjeżdża w tym kroku. Bez tego pola po prostu stoi w miejscu `at`. */
 from?: Spot;
 /** Napis pulsuje – kwestia mówi właśnie o nim. */
 pulse?: boolean;
 /** Mały podpis nad przesyłką: jak to się nazywa w sieci, np. „ramka”. */
 caption?: string;
}

/**
 * Scena „list za płot”: dwie działki, między nimi płot, a w płocie brama (Router). Nad urządzeniami
 * jedzie list albo koperta. Opis mówi tylko, CO widać w kroku – jak to narysować, wie ten widok.
 */
export interface PostSpec {
 type: 'post';
 /** Nazwy pięciu urządzeń od lewej: Laptop, Switch, Router, Switch, serwer. */
 names: readonly [string, string, string, string, string];
 /** Router: `off` – szary (jeszcze o nim nie mówimy), `lit` – złota ramka, bez pola – zwykły. */
 gate?: 'off' | 'lit';
 /** Działka serwera wyszarzona: Laptop nikogo tam nie zna. */
 farSideDim?: boolean;
 /** Laptop miga, a jego próba dotarcia wprost do serwera kończy się na płocie. */
 blocked?: boolean;
 letter?: Parcel;
 envelope?: Parcel;
 /** Pod schematem obok siebie: stara koperta, nowa koperta i jeden list. */
 compare?: {
  oldEnvelope: string;
  newEnvelope: string;
  letter: string;
  /** Podpisy nad kopertami i nad listem, np. „ramka” i „pakiet”. */
  captions?: { envelope: string; letter: string };
  /** Napisy wyróżnione kolorem – kwestia mówi właśnie o nich. */
  emphasis?: boolean;
 };
 /** Adresy pod nazwami urządzeń (w tej samej kolejności co `names`); puste miejsce = bez adresu. */
 addresses?: readonly (string | undefined)[];
 /** Pytanie do wszystkich na działce Laptopa (Broadcast) i odpowiedź bramy (Unicast). */
 arp?: { question: string; answer: string };
}

// --- Geometria (jednostki viewBox) ---
const VIEW = { w: 760, h: 300 };
const CARD = { y: 132, h: 46 };
const CARDS = [
 { x: 18, w: 112 },
 { x: 176, w: 96 },
 { x: 324, w: 112 },
 { x: 488, w: 96 },
 { x: 630, w: 112 }
];
const FENCE_X = 380;
const SPOT_X: Record<Spot, number> = { laptop: 74, router: 380, server: 686 };
const PARCEL_Y = 78;
const TRAVEL_MS = 1600;

/**
 * Pozycja przesyłki. Gdy krok podaje `from`, przesyłka startuje stamtąd i dojeżdża do `at`
 * (przejście CSS). Przy „ogranicz animacje” od razu stoi u celu.
 */
function useTravel(parcel: Parcel | undefined): number | undefined {
 const reducedMotion = usePrefersReducedMotion();
 const start = parcel && (reducedMotion ? parcel.at : (parcel.from ?? parcel.at));
 const [spot, setSpot] = useState(start);
 const from = parcel?.from;
 const at = parcel?.at;
 useEffect(() => {
  setSpot(reducedMotion ? at : (from ?? at));
  if (reducedMotion || from === undefined) return;
  // Dwie klatki: przeglądarka musi najpierw narysować przesyłkę w miejscu startu.
  let second = 0;
  const first = requestAnimationFrame(() => {
   second = requestAnimationFrame(() => setSpot(at));
  });
  return () => {
   cancelAnimationFrame(first);
   cancelAnimationFrame(second);
  };
 }, [from, at, reducedMotion]);
 return spot === undefined ? undefined : SPOT_X[spot];
}

export function PostView({ spec }: { spec: PostSpec }) {
 const dim = spec.farSideDim ? 0.3 : 1;
 return (
  <div className="sr-board ps-board">
   <svg
    viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
    className="ps"
    role="img"
    aria-label="Dwie sieci i Router"
   >
    {/* Działki */}
    <rect
     className="ps-plot ps-plot--near"
     x={6}
     y={104}
     width={FENCE_X - 16}
     height={104}
     rx={12}
    />
    <rect
     className="ps-plot ps-plot--far"
     x={FENCE_X + 10}
     y={104}
     width={VIEW.w - FENCE_X - 16}
     height={104}
     rx={12}
     opacity={dim}
    />
    {/* Płot */}
    <line className="ps-fence" x1={FENCE_X} y1={36} x2={FENCE_X} y2={CARD.y - 6} />
    <line className="ps-fence" x1={FENCE_X} y1={CARD.y + CARD.h + 26} x2={FENCE_X} y2={212} />
    <text className="ps-fence-label" x={FENCE_X} y={28} textAnchor="middle">
     płot
    </text>

    {/* Kable */}
    {CARDS.slice(0, -1).map((card, i) => (
     <line
      key={i}
      className="ps-cable"
      x1={card.x + card.w}
      y1={CARD.y + CARD.h / 2}
      x2={CARDS[i + 1].x}
      y2={CARD.y + CARD.h / 2}
      opacity={i >= 2 ? dim : 1}
     />
    ))}

    {/* Próba wprost do serwera kończy się na płocie */}
    {spec.blocked && (
     <g className="ps-blocked">
      <path d={`M ${SPOT_X.laptop} ${CARD.y - 4} Q 230 60 ${FENCE_X - 14} 84`} />
      {/* Dalszy ciąg drogi za płotem – szary, bo tam Laptop nie dociera. */}
      <path
       className="ps-blocked-far"
       d={`M ${FENCE_X + 14} 84 Q 530 60 ${SPOT_X.server} ${CARD.y - 4}`}
      />
      <text x={FENCE_X - 4} y={92} textAnchor="middle">
       ✕
      </text>
     </g>
    )}

    {/* Urządzenia */}
    {CARDS.map((card, i) => {
     const isGate = i === 2;
     const classes = [
      'ps-card',
      isGate && spec.gate === 'off' && 'ps-card--off',
      isGate && spec.gate === 'lit' && 'ps-card--lit',
      i === 0 && spec.blocked && 'ps-card--blink',
      // Cel, do którego Laptop chce się dostać.
      i === CARDS.length - 1 && spec.blocked && 'ps-card--target'
     ];
     return (
      <g key={i} className={classes.filter(Boolean).join(' ')} opacity={i >= 3 ? dim : 1}>
       <rect x={card.x} y={CARD.y} width={card.w} height={CARD.h} rx={9} />
       <text
        x={card.x + card.w / 2}
        y={CARD.y + (spec.addresses?.[i] ? 19 : CARD.h / 2 + 5)}
        textAnchor="middle"
       >
        {spec.names[i]}
       </text>
       {spec.addresses?.[i] && (
        <text className="ps-address" x={card.x + card.w / 2} y={CARD.y + 37} textAnchor="middle">
         {spec.addresses[i]}
        </text>
       )}
       {isGate && (
        <text
         className="ps-gate-label"
         x={card.x + card.w / 2}
         y={CARD.y + CARD.h + 18}
         textAnchor="middle"
        >
         brama
        </text>
       )}
      </g>
     );
    })}

    {spec.letter && (
     <ParcelShape
      key={`l-${spec.letter.from}-${spec.letter.at}`}
      kind="letter"
      parcel={spec.letter}
     />
    )}
    {spec.envelope && (
     <ParcelShape
      key={`e-${spec.envelope.text}-${spec.envelope.from}-${spec.envelope.at}`}
      kind="envelope"
      parcel={spec.envelope}
     />
    )}

    {spec.arp && (
     <g className="ps-arp">
      {/* Pytanie idzie do wszystkich na działce Laptopa i zatrzymuje się na bramie. */}
      <line className="ps-arp-ask" x1={SPOT_X.laptop} y1={228} x2={FENCE_X - 28} y2={228} />
      <polygon
       className="ps-arp-ask-head"
       points={`${FENCE_X - 30},220 ${FENCE_X - 14},228 ${FENCE_X - 30},236`}
      />
      <text
       className="ps-arp-ask-label"
       x={(SPOT_X.laptop + FENCE_X) / 2}
       y={221}
       textAnchor="middle"
      >
       {spec.arp.question}
      </text>
      <line className="ps-arp-reply" x1={FENCE_X - 16} y1={266} x2={SPOT_X.laptop + 14} y2={266} />
      <polygon
       className="ps-arp-reply-head"
       points={`${SPOT_X.laptop + 16},258 ${SPOT_X.laptop},266 ${SPOT_X.laptop + 16},274`}
      />
      <text
       className="ps-arp-reply-label"
       x={(SPOT_X.laptop + FENCE_X) / 2}
       y={259}
       textAnchor="middle"
      >
       {spec.arp.answer}
      </text>
     </g>
    )}

    {spec.compare && (
     <g className={`ps-compare${spec.compare.emphasis ? ' ps-compare--emphasis' : ''}`}>
      <StillParcel
       kind="envelope"
       x={135}
       text={spec.compare.oldEnvelope}
       caption={spec.compare.captions?.envelope}
       muted
      />
      <StillParcel
       kind="envelope"
       x={380}
       text={spec.compare.newEnvelope}
       caption={spec.compare.captions?.envelope}
      />
      <StillParcel
       kind="letter"
       x={625}
       text={spec.compare.letter}
       caption={spec.compare.captions?.letter}
      />
     </g>
    )}
   </svg>
  </div>
 );
}

type ParcelKind = 'letter' | 'envelope';
const SIZE: Record<ParcelKind, { w: number; h: number }> = {
 letter: { w: 128, h: 40 },
 envelope: { w: 140, h: 50 }
};
/** Przesyłka rośnie z napisem: dłuższy napis („MAC odbiorcy: Serwer WWW”) musi się zmieścić. */
const widthOf = (kind: ParcelKind, text: string) => Math.max(SIZE[kind].w, text.length * 7.6 + 24);

/** Przesyłka nad schematem – jedzie między miejscami. */
function ParcelShape({ kind, parcel }: { kind: ParcelKind; parcel: Parcel }) {
 const x = useTravel(parcel);
 if (x === undefined) return null;
 // Przy krawędziach przesyłka nie może wyjść poza rysunek.
 const half = widthOf(kind, parcel.text) / 2;
 const cx = Math.min(Math.max(x, half + 4), VIEW.w - half - 4);
 return (
  <g
   className="ps-parcel"
   style={{ transform: `translate(${cx}px, ${PARCEL_Y}px)`, transitionDuration: `${TRAVEL_MS}ms` }}
  >
   <ParcelDrawing kind={kind} text={parcel.text} pulse={parcel.pulse} caption={parcel.caption} />
  </g>
 );
}

interface StillParcelProps {
 kind: ParcelKind;
 x: number;
 text: string;
 caption?: string;
 muted?: boolean;
}

/** Przesyłka w pasku porównania pod schematem – stoi w miejscu. */
function StillParcel({ kind, x, text, caption, muted }: StillParcelProps) {
 return (
  <g transform={`translate(${x} 266)`} opacity={muted ? 0.55 : 1}>
   <ParcelDrawing kind={kind} text={text} caption={caption} />
  </g>
 );
}

interface ParcelDrawingProps {
 kind: ParcelKind;
 text: string;
 pulse?: boolean;
 caption?: string;
}

function ParcelDrawing({ kind, text, pulse, caption }: ParcelDrawingProps) {
 const w = widthOf(kind, text);
 const { h } = SIZE[kind];
 return (
  <g className={`ps-${kind}${pulse ? ' ps-pulse' : ''}`}>
   {caption && (
    <text className="ps-caption" x={0} y={-h / 2 - 5} textAnchor="middle">
     {caption}
    </text>
   )}
   <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={kind === 'letter' ? 3 : 6} />
   {kind === 'envelope' && <path d={`M ${-w / 2} ${-h / 2} L 0 ${-2} L ${w / 2} ${-h / 2}`} />}
   <text className="ps-parcel-text" x={0} y={kind === 'envelope' ? 15 : 5} textAnchor="middle">
    {text}
   </text>
  </g>
 );
}
