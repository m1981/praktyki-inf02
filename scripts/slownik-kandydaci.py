"""Lista zdań w labach, w których nazwa systemu oznacza konkretną maszynę (punkt 8 planu).

Uruchom z katalogu repo: python3 -I scripts/slownik-kandydaci.py
Wynik to tabela do przeglądu: [x] = zamieniamy, [ ] = zostawiamy. Pusta tabela = słownik stosowany.
"""
import glob
import re

# Kto jest "Windowsem" w danej fazie (topology.html)
WINDOWS_BY_DIR = {'03-linux': 'WIN_11', '06-integracja': 'WIN_SERVER'}

RULES = [
    (r'\bstacj\w* robocz\w*', 'WIN_11'),
    (r'\bmaszyn\w* (?:z )?Windows(?:em|a)? 11\b|\bWindows(?:a|em)? 11\b', 'WIN_11'),
    (r'\b(?:na|z|do|ze) Windows(?:ie)? Server(?:ze|a)?\b|\bmaszyn\w* z Windows Serverem\b', 'WIN_SERVER'),
    (r'\b(?:na|z|do) (?:Linux(?:ie|a)|Ubuntu)\b|\bmaszyn\w* (?:z )?(?:Linux\w*|Ubuntu)\b', 'LINUX_SERVER'),
    (r'\b(?:na|z|do) Windows(?:ie|a)\b|\bNA WINDOWSIE\b', None),  # zależy od fazy
]
# Zdania świadomie zostawione przy przeglądzie 2026-11-03 (treść strony, egzamin, nazwa przedmiotu)
KEEP = ['Witaj z Linuxa', 'Egzaminator prosi o zmianę nazwy stacji roboczej',
        'Ukończyłeś wszystkie laboratoria z Linuxa', 'Zapora Windows']
SKIP_BLOCKS = re.compile(r'<details class="exam-reference">.*?</details>', re.S)


def visible(line):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', line)).strip()


def main():
    files = sorted(glob.glob('0[2-6]-*/lab*.html')) + ['03-linux/setup-ubuntu.html']
    print('# Przegląd słownika (punkt 8)\n')
    print('`[x]` = zamieniamy na propozycję, `[ ]` = zostawiamy. Zmień znacznik i daj znać.\n')
    total = 0
    for path in files:
        src = open(path, encoding='utf-8').read()
        # zachowaj numery linii: zamień bloki egzaminacyjne na puste linie
        src = SKIP_BLOCKS.sub(lambda m: '\n' * m.group(0).count('\n'), src)
        rows = []
        for no, raw in enumerate(src.splitlines(), 1):
            text = visible(raw)
            if not text or any(k in text for k in KEEP):
                continue
            for pattern, target in RULES:
                m = re.search(pattern, text, re.I)
                if not m:
                    continue
                target = target or WINDOWS_BY_DIR.get(path.split('/')[0], '? (SERWER czy KLIENT)')
                if target in text:
                    break
                rows.append((no, text, m.group(0), target))
                break
        if rows:
            print(f'\n## `{path}`\n')
            print('| ✔ | Linia | Fragment | Znalezione | Propozycja |')
            print('| --- | --- | --- | --- | --- |')
            for no, text, found, target in rows:
                frag = text if len(text) <= 110 else text[:107] + '…'
                print(f'| [x] | {no} | {frag.replace("|", "/")} | {found} | {target} |')
            total += len(rows)
    print(f'\n**Razem kandydatów: {total}**')


main()
