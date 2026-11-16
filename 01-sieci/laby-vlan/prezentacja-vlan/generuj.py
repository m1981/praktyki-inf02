import json, os
import os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'project')
BLUE='#2f6fb3'; ORANGE='#d9772b'; RED='#b03a2e'; GREEN='#1e7a45'; INK='#1f2430'; PANEL='#ebe7de'; GRAY='#a9a59a'

def pc(cx, cy, col, label, cls=''):
    return (f'<g class="{cls}"><rect x="{cx-60}" y="{cy-40}" width="120" height="78" rx="8" fill="{col}"/>'
            f'<rect x="{cx-48}" y="{cy-28}" width="96" height="50" rx="3" fill="#ffffff" fill-opacity="0.3"/>'
            f'<path d="M{cx} {cy+38}v16M{cx-24} {cy+56}h48" stroke="{INK}" stroke-width="6" stroke-linecap="round"/></g>'
            + (f'<text x="{cx}" y="{cy+98}" font-family="Inter" font-size="30" font-weight="600" fill="{INK}" text-anchor="middle">{label}</text>' if label else ''))

def office_and_panel():
    s = (f'<rect x="0" y="0" width="620" height="560" rx="18" fill="{PANEL}"/>'
         f'<text x="32" y="52" font-family="Space Grotesk" font-size="32" font-weight="700" fill="{INK}">Biuro</text>'
         f'<rect x="740" y="0" width="924" height="560" rx="18" fill="{PANEL}"/>'
         f'<text x="772" y="52" font-family="Space Grotesk" font-size="32" font-weight="700" fill="{INK}">Szafa sieciowa</text>'
         f'<rect x="800" y="86" width="820" height="64" rx="8" fill="{INK}"/>'
         f'<text x="1620" y="186" font-family="Inter" font-size="24" fill="#55534d" text-anchor="end">patch panel</text>')
    PCS = [('Bartek',140,200,BLUE),('Anna',400,200,BLUE),('Dorota',270,400,ORANGE),('Ewa',530,400,ORANGE)]
    for i,(n,x,y,c) in enumerate(PCS):
        px = 900 + i*190
        s += f'<rect x="{px-60}" y="104" width="120" height="28" rx="4" fill="{GRAY}"/>'
        tray = 540 - i*10; wall = 660 + i*12
        s += f'<path d="M{x} {y+56}V{tray}H{wall}V118H{px-60}" fill="none" stroke="{GRAY}" stroke-width="5" stroke-linejoin="round"/>'
    return s, PCS

def switch(x, y, w, ports):
    s = f'<rect x="{x}" y="{y}" width="{w}" height="72" rx="8" fill="{INK}"/>'
    for i,c in enumerate(ports):
        s += f'<rect x="{x+30+i*60}" y="{y+24}" width="40" height="24" rx="3" fill="{c or "#5a5955"}"/>'
    return s
def port_xy(x, y, i): return (x+50+i*60, y+24)

def cord(a, b, col, extra=''):
    (x1,y1),(x2,y2) = a,b
    return f'<path d="M{x1} {y1}C{x1} {y1+90} {x2} {y2-90} {x2} {y2}" fill="none" stroke="{col}" stroke-width="7" stroke-linecap="round" {extra}/>'

def svg(w, h, inner, label):
    return f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" aria-label="{label}" xmlns="http://www.w3.org/2000/svg">{inner}</svg>'

files = {}

# --- deck.json
files['deck.json'] = json.dumps({
 "v":5, "createdOnFiles":{"v":1,"at":"2026-11-16T19:40:00Z"}, "lists":"css",
 "format":{"v":1,"shared":["project/deck.css"]},
 "title":"Po co nam VLAN-y? Kłopot 2: pracownik zmienia dział",
 "order":["cover","sytuacja","przed-schemat","przed-kroki","przed-wynik","po-schemat","po-kroki","po-wynik","porownanie","wniosek"],
 "sections":{"s1":{"description":"Wprowadzenie: kto, co i dlaczego musi się zmienić.","start":"cover"},
             "s2":{"description":"Przed VLAN-ami: zmiana sieci oznacza przepięcie kabla.","start":"przed-schemat"},
             "s3":{"description":"Z VLAN-ami: zmiana sieci to jedna komenda na switchu.","start":"po-schemat"},
             "s4":{"description":"Porównanie i wniosek.","start":"porownanie"}},
 "cover":"cover",
 "faces":{"space-grotesk":{"family":"Space Grotesk","href":"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&display=swap"},
          "inter":{"family":"Inter","href":"https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap"},
          "jetbrains-mono":{"family":"JetBrains Mono","href":"https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..700&display=swap"}},
 "designSystems":[]}, ensure_ascii=False, indent=1)

