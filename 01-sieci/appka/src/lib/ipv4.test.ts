import { describe, expect, it } from 'vitest';
import {
 broadcastOf,
 firstThreeOctets,
 formatIp,
 maskOf,
 networkOf,
 octetBits,
 parseIp,
 sameNetwork
} from './ipv4';

const ip = parseIp;

describe('ipv4', () => {
 it('parsuje i formatuje adres', () => {
  expect(formatIp(ip('10.10.10.105'))).toBe('10.10.10.105');
  expect(ip('255.255.255.255')).toBe(0xffffffff);
 });

 it('zamienia prefiks na maskę', () => {
  expect(formatIp(maskOf(24))).toBe('255.255.255.0');
  expect(formatIp(maskOf(26))).toBe('255.255.255.192');
  expect(formatIp(maskOf(30))).toBe('255.255.255.252');
 });

 it('liczy adres sieci i Broadcast', () => {
  expect(formatIp(networkOf(ip('10.10.10.105'), 26))).toBe('10.10.10.64');
  expect(formatIp(broadcastOf(ip('10.10.10.105'), 26))).toBe('10.10.10.127');
  expect(formatIp(broadcastOf(ip('10.10.10.105'), 24))).toBe('10.10.10.255');
 });

 it('porównuje sieci', () => {
  expect(sameNetwork(ip('10.10.10.105'), ip('10.10.10.130'), 24)).toBe(true);
  expect(sameNetwork(ip('10.10.10.105'), ip('10.10.10.130'), 25)).toBe(false);
 });

 it('rozkłada oktet na bity', () => {
  expect(octetBits(105)).toEqual([0, 1, 1, 0, 1, 0, 0, 1]);
 });

 it('podaje pierwsze trzy oktety', () => {
  expect(firstThreeOctets(ip('10.10.10.105'))).toBe('10.10.10');
 });
});
