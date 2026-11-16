import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Cctv, HardDrive, Laptop, Network, Printer, Router, type LucideIcon } from 'lucide-react';
import type { DeviceKind, DeviceRole, Side } from './types';
import type { DeviceNodeType } from './graph';

const ICONS: Record<DeviceKind, LucideIcon> = {
 laptop: Laptop,
 switch: Network,
 router: Router,
 nas: HardDrive,
 printer: Printer,
 camera: Cctv
};

const ROLE_TEXT: Record<DeviceRole, string> = {
 analyzes: '🧠 Analizuje',
 sends: '📤 Wysyła',
 receives: '📥 Odbiera',
 forwards: '🔀 Przełącza',
 drops: '🚫 Odrzuca',
 blocked: '⛔ Nie może wysłać'
};

const SIDES: { side: Side; position: Position }[] = [
 { side: 'top', position: Position.Top },
 { side: 'right', position: Position.Right },
 { side: 'bottom', position: Position.Bottom },
 { side: 'left', position: Position.Left }
];

// memo: React Flow re-renderuje węzły przy każdej zmianie widoku – karta zmienia się tylko z danymi.
export const DeviceNode = memo(function DeviceNode({ data }: NodeProps<DeviceNodeType>) {
 const { device, role, tone } = data;
 const Icon = ICONS[device.kind];
 const classes = [
  'sim-device',
  role && `sim-device--active sim-device--${role}`,
  tone && `sim-device--tone-${tone}`
 ];

 return (
  <div className={classes.filter(Boolean).join(' ')}>
   {/* Jeden niewidoczny punkt zaczepienia na każdym boku. Dzięki ConnectionMode.Loose
       (w Diagram.tsx) kabel może się do niego podłączyć z obu stron. */}
   {SIDES.map(({ side, position }) => (
    <Handle
     key={side}
     id={side}
     type="source"
     position={position}
     isConnectable={false}
     className="sim-handle"
    />
   ))}

   {device.ports &&
    SIDES.filter(({ side }) => device.ports?.[side]).map(({ side }) => (
     <span key={side} className={`sim-port sim-port--${side}`}>
      {device.ports?.[side]}
     </span>
    ))}

   <div className="sim-device__head">
    <span className="sim-device__icon">
     <Icon size={22} aria-hidden />
    </span>
    <div>
     <div className="sim-device__label">{device.label}</div>
     <div className="sim-device__ip">{device.ip ?? 'brak adresu IP'}</div>
    </div>
   </div>
   {device.mac && <div className="sim-device__foot">MAC: {device.mac}</div>}
   {device.note && <div className="sim-device__foot">{device.note}</div>}
   {role && <div className="sim-device__role">{ROLE_TEXT[role]}</div>}
  </div>
 );
});