files['deck.css'] = f"""section{{padding:128px;background:#f5f3ee;color:{INK};font-family:'Inter',sans-serif;display:flex;flex-direction:column;gap:40px}}
section.dark{{background:{INK};color:#f5f3ee;justify-content:center}}
section.bad{{background:{RED};color:#f5f3ee;justify-content:center}}
section.good{{background:{GREEN};color:#f5f3ee;justify-content:center}}
h1{{font-family:'Space Grotesk',sans-serif;font-size:104px;line-height:1.05;font-weight:700;margin:0}}
h2{{font-family:'Space Grotesk',sans-serif;font-size:64px;line-height:1.1;font-weight:700;margin:0}}
p{{font-size:32px;line-height:1.4;margin:0}}
.kicker{{font-size:28px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#a8521a}}
section.dark .kicker{{color:#f0a35e}}
section.bad .kicker, section.good .kicker{{color:#f5f3ee}}
.lead{{font-size:40px;line-height:1.35;width:1400px}}
.big{{font-family:'Space Grotesk',sans-serif;font-size:220px;font-weight:700;line-height:1}}
.facts{{font-size:40px;line-height:1.4}}
.steps{{display:flex;flex-direction:column;gap:28px}}
.step{{display:flex;gap:40px;align-items:baseline}}
.step .t{{font-family:'Space Grotesk',sans-serif;font-size:36px;font-weight:700;width:180px}}
.step .d{{font-size:36px;line-height:1.3;width:1440px}}
.steps.bad .t{{color:{RED}}}
.steps.good .t{{color:{GREEN}}}
.fragment{{opacity:0}}
.fragment.visible{{opacity:1}}
.code{{font-family:'JetBrains Mono',monospace;font-size:32px;background:{INK};color:#f5f3ee;padding:24px 36px;border-radius:12px}}
.caption{{font-size:28px;color:#55534d}}
table{{border-collapse:collapse;width:1664px}}
th, td{{font-size:32px;padding:18px 24px;text-align:left;border-bottom:2px solid #d9d5ca}}
th{{font-family:'Space Grotesk',sans-serif;font-weight:700}}
.c-bad{{color:{RED};font-weight:600}}
.c-good{{color:{GREEN};font-weight:600}}
.flip{{animation:flipIn .6s ease-out 1.2s both}}
.flip2{{animation:flipIn .6s ease-out 2.2s both}}
@keyframes flipIn{{from{{opacity:0}}to{{opacity:1}}}}
"""

S = {}
S['cover'] = f"""<section id="cover" class="dark" data-transition="fade">
<p class="kicker">Laboratorium VLAN · Kłopot 2</p>
<h1>Pracownik zmienia dział</h1>
<p class="lead">Ten sam problem w dwóch epokach: przed VLAN-ami i z VLAN-ami.</p>
<aside>Pokazujemy jeden codzienny scenariusz i porównujemy, ile pracy kosztował kiedyś, a ile dziś.</aside>
</section>"""

sit = (pc(330,190,BLUE,'Anna dziś') + f'<text x="330" y="370" font-family="Inter" font-size="30" fill="{BLUE}" font-weight="700" text-anchor="middle">sieć IT</text>'
       f'<text x="330" y="410" font-family="JetBrains Mono" font-size="26" fill="#55534d" text-anchor="middle">192.168.10.0/24</text>'
       f'<path d="M560 200H1060" stroke="{INK}" stroke-width="8"/><path d="M1060 176l40 24-40 24z" fill="{INK}"/>'
       f'<text x="830" y="170" font-family="Inter" font-size="28" fill="{INK}" text-anchor="middle">to samo biurko, ten sam kabel</text>'
       + pc(1330,190,ORANGE,'Anna od jutra') + f'<text x="1330" y="370" font-family="Inter" font-size="30" fill="#a8521a" font-weight="700" text-anchor="middle">sieć księgowości</text>'
       f'<text x="1330" y="410" font-family="JetBrains Mono" font-size="26" fill="#55534d" text-anchor="middle">192.168.20.0/24</text>')
