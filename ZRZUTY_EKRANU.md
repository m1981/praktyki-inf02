# Zrzuty ekranu do Dnia 0 (`setup.html`)

Lista zrzutów z panelu ekspertów (patrz `HISTORIA_ZMIAN.md`, punkt 1) wraz z promptami dla
**Nano Banana Pro**.

## Jak pracować (ważne)

Obecne zrzuty kart sieciowych mają błędy typowe dla obrazów generowanych: ten sam adres MAC na
dwóch kartach, wyszarzony przycisk _Port Forwarding_ przy NAT, tytuł okna „(SLAVE)”. Dlatego:

1. **Preferowane: prawdziwy zrzut + edycja.** Zrób zrzut w VirtualBox 7.2.22 (`Win+Shift+S`),
   wgraj go do Nano Banana Pro i użyj **promptu edycji** – model tylko dodaje zieloną ramkę,
   niczego nie przepisuje.
2. **Awaryjnie: generowanie od zera** (prompt generacji), a potem **obowiązkowo** sprawdź obraz
   według listy „Sprawdź” przy każdym zrzucie.
3. Zapisz plik pod podaną nazwą w `img/`. Pliki P1 podmieniają istniejące obrazy (HTML już na nie
   wskazuje). Pliki P2/P3 są nowe – po dodaniu daj znać, wepnę je w `setup.html`.

### Wspólny styl (doklejaj na końcu każdego promptu generacji)

```
Style: pixel-accurate desktop UI screenshot, flat, straight-on, no perspective, no device frame,
no shadows outside the window, no watermark, no extra UI elements. Windows 11 light theme,
Segoe UI font, 100% scaling, crisp readable text. Every text string must be spelled exactly as
given in quotes; do not invent any other labels. Highlight: one rounded rectangle, 3 px, bright
green #00C853, drawn only around the control named in the prompt. Aspect ratio 4:3.
```

### Wspólny prompt edycji (do prawdziwego zrzutu)

```
Edit the attached screenshot. Do not change, redraw, translate or re-type any existing text,
values, icons or layout. Only add one rounded rectangle, 3 px, bright green #00C853, around
[ELEMENT]. Keep the original resolution.
```

W miejsce `[ELEMENT]` wstaw opis z pola „Ramka” przy danym zrzucie.

---

## P1 – podmiana błędnych zrzutów (Etap 2)

### 1. `img/vbox-server-nic1-nat.jpg` – Adapter 1 = NAT

- **Gdzie:** Etap 2, punkt 4, _Adapter 1_.
- **Ramka:** pole „Attached to: NAT”.
- **Prompt generacji:**

```
Oracle VirtualBox 7.2 settings dialog, window title "WIN_SERVER - Settings". Left navigation
list: "General", "System", "Display", "Storage", "Audio", "Network" (selected), "Serial Ports",
"USB", "Shared Folders", "User Interface". Right panel header "Network" with tabs "Adapter 1"
(active), "Adapter 2", "Adapter 3", "Adapter 4". Checkbox "Enable Network Adapter" checked.
"Attached to:" dropdown showing "NAT". "Name:" dropdown empty and greyed out. Expanded section
"Advanced": "Adapter Type:" "Intel PRO/1000 MT Desktop (82540EM)", "Promiscuous Mode:" "Deny"
(greyed out), "MAC Address:" "080027A1B2C3", checkbox "Cable Connected" checked, button
"Port Forwarding" enabled (not greyed). Buttons "Cancel" and "OK" bottom right.
Highlight the "Attached to" dropdown.
```

- **Sprawdź:** tytuł z `WIN_SERVER`; MAC `080027A1B2C3`; _Port Forwarding_ aktywny (nie
  szary); brak słowa „SLAVE”.

### 2. `img/vbox-server-nic2-internal.jpg` – Adapter 2 = INF02-LAN

- **Gdzie:** Etap 2, punkt 4, _Adapter 2_.
- **Ramka:** pola „Attached to: Internal Network”, „Name: INF02-LAN” i „Promiscuous Mode: Allow
  All” (jedna ramka obejmująca trzy wiersze albo trzy osobne).
- **Prompt generacji:**

```
Oracle VirtualBox 7.2 settings dialog, window title "WIN_SERVER - Settings", "Network" selected
in the left list. Tab "Adapter 2" active. Checkbox "Enable Network Adapter" checked.
"Attached to:" "Internal Network". "Name:" "INF02-LAN". Expanded "Advanced": "Adapter Type:"
"Intel PRO/1000 MT Desktop (82540EM)", "Promiscuous Mode:" "Allow All", "MAC Address:"
"080027D4E5F6", checkbox "Cable Connected" checked, button "Port Forwarding" greyed out.
Highlight the three rows "Attached to", "Name" and "Promiscuous Mode" together.
```

