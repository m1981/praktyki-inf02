import { BROADCAST_MAC, type Frame } from '../sim/types';
import { macOwner, type ArpEntry, type MacEntry, type TableRow } from './scenario';

function MacCell({ mac }: { mac: string }) {
 const owner = macOwner(mac);
 return (
  <>
   <code>{mac}</code>
   {owner && <span className="sim-muted"> ({owner})</span>}
  </>
 );
}

export function FramePanel({ frame }: { frame?: Frame }) {
 return (
  <section className="sim-panel">
   <h3>📦 Ramka w tym kroku</h3>
   {frame ? (
    <table className="sim-table">
     <tbody>
      <tr>
       <th scope="row">Typ</th>
       <td>
        <strong>{frame.name}</strong>{' '}
        <span
         className={`sim-pill sim-pill--${frame.dstMac === BROADCAST_MAC ? 'broadcast' : 'unicast'}`}
        >
         {frame.dstMac === BROADCAST_MAC ? 'Broadcast' : 'Unicast'}
        </span>
       </td>
      </tr>
      <tr>
       <th scope="row">MAC nadawcy</th>
       <td>
        <MacCell mac={frame.srcMac} />
       </td>
      </tr>
      <tr>
       <th scope="row">MAC odbiorcy</th>
       <td>
        <MacCell mac={frame.dstMac} />
       </td>
      </tr>
      <tr>
       <th scope="row">Zawartość</th>
       <td>{frame.payload}</td>
      </tr>
     </tbody>
    </table>
   ) : (
    <p className="sim-muted">W tym kroku żadna ramka nie płynie po kablach.</p>
   )}
  </section>
 );
}

interface TablesPanelProps {
 arp: TableRow<ArpEntry>[];
 mac: TableRow<MacEntry>[];
}

export function TablesPanel({ arp, mac }: TablesPanelProps) {
 return (
  <section className="sim-panel">
   <h3>💻 Tablica ARP Laptopa</h3>
   <table className="sim-table">
    <thead>
     <tr>
      <th scope="col">Adres IP</th>
      <th scope="col">Adres MAC</th>
     </tr>
    </thead>
    <tbody>
     {arp.length === 0 && <EmptyRow />}
     {arp.map(({ entry, isNew }) => (
      <tr key={entry.ip} className={isNew ? 'sim-row--new' : undefined}>
       <td>
        <code>{entry.ip}</code>
       </td>
       <td>
        <code>{entry.mac}</code>
        {isNew && <NewBadge />}
       </td>
      </tr>
     ))}
    </tbody>
   </table>

   <h3>🔀 Tablica MAC Switcha</h3>
   <table className="sim-table">
    <thead>
     <tr>
      <th scope="col">Adres MAC</th>
      <th scope="col">Port</th>
     </tr>
    </thead>
    <tbody>
     {mac.length === 0 && <EmptyRow />}
     {mac.map(({ entry, isNew }) => (
      <tr key={entry.mac} className={isNew ? 'sim-row--new' : undefined}>
       <td>
        <MacCell mac={entry.mac} />
       </td>
       <td>
        <code>{entry.port}</code>
        {isNew && <NewBadge />}
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </section>
 );
}

function EmptyRow() {
 return (
  <tr>
   <td colSpan={2} className="sim-muted">
    (pusta)
   </td>
  </tr>
 );
}

function NewBadge() {
 return <span className="sim-pill sim-pill--new">nowy wpis</span>;
}