S['sytuacja'] = f"""<section id="sytuacja">
<h2>Anna przechodzi z IT do księgowości</h2>
<p class="lead">Zostaje przy tym samym biurku, ale jej komputer musi trafić do innej sieci.</p>
{svg(1664,440,sit,'Komputer Anny przechodzi z sieci IT 192.168.10.0/24 do sieci księgowości 192.168.20.0/24, przy tym samym biurku.')}
<aside>Pytanie do grupy: co trzeba fizycznie zrobić, żeby komputer Anny znalazł się w innej sieci?</aside>
</section>"""

# before diagram
base, PCS = office_and_panel()
for n,x,y,c in PCS: base += pc(x,y,c,n)
SWI=(840,250); SWK=(840,420)
g = base + switch(*SWI,440,[BLUE,BLUE,None,None,None,None]) + switch(*SWK,440,[ORANGE,ORANGE,ORANGE,None,None,None])
g += f'<text x="1300" y="296" font-family="Inter" font-size="30" font-weight="700" fill="{BLUE}">switch IT</text>'
g += f'<text x="1300" y="466" font-family="Inter" font-size="30" font-weight="700" fill="#a8521a">switch księgowości</text>'
pp = lambda i: (900+i*190, 132)
g += cord(pp(0), port_xy(*SWI,0), BLUE)
g += cord(pp(1), port_xy(*SWI,1), RED, 'stroke-dasharray="14 12"')
g += cord(pp(2), port_xy(*SWK,1), ORANGE) + cord(pp(3), port_xy(*SWK,2), ORANGE)
g += cord(pp(1), port_xy(*SWK,0), ORANGE)
g += f'<text x="985" y="212" font-family="Inter" font-size="34" font-weight="700" fill="{RED}" text-anchor="end">①</text>'
g += f'<text x="825" y="470" font-family="Inter" font-size="34" font-weight="700" fill="#a8521a" text-anchor="end">②</text>'
S['przed-schemat'] = f"""<section id="przed-schemat">
<h2>Przed VLAN-ami: sieć wyznacza kabel</h2>
{svg(1664,560,g,'Szafa z dwoma switchami. Kabel Anny trzeba odpiąć od switcha IT i wpiąć do switcha księgowości.')}
<p class="caption">Każdy dział ma własny switch. <b>①</b> Odepnij kabel Anny od switcha IT, <b>②</b> wepnij go do switcha księgowości.</p>
<aside>Zwróć uwagę: kable w ścianach się nie zmieniają. Zmienia się patchcord w szafie, czyli to, do którego switcha trafia gniazdko Anny.</aside>
</section>"""

steps_before = [('0 min','Zgłoszenie: od jutra Anna pracuje w księgowości.'),
                ('+20 min','Technik szuka klucza i idzie do zamkniętej szafy.'),
                ('+10 min','Szuka, który z setek kabli to kabel Anny.'),
                ('+10 min','Odpina go od switcha IT i wpina do switcha księgowości, o ile jest wolny port.'),
                ('+15 min','Zmienia adres IP komputera Anny na adres z sieci księgowości.')]
def steps(lst, cls):
    out = f'<div class="steps {cls}">\n'
    for i,(t,d) in enumerate(lst):
        out += f'<div class="step fragment"><p class="t">{t}</p><p class="d">{d}</p></div>\n'
    return out + '</div>'
S['przed-kroki'] = f"""<section id="przed-kroki">
<h2>Przed VLAN-ami: co trzeba zrobić</h2>
{steps(steps_before,'bad')}
<aside>Klikaj, żeby odsłaniać kolejne kroki. Przy każdym zapytaj: czy da się to zrobić bez wstawania od biurka?</aside>
</section>"""

S['przed-wynik'] = f"""<section id="przed-wynik" class="bad">
<p class="kicker">Przed VLAN-ami</p>
<p class="big">≈ 1 godz.</p>
<p class="facts">Technik w szafie · 1 przepięty kabel · Anna bez sieci w trakcie</p>
<aside>A to tylko jedna osoba. W dużej firmie takie zgłoszenia są codziennie.</aside>
</section>"""

# after diagram
base2, _ = office_and_panel()
for n,x,y,c in PCS:
    if n == 'Anna':
        base2 += pc(x,y,BLUE,'Anna') + pc(x,y,ORANGE,'','flip2')
    else: base2 += pc(x,y,c,n)
