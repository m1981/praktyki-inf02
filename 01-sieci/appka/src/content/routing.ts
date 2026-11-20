// Routing: „List za płot” – sceny w stylu „rozmowa” (jak Laboratorium VLAN).
// Źródło kwestii: scenariusz-routing.md, wersja 1 (zatwierdzona, PYT-063a). Zmiana kwestii = najpierw
// zmiana w scenariuszu.
// Jedna myśl: na każdej bramie koperta jest nowa, a list ten sam.

import type { Course, ControlSpec, Exercise, Speaker, Step } from '../engine/types';
import { nameOf, shortNameOf } from '../model/glossary';
import { deviceIpText } from '../model/siec';
import type { Parcel, PostSpec, Spot } from '../ui/views/PostView';

const SPEAKERS: Record<string, Speaker> = {
 ola: { name: 'Ola', role: 'administratorka sieci', avatar: 'O', color: '#d9ecf9' },
 kier: { name: 'Kierownik IT', role: 'szef Oli', avatar: 'K', color: '#f6e3c8' },
 quiz: { name: 'Zagadka', role: 'dla Ciebie', avatar: '?', color: '#e3f2fd' }
};

// --- Schemat: pięć urządzeń w rzędzie, nazwy ze Słownika pojęć ---

const NAMES = [
 nameOf('laptop'),
 nameOf('switch'),
 shortNameOf('router'),
 nameOf('switch2'),
 nameOf('www')
] as const;

type Scene = Omit<PostSpec, 'type' | 'names'>;
const scene = (state: Scene): PostSpec => ({ type: 'post', names: NAMES, ...state });

// --- Scena 1: list i koperta, bez terminów sieciowych ---

const LETTER = `Do: ${nameOf('www')}`;
const TO_GATE = `Dla: ${shortNameOf('router')}`;
const TO_SERVER = `Dla: ${nameOf('www')}`;

const letter = (at: Spot, extra?: Partial<Parcel>): Parcel => ({ text: LETTER, at, ...extra });
const envelope = (text: string, at: Spot, extra?: Partial<Parcel>): Parcel => ({
 text,
 at,
 ...extra
});

const next: ControlSpec = { type: 'talk' };
const act = (label: string): ControlSpec => ({ type: 'talk', next: label });

const ola = (text: string, view: Scene, control: ControlSpec = next): Step => ({
 speaker: 'ola',
 text,
 view: scene(view),
 control
});
const kier = (text: string, view: Scene): Step => ({
 speaker: 'kier',
 text,
 view: scene(view),
 control: next
});
/** Krok-akcja: nikt nie mówi, na schemacie coś się dzieje. */
const action = (text: string, view: Scene): Step => ({
 action: true,
 text,
 view: scene(view),
 control: next
});

const END_1 = 'Zobacz to samo w sieci ▶';

const SCENE_1: Exercise = {
 code: '1',
 title: 'List za płot',
 style: 'dialog',
 speakers: SPEAKERS,
 steps: [
  ola('Dwie sieci – dwie działki. Między nimi płot.', { gate: 'off' }),
  kier('Mój laptop nie otwiera strony z serwera 😩', { gate: 'off', blocked: true }),
  ola('Bo serwer stoi za płotem. Tam Laptop nikogo nie zna.', { gate: 'off', farSideDim: true }),
  ola('Ale w płocie jest brama – Router.', { gate: 'lit', farSideDim: true }),
  ola('Laptop pisze list do serwera.', { farSideDim: true, letter: letter('laptop') }),
  ola(
   'I wkłada go do koperty – dla bramy.',
   { farSideDim: true, envelope: envelope(TO_GATE, 'laptop') },
   act('✉️ Wyślij ▶')
  ),
  action('Koperta jedzie do Routera…', {
   farSideDim: true,
   envelope: envelope(TO_GATE, 'router', { from: 'laptop' })
  }),
  kier('Do Routera? Przecież list jest do serwera 🤨', {
   farSideDim: true,
   envelope: envelope(TO_GATE, 'router', { pulse: true })
  }),
  ola('Koperta mówi tylko, kto odbierze ją teraz.', {
   farSideDim: true,
   envelope: envelope(TO_GATE, 'router')
  }),
  ola(
   'A dokąd list jedzie naprawdę – to jest w środku.',
   { farSideDim: true, envelope: envelope(TO_GATE, 'router') },
   act('✂️ Otwórz kopertę ▶')
  ),
  action('Router otwiera kopertę i czyta list…', {
   farSideDim: true,
   letter: letter('router', { pulse: true })
  }),
  ola(
   'Serwer jest po drugiej stronie bramy.',
   { letter: letter('router') },
   act('✉️ Nowa koperta ▶')
  ),
  action('Router wkłada list do nowej koperty…', {
   envelope: envelope(TO_SERVER, 'server', { from: 'router' })
  }),
  kier('Czyli koperta inna – a list ten sam? 🙂', {
   envelope: envelope(TO_SERVER, 'server'),
   compare: { oldEnvelope: TO_GATE, newEnvelope: TO_SERVER, letter: LETTER }
  }),
  ola('Właśnie tak. Na każdej bramie nowa koperta.', {
   envelope: envelope(TO_SERVER, 'server'),
   compare: { oldEnvelope: TO_GATE, newEnvelope: TO_SERVER, letter: LETTER }
  }),
  {
   speaker: 'quiz',
   text: 'Co zmienił Router?',
   view: scene({
    envelope: envelope(TO_SERVER, 'server'),
    compare: { oldEnvelope: TO_GATE, newEnvelope: TO_SERVER, letter: LETTER }
   }),
   control: {
    type: 'quiz',
    end: END_1,
    options: [
     {
      text: 'A) Adres na liście.',
      feedback: 'Nie – list dojechał nietknięty. Zmieniła się koperta.'
     },
     {
      text: 'B) Kopertę.',
      feedback: 'Właśnie tak. Zobacz, jak to się nazywa w sieci.',
      correct: true
     }
    ]
   }
  }
 ]
};