- **Sprawdź:** MAC inny niż na zrzucie 1 (`080027D4E5F6`); nazwa dokładnie `INF02-LAN`; tu
  _Port Forwarding_ ma być szary (dla Internal Network to prawidłowe).

### 3. `img/vbox-server-nic3-internal.jpg` – Adapter 3 = INF02-LAN

- **Gdzie:** Etap 2, punkt 4, _Adapter 3_.
- **Ramka:** jak w zrzucie 2.
- **Prompt generacji:** prompt ze zrzutu 2, ale zakładka `"Adapter 3"` aktywna i MAC
  `"0800270F1E2D"`.
- **Sprawdź:** aktywna zakładka „Adapter 3”; trzeci, unikalny MAC.

---

## P2 – nowe zrzuty w miejscach, gdzie uczniowie najczęściej się mylą

### 4. `img/vbox-new-vm-skip-unattended.png` – kreator nowej maszyny

- **Gdzie:** Etap 2, punkt 3a–b (Pułapka nr 2).
- **Ramka:** pole wyboru „Skip Unattended Installation”.
- **Prompt generacji:**

```
Oracle VirtualBox 7.2 "Create Virtual Machine" wizard, section "Name and Operating System".
Fields: "Name:" "WIN_SERVER", "Folder:" "C:\INF02\VM", "ISO Image:"
"C:\INF02\ISO\SERVER_EVAL_x64FRE_en-us.iso", "Type:" "Microsoft Windows", "Version:"
"Windows 2022 (64-bit)". Checkbox "Skip Unattended Installation" checked. Buttons "Help",
"Expert Mode", "Back", "Next", "Cancel". Highlight the "Skip Unattended Installation" checkbox.
```

- **Sprawdź:** pole zaznaczone; nazwa i ścieżki zgodne z instrukcją. Przy prawdziwym zrzucie
  sprawdź, czy etykieta w 7.2.22 brzmi dokładnie „Skip Unattended Installation” – jeśli inaczej,
  popraw tekst w `setup.html`.

### 5. `img/vbox-linux-port-forwarding.png` – reguła SSH 2222 ➔ 22

- **Gdzie:** Etap 2, punkt 4, _Tylko LINUX_SERVER_.
- **Ramka:** cały wiersz reguły „SSH”.
- **Prompt generacji:**

```
Oracle VirtualBox 7.2 dialog "Port Forwarding Rules" over the "LINUX_SERVER - Settings" window.
Table with columns "Name", "Protocol", "Host IP", "Host Port", "Guest IP", "Guest Port". One
row: "SSH", "TCP", "127.0.0.1", "2222", empty, "22". Small add and remove icons on the right.
Buttons "Cancel" and "OK". Highlight the "SSH" row.
```

- **Sprawdź:** dokładnie jedna reguła; Guest IP puste; porty 2222 i 22.

### 6. `img/ws2022-select-edition.png` – wybór edycji Desktop Experience

- **Gdzie:** Etap 3, WIN_SERVER, krok 2 (Pułapka nr 4).
- **Ramka:** wiersz „(Desktop Experience)” ze Standard Evaluation.
- **Prompt generacji:**

```
Windows Server 2022 setup window inside a VirtualBox VM, title "Microsoft Server Operating
System Setup", dialog "Select the operating system you want to install". Table columns
"Operating system", "Architecture", "Date modified". Four rows: "Windows Server 2022 Standard
Evaluation", "Windows Server 2022 Standard Evaluation (Desktop Experience)" (selected, blue row),
"Windows Server 2022 Datacenter Evaluation", "Windows Server 2022 Datacenter Evaluation (Desktop
Experience)", all "x64". Buttons "Next". Classic blue Windows Setup background.
Highlight the selected second row.
```

- **Sprawdź:** zaznaczony **drugi** wiersz; wszystkie cztery wiersze obecne (uczeń ma zobaczyć,
  że pierwszy jest bez GUI).

### 7. `img/win11-oobe-domain-join.png` – konto lokalne w Windows 11

- **Gdzie:** Etap 3, WIN_11, krok 5 (Pułapka nr 5).
- **Ramka:** link „Domain join instead”.
- **Prompt generacji:**

```
Windows 11 out-of-box experience screen inside a VirtualBox VM, light theme. Heading "Let's set
things up for your work or school". Email input field empty. Below it the expanded "Sign-in
options" panel with one option "Domain join instead". Button "Next". Highlight "Domain join
instead".
```

