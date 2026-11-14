import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { HardDrive, Laptop, Network, Router, type LucideIcon } from 'lucide-react';
import type { DeviceKind, DeviceRole, Side } from './simulationConfig';
import type { DeviceNodeType } from './graph';

const ICONS: Record<DeviceKind, LucideIcon> = {
 laptop: Laptop,
 switch: Network,
 router: Router,
 nas: HardDrive
};

const ROLE_TEXT: Record<DeviceRole, string> = {
 analyzes: '🧠 Analizuje',
 sends: '📤 Wysyła',
 receives: '📥 Odbiera',
 forwards: '🔀 Przełącza',
 drops: '🚫 Odrzuca'
};

const SIDES: { side: Side; position: Position }[] = [
 { side: 'top', position: Position.Top },
 { side: 'right', position: Position.Right },
 { side: 'bottom', position: Position.Bottom },
 { side: 'left', position: Position.Left }
];

// memo: React Flow re-renderuje węzły przy każdej zmianie widoku – karta zmienia się tylko z danymi.
export const DeviceNode = memo(function DeviceNode({ data }: NodeProps<DeviceNodeType>) {
 const { device, role } = data;
 const Icon = ICONS[device.kind];

 return (
  <div className={`sim-device${role ? ` sim-device--${role}` : ''}`}>
   {/* Jeden niewidoczny punkt zaczepienia na każdym boku. Dzięki ConnectionMode.Loose
          (w NetworkSimulation) kabel może się do niego podłączyć z obu stron. */}
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
