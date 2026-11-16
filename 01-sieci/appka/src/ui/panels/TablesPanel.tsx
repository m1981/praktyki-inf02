import type { ReactNode } from 'react';
import { genitiveOf } from '../../model/glossary';
import type { DeviceId } from '../../model/siec';
import type { ArpEntry, MacEntry, TableRow } from '../../net/arp';
import { MacCell } from './MacCell';

/** Tablica jednego urządzenia: ARP (komputer) albo MAC (Switch). */
export type DeviceTable =
 | { kind: 'arp'; device: DeviceId; rows: TableRow<ArpEntry>[] }
 | { kind: 'mac'; device: DeviceId; rows: TableRow<MacEntry>[] };

/** Panel „tablice urządzeń”: dowolna liczba tablic ARP i MAC, jedna pod drugą. */
export interface TablesSpec {
 type: 'tables';
 tables: DeviceTable[];
}

export function TablesPanel({ spec }: { spec: TablesSpec }) {
 return (
  <section className="sim-panel">
   {spec.tables.map((table) =>
    table.kind === 'arp' ? (
     <ArpTable key={`arp-${table.device}`} device={table.device} rows={table.rows} />
    ) : (
     <MacTable key={`mac-${table.device}`} device={table.device} rows={table.rows} />
    )
   )}
  </section>
 );
}

function ArpTable({ device, rows }: { device: DeviceId; rows: TableRow<ArpEntry>[] }) {
 return (
  <Table title={`💻 Tablica ARP ${genitiveOf(device)}`} columns={['Adres IP', 'Adres MAC']}>
   {rows.length === 0 && <EmptyRow />}
   {rows.map(({ entry, isNew }) => (
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
  </Table>
 );
}

function MacTable({ device, rows }: { device: DeviceId; rows: TableRow<MacEntry>[] }) {
 return (
  <Table title={`🔀 Tablica MAC ${genitiveOf(device)}`} columns={['Adres MAC', 'Port']}>
   {rows.length === 0 && <EmptyRow />}
   {rows.map(({ entry, isNew }) => (
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
  </Table>
 );
}

function Table({
 title,
 columns,
 children
}: {
 title: string;
 columns: [string, string];
 children: ReactNode;
}) {
 return (
  <>
   <h3>{title}</h3>
   <table className="sim-table">
    <thead>
     <tr>
      {columns.map((column) => (
       <th key={column} scope="col">
        {column}
       </th>
      ))}
     </tr>
    </thead>
    <tbody>{children}</tbody>
   </table>
  </>
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