SW=(840,300)
g2 = base2 + switch(*SW,440,[BLUE,BLUE,ORANGE,ORANGE,None,None])
ax,ay = port_xy(*SW,1)
g2 += f'<rect class="flip" x="{ax-20}" y="{ay}" width="40" height="24" rx="3" fill="{ORANGE}"/>'
g2 += f'<text x="1300" y="332" font-family="Inter" font-size="30" font-weight="700" fill="{INK}">jeden switch</text>'
g2 += f'<text x="1300" y="368" font-family="Inter" font-size="26" fill="#55534d">porty w VLAN 10 i 20</text>'
for i in range(4): g2 += cord(pp(i), port_xy(*SW,i), [BLUE,BLUE,ORANGE,ORANGE][i])
g2 += f'<text x="{ax}" y="{ay+90}" font-family="Inter" font-size="28" font-weight="700" fill="{GREEN}" text-anchor="middle">port Anny: VLAN 10 → 20</text>'
g2 += f'<text x="{ax}" y="{ay+130}" font-family="Inter" font-size="26" fill="#55534d" text-anchor="middle">żaden kabel się nie rusza</text>'
S['po-schemat'] = f"""<section id="po-schemat">
<h2>Z VLAN-ami: sieć wyznacza ustawienie portu</h2>
{svg(1664,560,g2,'Jeden switch z portami w VLAN 10 i 20. Port Anny zmienia kolor z niebieskiego na pomarańczowy, kable zostają na miejscu.')}
<p class="code">switchport access vlan 20</p>
<aside>Patrz na port Anny: zmienia kolor, a kabel zostaje na miejscu. To jedna linijka konfiguracji, wpisana zdalnie.</aside>
</section>"""

steps_after = [('0 min','Zgłoszenie: od jutra Anna pracuje w księgowości.'),
               ('+1 min','Admin łączy się zdalnie ze switchem, nie wstając zza biurka.'),
               ('+1 min','Przestawia port Anny z VLAN 10 na VLAN 20.'),
               ('+1 min','Komputer Anny dostaje z DHCP adres z sieci księgowości.')]
S['po-kroki'] = f"""<section id="po-kroki">
<h2>Z VLAN-ami: co trzeba zrobić</h2>
{steps(steps_after,'good')}
<aside>Te same pytania co wcześniej. Tym razem nikt nie idzie do szafy.</aside>
</section>"""

S['po-wynik'] = f"""<section id="po-wynik" class="good">
<p class="kicker">Z VLAN-ami</p>
<p class="big">≈ 3 min</p>
<p class="facts">Zdalnie · 0 przepiętych kabli · bez wizyty w szafie</p>
<aside>Ta sama zmiana, około dwudziestu razy szybciej i bez ryzyka, że ktoś wyjmie nie ten kabel.</aside>
</section>"""

S['porownanie'] = f"""<section id="porownanie">
<h2>Porównanie</h2>
<table>
<tr><th></th><th>Przed VLAN-ami</th><th>Z VLAN-ami</th></tr>
<tr><td>Co decyduje o sieci</td><td class="c-bad">kabel w szafie</td><td class="c-good">ustawienie portu</td></tr>
<tr><td>Kto to robi</td><td class="c-bad">technik na miejscu</td><td class="c-good">admin, zdalnie</td></tr>
<tr><td>Przepięte kable</td><td class="c-bad">1</td><td class="c-good">0</td></tr>
<tr><td>Czas</td><td class="c-bad">≈ 1 godzina</td><td class="c-good">≈ 3 minuty</td></tr>
</table>
<aside>Podsumuj tabelą i przejdź do wniosku.</aside>
</section>"""

S['wniosek'] = f"""<section id="wniosek" class="dark">
<p class="kicker">Wniosek</p>
<h1>VLAN oddziela to, do jakiej sieci należysz, od tego, gdzie biegnie kabel.</h1>
<aside>Zapowiedź: jak w takim razie Anna wydrukuje coś na drukarce IT? Ruch między VLAN-ami przechodzi przez router. To temat następnych zajęć.</aside>
</section>"""

open(f'{R}/deck.json','w').write(files['deck.json'])
open(f'{R}/deck.css','w').write(files['deck.css'])
for k,v in S.items(): open(f'{R}/slides/{k}.html','w').write(v)
print({k: len(v) for k,v in S.items()})
