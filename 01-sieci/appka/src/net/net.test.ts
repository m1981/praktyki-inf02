import { describe, expect, it } from 'vitest';
import { arpReply, arpRequest, tablesAt } from './arp';
import { decideRoute } from './decide';
import { BROADCAST_MAC, isBroadcast } from './frame';
import { parseIp } from '../lib/ipv4';
import { floodPath, framePath, shortestPath } from './path';

const ip = parseIp;

describe('decideRoute – decyzja nadawcy', () => {
 const host = { ip: ip('192.168.20.10'), prefix: 24, gateway: ip('192.168.20.1') };

 it('cel w sieci nadawcy → bezpośrednio', () => {
  expect(decideRoute(host, ip('192.168.20.20')).outcome).toBe('direct');
 });

 it('cel poza siecią, brama w sieci → przez Router', () => {
  const d = decideRoute(host, ip('192.168.10.40'));
  expect(d.outcome).toBe('via-router');
  expect(d.gatewayInside).toBe(true);
 });

 it('cel poza siecią i brama poza siecią → nie ma komu oddać ramki', () => {
  const far = { ...host, ip: ip('192.168.20.100'), prefix: 28 };
  const d = decideRoute(far, ip('192.168.20.200'));
  expect(d.outcome).toBe('gateway-outside');
 });

 it('sieć celu liczona jest maską NADAWCY', () => {
  const d = decideRoute({ ...host, prefix: 16 }, ip('192.168.10.40'));
  expect(d.dstNet).toBe(ip('192.168.0.0'));
  expect(d.outcome).toBe('direct');
 });
});

describe('droga ramki po kablach', () => {
 // Dwa Switche połączone Routerem: a–s1–r–s2–b, do s1 podłączone jeszcze c.
 const wires = [
  { a: 'a', b: 's1' },
  { a: 'c', b: 's1' },
  { a: 's1', b: 'r' },
  { a: 'r', b: 's2' },
  { a: 'b', b: 's2' }
 ];

 it('najkrótsza droga idzie tylko po kablach', () => {
  expect(shortestPath(wires, 'a', 'b')).toEqual(['a', 's1', 'r', 's2', 'b']);
  expect(shortestPath(wires, 'a', 'a')).toEqual(['a']);
  expect(() => shortestPath(wires, 'a', 'x')).toThrow();
 });

 it('Unicast bezpośredni: kolejne skoki, wszystkie adresowane do celu', () => {
  expect(framePath(wires, 'a', 'c')).toEqual([
   { from: 'a', to: 's1', hop: 0, toward: 'c' },
   { from: 's1', to: 'c', hop: 1, toward: 'c' }
  ]);
 });

 it('Unicast przez bramę: do bramy i z powrotem po tym samym kablu', () => {
  const hops = framePath(wires, 'a', 'c', 'r');
  expect(hops.map((h) => `${h.from}>${h.to}`)).toEqual(['a>s1', 's1>r', 'r>s1', 's1>c']);
  expect(hops.map((h) => h.toward)).toEqual(['r', 'r', 'c', 'c']);
  expect(hops.map((h) => h.hop)).toEqual([0, 1, 2, 3]);
 });

 it('Broadcast: kopia na każdy kabel, jednocześnie na kablach w tej samej odległości', () => {
  const hops = floodPath(wires, 'a');
  expect(hops).toHaveLength(wires.length);
  expect(
   hops
    .filter((h) => h.hop === 1)
    .map((h) => h.to)
    .sort()
  ).toEqual(['c', 'r']);
 });
});

describe('ARP', () => {
 it('pytanie to Broadcast, odpowiedź to Unicast do pytającego', () => {
  const request = arpRequest('AA', 'Kto ma…?');
  expect(request.dstMac).toBe(BROADCAST_MAC);
  expect(isBroadcast(request)).toBe(true);
  const reply = arpReply('BB', 'AA', '…');
  expect(reply.dstMac).toBe('AA');
  expect(isBroadcast(reply)).toBe(false);
 });

 it('tablice rosną krok po kroku, a „nowy wpis” dotyczy tylko bieżącego kroku', () => {
  const steps = [
   {},
   { learns: { switchMac: [{ mac: 'AA', port: 'Fa0/1' }] } },
   { learns: { laptopArp: [{ ip: '1.2.3.4', mac: 'BB' }] } }
  ];
  expect(tablesAt(steps, 0)).toEqual({ arp: [], mac: [] });
  expect(tablesAt(steps, 1).mac).toEqual([{ entry: { mac: 'AA', port: 'Fa0/1' }, isNew: true }]);
  const last = tablesAt(steps, 2);
  expect(last.mac[0].isNew).toBe(false);
  expect(last.arp[0].isNew).toBe(true);
 });
});