// --- Scena 2: ta sama droga nazwana po sieciowemu ---
// List = pakiet, adres na liście = adres IP, koperta = ramka, napis na kopercie = adres MAC.

const GATE_IP = deviceIpText('router');
const SERVER_IP = deviceIpText('www');
const ADDRESSES = [deviceIpText('laptop'), undefined, GATE_IP, undefined, SERVER_IP];

const PACKET = `IP odbiorcy: ${SERVER_IP}`;
const FRAME_TO_GATE = `MAC odbiorcy: ${shortNameOf('router')}`;
const FRAME_TO_SERVER = `MAC odbiorcy: ${nameOf('www')}`;

/** Stan sceny 2: zawsze z adresami na kartach. */
const net = (state: Scene): Scene => ({ addresses: ADDRESSES, ...state });
const packet = (at: Spot, extra?: Partial<Parcel>): Parcel => ({
 text: PACKET,
 caption: 'pakiet',
 at,
 ...extra
});
const frame = (text: string, at: Spot, extra?: Partial<Parcel>): Parcel => ({
 text,
 caption: 'ramka',
 at,
 ...extra
});
const FRAMES_AND_PACKET = {
 oldEnvelope: FRAME_TO_GATE,
 newEnvelope: FRAME_TO_SERVER,
 letter: PACKET,
 captions: { envelope: 'ramka', letter: 'pakiet' }
};

const END_2 = '↺ Wróć do listu i koperty';

const SCENE_2: Exercise = {
 code: '2',
 title: 'To samo w sieci',
 style: 'dialog',
 speakers: SPEAKERS,
 steps: [
  ola('Ta sama droga – teraz po sieciowemu 🤓', net({})),
  ola('List to pakiet. Adres na liście to adres IP.', net({ letter: packet('laptop') })),
  ola(
   'Koperta to ramka. Napis na kopercie to adres MAC.',
   net({ envelope: frame(FRAME_TO_GATE, 'laptop') })
  ),
  kier(
   'A skąd Laptop zna MAC Routera? 🤔',
   net({ envelope: frame(FRAME_TO_GATE, 'laptop', { pulse: true }) })
  ),
  ola(
   'Pyta wszystkich na swojej działce – to ARP.',
   net({ envelope: frame(FRAME_TO_GATE, 'laptop') }),
   act('📢 Zapytaj ▶')
  ),
  action(
   `Laptop pyta: „Kto ma ${GATE_IP}?” – odpowiada Router.`,
   net({
    envelope: frame(FRAME_TO_GATE, 'laptop'),
    arp: { question: `Kto ma ${GATE_IP}?`, answer: 'To ja!' }
   })
  ),
  ola(
   'Ramka do Routera – pakiet do serwera.',
   net({ envelope: frame(FRAME_TO_GATE, 'laptop') }),
   act('✉️ Wyślij ▶')
  ),
  action(
   'Ramka jedzie do Routera…',
   net({ envelope: frame(FRAME_TO_GATE, 'router', { from: 'laptop' }) })
  ),
  ola(
   'Router zdejmuje ramkę i czyta adres IP.',
   net({ letter: packet('router', { pulse: true }) }),
   act('✉️ Nowa ramka ▶')
  ),
  action(
   'Router wkłada pakiet do nowej ramki…',
   net({ envelope: frame(FRAME_TO_SERVER, 'server', { from: 'router' }) })
  ),
  kier(
   'Czyli MAC się zmienił – a IP nie?',
   net({ envelope: frame(FRAME_TO_SERVER, 'server'), compare: FRAMES_AND_PACKET })
  ),
  ola(
   'Zawsze. MAC – do najbliższej bramy. IP – do końca drogi.',
   net({
    envelope: frame(FRAME_TO_SERVER, 'server'),
    compare: { ...FRAMES_AND_PACKET, emphasis: true }
   })
  ),
  {
   speaker: 'quiz',
   text: 'Ramka minęła Router. Co jest w niej nowe?',
   view: scene(net({ envelope: frame(FRAME_TO_SERVER, 'server'), compare: FRAMES_AND_PACKET })),
   control: {
    type: 'quiz',
    end: END_2,
    restart: true,
    options: [
     {
      text: 'A) Adresy IP.',
      feedback: 'Nie tym razem – adresy IP jadą bez zmian do samego końca.'
     },
     {
      text: 'B) Adresy MAC.',
      feedback: 'Właśnie tak. Nowa ramka, nowe adresy MAC – pakiet ten sam.',
      correct: true
     }
    ]
   }
  }
 ]
};

export const ROUTING: Course = {
 id: 'routing',
 title: 'Sceny o routingu',
 exercises: [SCENE_1, SCENE_2]
};