- **Sprawdź:** brak jakiegokolwiek adresu e-mail; widać „Domain join instead”. Przy prawdziwym
  zrzucie z ISO 25H2 porównaj kolejność ekranów z krokami 4–6 w `setup.html`.

### 8. `img/ubuntu-storage-ubuntu-lv.png` – powiększenie `ubuntu-lv`

- **Gdzie:** `03-linux/setup-ubuntu.html`, Krok 2, „Powiększ partycję systemową”.
- **Ramka:** pole „Size” z wartością maksymalną.
- **Prompt generacji:**

```
Ubuntu Server 26.04 text-mode installer (subiquity) inside a VirtualBox VM, dark background,
white monospace text, orange highlighted buttons. Modal dialog "Editing logical volume ubuntu-lv
of ubuntu-vg". Fields: "Name:" "ubuntu-lv", "Size (max 23.996G):" "23.996G", "Format:" "ext4",
"Mount:" "/". Buttons "[ Save ]" (orange, focused) and "[ Cancel ]". Highlight the "Size" row.
```

- **Sprawdź:** wartość w polu równa wartości „max”; rozmiar spójny z dyskiem 25 GB.

---

## P3 – zrzuty pomocnicze

### 9. `img/vbox-language-english.png` – język VirtualBoxa

- **Gdzie:** Etap 2, punkt 1. **Ramka:** wiersz „English”.

```
Oracle VirtualBox 7.2 "Preferences" dialog, section "Language" selected in the left list. Table
of languages with columns "Name", "Id", "Translators"; row "English" "en" selected.
Buttons "Cancel" and "OK". Highlight the "English" row.
```

### 10. `img/vbox-guest-additions-menu.png` – Dodatki gościa

- **Gdzie:** Etap 3, „Dodatki gościa i schowek”, krok 1. **Ramka:** pozycja menu.

```
VirtualBox VM window titled "WIN_11 [Running] - Oracle VirtualBox" showing a Windows 11
desktop. Menu bar "File", "Machine", "View", "Input", "Devices", "Help"; the "Devices" menu is
open with items "Optical Drives", "Audio", "Network", "USB", "Shared Folders", "Shared
Clipboard", "Drag and Drop", "Insert Guest Additions CD image...", "Upgrade Guest Additions...".
Highlight "Insert Guest Additions CD image...".
```

### 11. `img/vbox-snapshot-take.png` – migawka

- **Gdzie:** Etap 5. **Ramka:** wiersz migawki.

```
Oracle VirtualBox 7.2 main window, machine "WIN_SERVER" selected in the left list with state
"Powered Off". Right panel "Snapshots" with a tree: "00-czysta-instalacja" and below it
"Current State". Toolbar buttons "Take", "Delete", "Restore", "Properties", "Clone".
Highlight the "00-czysta-instalacja" row.
```

### 12. `img/host-ssh-2222.png` – SSH z laptopa

- **Gdzie:** Etap 4, wiersz „Twój laptop”. **Ramka:** ostatnia linia z promptem.

```
Windows Terminal, Command Prompt tab, dark theme, Cascadia Mono font. Content:
"C:\Users\uczen>ssh -p 2222 administrator@127.0.0.1"
"administrator@127.0.0.1's password:"
"Welcome to Ubuntu 26.04 LTS (GNU/Linux x86_64)"
"administrator@serwer-linux:~$"
Highlight the last line.
```

### 13. `img/host-msinfo32-vbs.png` – sprawdzenie Hyper-V

- **Gdzie:** Etap 0, punkt 4. **Ramka:** wiersz VBS. **Uwaga:** laptop ucznia ma zwykle polski
  Windows – ten zrzut jest **po polsku**.

```
Windows 11 "Informacje o systemie" (msinfo32) window, Polish UI, "Podsumowanie systemu"
selected on the left. Right table "Element" / "Wartość" with rows including "Nazwa systemu
operacyjnego" "Microsoft Windows 11 Home", "Typ systemu" "Komputer z procesorem x64",
"Zabezpieczenia oparte na wirtualizacji" "Nie włączono". Highlight the row
"Zabezpieczenia oparte na wirtualizacji".
```

---

## Po dodaniu plików

- [ ] P1 podmienione (1–3) – widoczne od razu w `setup.html`.
- [ ] P2/P3 dodane do `img/` – poproś o wpięcie w `setup.html` i `03-linux/setup-ubuntu.html`.
- [x] Usunąć nieużywany `img/vbox-client-nic1-internal.jpg` (2026-11-03).
- [ ] Zaktualizować status punktu 1 w `HISTORIA_ZMIAN.md`.
