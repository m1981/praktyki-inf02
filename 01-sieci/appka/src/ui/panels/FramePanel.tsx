import { isBroadcast, type Frame } from '../../net/frame';
import { MacCell } from './MacCell';

/** Panel „ramka w tym kroku”: typ, adresy MAC i zawartość. */
export interface FrameSpec {
 type: 'frame';
 /** Bez ramki: w tym kroku nic nie płynie po kablach. */
 frame?: Frame;
}

export function FramePanel({ spec: { frame } }: { spec: FrameSpec }) {
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
        <span className={`sim-pill sim-pill--${isBroadcast(frame) ? 'broadcast' : 'unicast'}`}>
         {isBroadcast(frame) ? 'Broadcast' : 'Unicast'}
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
