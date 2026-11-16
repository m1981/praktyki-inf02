import { useEffect, useRef } from 'react';
import { BaseEdge, EdgeLabelRenderer, getStraightPath, type EdgeProps } from '@xyflow/react';
import { PACKET_COLORS, type PacketEdgeType } from './graph';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const HOP_MS = 1400; // czas przelotu ramki po jednym kablu
const PAUSE_MS = 800; // przerwa przed powtórką animacji

export function PacketEdge({
 id,
 sourceX,
 sourceY,
 targetX,
 targetY,
 data,
 markerStart,
 markerEnd
}: EdgeProps<PacketEdgeType>) {
 const reducedMotion = usePrefersReducedMotion();
 const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
 const traffic = data?.traffic;

 if (!traffic) return <BaseEdge id={id} path={path} className="sim-cable" />;

 const color = PACKET_COLORS[traffic.kind];
 return (
  <>
   <BaseEdge
    id={id}
    path={path}
    markerStart={markerStart}
    markerEnd={markerEnd}
    className="sim-cable sim-cable--active"
    style={{ stroke: color }}
   />
   {/* Przy „ogranicz animacje” w systemie zostaje sama strzałka – kierunek nadal widać. */}
   {!reducedMotion &&
    traffic.packets.map((p, i) => (
     <MovingPacket
      key={`${traffic.runId}-${i}`}
      path={path}
      color={color}
      reverse={p.reverse}
      hop={p.hop}
      hopCount={traffic.hopCount}
     />
    ))}
   <EdgeLabelRenderer>
    <div
     className="sim-edge-label"
     style={{
      transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
      borderColor: color
     }}
    >
     {traffic.label}
    </div>
   </EdgeLabelRenderer>
  </>
 );
}

interface MovingPacketProps {
 path: string;
 color: string;
 reverse: boolean;
 hop: number;
 hopCount: number;
}

// Kropka-ramka jadąca po kablu (SVG <animateMotion>).
// Ramki z kilkoma skokami (Laptop → Switch → Router → …) animujemy po kolei: każdy skok ma swoje
// okno czasowe w jednym wspólnym cyklu, więc ramka „dojeżdża” do urządzenia, zanim ruszy dalej.
function MovingPacket({ path, color, reverse, hop, hopCount }: MovingPacketProps) {
 const motionRef = useRef<SVGAnimateMotionElement>(null);
 const opacityRef = useRef<SVGAnimateElement>(null);

 const cycle = hopCount * HOP_MS + PAUSE_MS;
 const start = ((hop * HOP_MS) / cycle).toFixed(4);
 const end = (((hop + 1) * HOP_MS) / cycle).toFixed(4);

 // DLACZEGO begin="indefinite" + beginElement(): animacja SMIL dodana do strony później
 // liczy czas od otwarcia strony i wystartowałaby „w połowie”. Ręczny start = zawsze od zera.
 useEffect(() => {
  motionRef.current?.beginElement();
  opacityRef.current?.beginElement();
 }, []);

 return (
  <circle r={7} fill={color} stroke="#fff" strokeWidth={2} opacity={0}>
   <animateMotion
    ref={motionRef}
    path={path}
    dur={`${cycle}ms`}
    begin="indefinite"
    repeatCount="indefinite"
    calcMode="linear"
    keyPoints={reverse ? '1;1;0;0' : '0;0;1;1'}
    keyTimes={`0;${start};${end};1`}
   />
   <animate
    ref={opacityRef}
    attributeName="opacity"
    dur={`${cycle}ms`}
    begin="indefinite"
    repeatCount="indefinite"
    calcMode="discrete"
    values="0;1;0"
    keyTimes={`0;${start};${end}`}
   />
  </circle>
 );
}
