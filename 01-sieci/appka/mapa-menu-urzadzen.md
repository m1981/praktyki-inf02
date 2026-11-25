# Mapa menu urządzeń: przełącznik Cisco CBS350 i ruter TP-Link

Data: 2026-11-23

| Urządzenie  | Model i firmware opisany w tej mapie                                                                                                             | Emulator                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Przełącznik | Cisco **CBS350-24MGP-4X**, firmware **3.3.0.17** (w danych emulatora: `3.3.0.17b4_fts`, data wydania 27.03.2023)                                 | https://www.cisco.com/web/fw/tools/cisco-business/emulators/switch/cbs/cbs350/cbs350-24mgp-4x-3-3/html/cbs/home.htm?moduleType=2146# |
| Ruter       | TP-Link **Archer C6, wersja sprzętowa 4.0** (EU), firmware **1.12.1 Build 221212 Rel.65938n** (odczytane w emulatorze: System → Firmware Update) | https://emulator.tp-link.com/Archer%20C6%204.0-Router-Emulator/index.html                                                            |

**Model rutera TP-Link w pracowni nie jest znany – operator musi go potwierdzić.** Archer C6 v4 wybrałem, bo jest popularnym ruterem SOHO z aktualnym (niebieskim) interfejsem. Ten sam interfejs mają m.in. Archer AX23 i AX10 (wniosek z wyglądu listy emulatorów; nie porównywałem ich ekran po ekranie).

## Źródła

- Pełny spis 100 stron widoku Basic przełącznika (pola, flagi, przyciski; bez okien Add/Edit): [`mapa-menu-cbs350-basic.md`](mapa-menu-cbs350-basic.md) – zrzut operatora, 2026-11-23 (PYT-093a).
- Zrzut ekranu kreatora **Getting Started Wizard → 2. IP Settings** – operator, 2026-11-23 (PYT-094a); opis niżej, w sekcji „Kreator: najprostsza droga do adresu i bramy”.
- Lista emulatorów TP-Link: https://www.tp-link.com/pl/support/emulator/ (link do emulatora C6 v4 jest na https://www.tp-link.com/pl/support/download/archer-c6/v4/)
- Pomoc wbudowana w emulator Cisco, © 2023 Cisco (to dokumentacja producenta). Wspólny początek adresu: `https://www.cisco.com/web/fw/tools/cisco-business/emulators/switch/cbs/cbs350/cbs350-24mgp-4x-3-3/html/cbs/english/help/250_350/`, dalej strony: `t_ipv4_interface.html`, `t_ipv4_static_routes.html`, `t_user_accounts.html`, `t_login_settings.html`, `t_file_operation.html`, `t_getting_started_wizard.html`, `c_getting_started.html`, `t_vlan_settings.html`, `t_interface_settings_1.html`, `t_port_to_vlan.html`, `t_port_vlan_membership.html`, `t_dns_settings.html`, `t_idle_session_timeout.html`
- Cisco, domyślny adres IP i domyślne dane logowania CBS350: https://www.cisco.com/c/en/us/support/docs/smb/switches/Cisco-Business-Switching/kmgmt-2516-configure-ip-address-settings-cli-cbs.html
- TP-Link, logowanie do rutera: https://www.tp-link.com/us/support/faq/87/
- TP-Link, rezerwacja adresu: https://www.tp-link.com/en/support/faq/182/
- Stary (zielony) interfejs: emulator TL-WR842N v3, firmware 3.16.9 Build 150921: https://emulator.tp-link.com/TL-WR842N_V3_UN_Emulator/Index.htm

## Jak czytać oznaczenia

| Znacznik           | Znaczenie                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[E]**            | Widziane w emulatorze, na wyrenderowanym ekranie.                                                                                                                                                  |
| **[E-kod]**        | Odczytane z plików emulatora (definicja menu, słownik etykiet, kod strony), ale **nie** widziane na ekranie. Nazwy pól pochodzą wprost z interfejsu, ale ich układ na ekranie nie jest sprawdzony. |
| **[D]**            | Dokumentacja producenta (URL w sekcji „Źródła”).                                                                                                                                                   |
| **[W]**            | Mój wniosek. Trzeba go sprawdzić na prawdziwym urządzeniu.                                                                                                                                         |
| **NIE SPRAWDZONO** | Nie udało się sprawdzić.                                                                                                                                                                           |

**Ważne ograniczenie dla Cisco:** w moim środowisku nie udało się zalogować do emulatora CBS350 (narzędzie zablokowało wpisanie loginu i hasła). Wyrenderowałem tylko ekran logowania. Drzewo menu i nazwy pól Cisco pochodzą więc z plików emulatora (**[E-kod]**) i z pomocy wbudowanej (**[D]**). Ekranów po zalogowaniu **nie widziałem**. Z tego samego powodu w emulatorze TP-Link nie wpisywałem wartości w pola. Mogłem tylko klikać i czytać.

---

# 1. Przełącznik Cisco CBS350

## 1.1. Logowanie

| Co                                        | Wartość                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Źródło                                                          |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Domyślny adres IP                         | Przełącznik najpierw pyta serwer DHCP o adres. Jeśli żaden serwer DHCP nie odpowie, używa **192.168.1.254** (maska /24).                                                                                                                                                                                                                                                                                                                                                                                                           | [D] kmgmt-2516                                                  |
| Domyślna sieć VLAN zarządzania            | VLAN 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | [D] kmgmt-2516                                                  |
| Adres w przeglądarce                      | `http://192.168.1.254` (komputer musi mieć adres z sieci 192.168.1.0/24, np. 192.168.1.10)                                                                                                                                                                                                                                                                                                                                                                                                                                         | [D] + [W]                                                       |
| Domyślny login / hasło                    | `cisco` / `cisco`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | [D] kmgmt-2516, t_login_settings                                |
| Ekran logowania                           | Tytuł „Switch”. Pola: **Username**, **Password**, lista języka (**English**). Przycisk **Log In**.                                                                                                                                                                                                                                                                                                                                                                                                                                 | [E]                                                             |
| Wymuszona zmiana przy pierwszym logowaniu | **Tak.** Po zalogowaniu `cisco/cisco` pojawia się strona **Change Default User**. Trzeba założyć **nowego** użytkownika administratora, a domyślny użytkownik `cisco` zostaje usunięty. Pola: **User Name**, **Password**, **Confirm Password**, **Password Strength Meter**, przycisk **Suggest Password**. Komunikat: _„The username "cisco" cannot be used to replace the default username”_.                                                                                                                                   | [E-kod] strona `password/change_user.htm` + [D] t_user_accounts |
| Wymagania hasła (domyślne)                | Co najmniej **8 znaków**. Co najmniej **3 z 4 klas znaków**: wielka litera, mała litera, cyfra, znak specjalny. Ten sam znak może wystąpić **najwyżej 3 razy z rzędu**. Hasło **nie może** zawierać ciągu **więcej niż 2** kolejnych liter lub cyfr (np. `abc`, `123`, `cba`). Hasło nie może zawierać nazwy użytkownika ani słów `cisco` i `cbs`, także odwróconych i z podmianami typu `$`→s, `@`→a, `0`→o, `1`→l, `!`→i, `3`→e. Nie może zawierać słów ze słownika popularnych haseł. Nie może być takie samo jak obecne hasło. | [D] t_login_settings, [E-kod]                                   |
| Czas bezczynności                         | Po **10 minutach** bez aktywności sesja HTTP/HTTPS się kończy i trzeba zalogować się ponownie.                                                                                                                                                                                                                                                                                                                                                                                                                                     | [D] t_idle_session_timeout                                      |

Przykład hasła, które spełnia te zasady: `Pracownia#47Kz` [W]. Nie ma w nim ciągu `abc`/`123` ani słów `cisco`/`cbs`, ma 4 klasy znaków.

## 1.2. Pasek górny i tryb wyświetlania

- W pasku górnym są: **Save** (pokazuje się tylko wtedy, gdy jest coś niezapisanego), nazwa użytkownika, **Help**, **About**, **Logout** [E-kod: `home.htm`, słownik].
- Kliknięcie **Save** od razu kopiuje Running Configuration do Startup Configuration [E-kod: funkcja `saveCDB`].
- Tryb wyświetlania: **Basic** (podstawowy) albo **Advanced** (pełny) [D] c*getting_started. Część gałęzi menu widać tylko w trybie **Advanced** (oznaczone niżej jako \_Adv*) [E-kod]. Zmiana trybu kasuje niezatwierdzone (bez **Apply**) zmiany na otwartej stronie [D].
- Strona **Getting Started** ma szybkie linki: **Change Device IP Address** (→ IPv4 Interface), **Change Device Password** (→ User Accounts), **Backup Device Configuration** (→ File Operations), **Create VLAN** (→ VLAN Settings), **Configure Port Settings** (→ Port Settings) [D] c_getting_started.

## 1.3. Drzewo menu [E-kod]

Pozycje najwyższego poziomu (w tej kolejności):

1. Getting Started
2. Dashboard
3. Configuration Wizards
4. Search
5. Status and Statistics
6. Administration
7. Port Management
8. Smartport
9. VLAN Management
10. Spanning Tree
11. MAC Address Tables
12. Multicast
13. IPv4 Configuration
14. IPv6 Configuration (_Adv_)
15. General IP Configuration
16. Security
17. Access Control
18. Quality of Service
19. SNMP (_Adv_)

Rozwinięte gałęzie potrzebne do egzaminu:

```
Configuration Wizards
  (Getting Started Wizard, VLAN Configuration Wizard, ACL Configuration Wizard – nazwy z pomocy [D])
Administration
  System Settings
  Console Settings (Adv)
  Stack Management
  User Accounts                      ← zmiana hasła / nowy użytkownik
  Idle Session Timeout
  Time Settings ▸ System Time, SNTP Unicast, …
  System Log ▸ Log Settings, Remote Log Servers
  File Management
    Firmware Operations
    File Operations                  ← zapis running → startup (Duplicate)
    File Directory
    DHCP Auto Update (Adv)
  Cisco Business Dashboard Settings
  PNP ▸ PNP Settings, PNP Session
  Reboot
  Discovery - LLDP ▸ …
  Discovery - CDP ▸ …
  Locate Device
  Ping
  Traceroute
Port Management
  Port Settings                      ← ustawienia portów
  Error Recovery Settings
  Loopback Detection Settings (Adv)
  Link Aggregation ▸ LAG Management, LAG Settings, LACP (Adv)
  UDLD (Adv) ▸ …
  PoE ▸ Properties, Settings, Statistics
  Green Ethernet ▸ Properties, Port Settings
VLAN Management
  VLAN Settings                      ← tworzenie VLAN
  Interface Settings                 ← tryb portu: Access / Trunk / General
  Port to VLAN                       ← członkostwo: Tagged / Untagged / Excluded / Forbidden
  Port VLAN Membership               ← to samo widziane od strony portu (Join VLAN...)
  VLAN Translation (Adv), Private VLAN Settings (Adv), GVRP Settings (Adv), VLAN Groups (Adv)
  Voice VLAN ▸ Properties, Auto Voice VLAN, …
IPv4 Configuration
  IPv4 Interface                     ← adres IP zarządzania
  IPv4 Static Routes                 ← brama domyślna (trasa 0.0.0.0/0)
  IPv4 Forwarding Table
  RIPv2 (Adv), Access List (Adv), VRRP (Adv), SLA (Adv)
  ARP
  ARP Proxy (Adv), UDP Relay/IP Helper (Adv)
  DHCP Relay (Adv) ▸ …
  DHCP Server (Adv) ▸ Properties, Network Pools, Excluded Addresses, Static Hosts, DHCP Options, Address Binding
General IP Configuration
  Policy Based Routing (Adv)
  DNS ▸ DNS Settings, Search List, Host Mapping
Security
  … , Login Settings (Adv) ← zasady haseł, … , TCP/UDP Services, Port Security, 802.1X Authentication, …
```

## 1.4. Tabela: linijka z arkusza → ścieżka → pola → pułapki

| Linijka z arkusza                            | Ścieżka w menu                                                                                                                                                                  | Nazwy pól (tak jak w interfejsie)                                                                                                                                                                                                                                                                                                                                                                                    | Pułapki                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Źródło                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Adres IP zarządzania (statyczny) z maską** | IPv4 Configuration → **IPv4 Interface** → przycisk **Add...** (albo zaznacz wiersz VLAN 1 → **Edit...**)                                                                        | Okno **Add IP Interface**: **Interface** (do wyboru: Port / LAG / VLAN / Loopback / Out of Band + lista, np. VLAN 1) · **IP Address Type**: _Dynamic IP Address_ / _Static IP Address_ · **IP Address** · **Mask**: _Network Mask_ albo _Prefix Length_. Przycisk **Apply**. Tabela na stronie: **IPv4 Interface Table** z kolumnami Interface, IP Address Type (Static / DHCP / Default), IP Address, Mask, Status. | 1) Po **Apply** przełącznik od razu ma nowy adres. Jeśli nowy adres jest w innej sieci niż komputer, strona przestaje odpowiadać. Trzeba zmienić adres komputera i zalogować się pod nowym adresem. [W] 2) Jeśli interfejs ma już adres z DHCP, pojawia się okno _„This interface already has a dynamic IP address. Adding the static IP address will delete the dynamic IP address from this interface. Do you want to continue?”_ [E-kod] 3) Zmiana trafia tylko do **Running Configuration**. Po restarcie zniknie, jeśli jej nie zapiszesz (wiersz „Zapis” niżej). [D] | [E-kod] strony `ipaddr/system_ipconf_ipinterface_m_jq.htm` i `_a_jq.htm`; [D] t_ipv4_interface |
| **Brama domyślna**                           | IPv4 Configuration → **IPv4 Static Routes** → **Add...**                                                                                                                        | Okno **Add IPv4 Static Route**: **Destination IP Prefix** = `0.0.0.0` · **Mask**: _Network Mask_ = `0.0.0.0` albo _Prefix Length_ = `0` · **Route Type**: _Remote_ (nie _Reject_) · **Next Hop Router IP Address** = adres bramy · **Metric**: _Use Default_. **Apply**.                                                                                                                                             | 1) Na stronie IPv4 Interface w tej wersji **nie ma** pola „Default Gateway”. Uczeń będzie go tam szukał. [E-kod] 2) Trasy nie da się dodać przez podsieć, w której przełącznik ma adres z DHCP. Najpierw ustaw adres statyczny, potem bramę. [D] 3) Alternatywa: Configuration Wizards → **Getting Started Wizard**, zakładka IP Settings ma pole **Administrative Default Gateway** (i **DNS Server**). [D] t_getting_started_wizard                                                                                                                                      | [E-kod] `routing/ip_rout_a_jq.htm`; [D] t_ipv4_static_routes                                   |
| Serwer DNS (gdyby arkusz wymagał)            | General IP Configuration → DNS → **DNS Settings**                                                                                                                               | Tryb Basic: **Server Definition** (_By IP Address_ / _Disabled_), **Server IP Address**, **Default Domain Name**. **Apply**. W trybie Advanced: tabela serwerów, **Add...**, maks. 8 serwerów.                                                                                                                                                                                                                       | Pole wygląda inaczej w trybie Basic i w trybie Advanced.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | [D] t_dns_settings; [E-kod]                                                                    |
| **Zmiana hasła**                             | Administration → **User Accounts** → zaznacz użytkownika → **Edit...**                                                                                                          | Okno **Edit User Account**: **User Name**, **Current Password**, **Suggest Password**, **Password**, **Confirm Password**, **Password Strength Meter**, **User Level** (_Read-Only CLI Access (1)_ / _Read/Limited Write CLI Access (7)_ / _Read/Write Management Access (15)_). **Apply**. Nowy użytkownik: **Add...** → **Add User Account**.                                                                      | 1) Hasło musi spełniać zasady z p. 1.1. Inaczej pojawia się komunikat _„Your password fails to meet the minimum complexity requirements…”_. [E-kod] 2) Do panelu WWW wejdzie tylko użytkownik z poziomem **15**. [D] 3) Zasady haseł zmienia się w Security → **Login Settings** (tylko tryb Advanced). [D] 4) Zmianę trzeba zapisać do Startup. [D]                                                                                                                                                                                                                       | [E-kod] `password/user_accounts_e_jq.htm`; [D] t_user_accounts                                 |
| **Zapis konfiguracji (running → startup)**   | Sposób A: kliknij **Save** w pasku górnym. Sposób B: Administration → File Management → **File Operations**                                                                     | B: **Operation Type** = _Duplicate_ · **Source File Type** = _Running Configuration_ · **Destination File Type** = _Startup Configuration_ · **Apply**.                                                                                                                                                                                                                                                              | **Najczęstsza pułapka.** Każde **Apply** zapisuje tylko do Running Configuration [D]. Po restarcie lub zaniku prądu wszystko wraca do Startup Configuration. Link **Save** w pasku górnym jest widoczny tylko wtedy, gdy Running różni się od Startup [E-kod]. Jeśli go widać, konfiguracja **nie** jest zapisana [W].                                                                                                                                                                                                                                                     | [E-kod] `saveCDB`, słownik; [D] t_file_operation                                               |
| VLAN – tworzenie (na później)                | VLAN Management → **VLAN Settings** → **Add...**                                                                                                                                | Okno **Add VLAN**: **VLAN** albo **Range**, **VLAN ID**, **VLAN Name**, **VLAN Range**, **VLAN Interface State**, **Link Status SNMP Traps**. **Apply**.                                                                                                                                                                                                                                                             | Samo utworzenie VLAN nic nie robi, dopóki nie przypiszesz do niego portu. [D]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [E-kod]; [D] t_vlan_settings                                                                   |
| VLAN – tryb portu (na później)               | VLAN Management → **Interface Settings** → wybierz typ (Port/LAG) → **Go** → zaznacz port → **Edit...**                                                                         | **Edit Interface Settings**: **Interface**, **Switchport Mode** (_Layer 2_ / _Layer 3_), **Interface VLAN Mode** (_Access_ / _Trunk_ / _General_ / _Customer_ / _Private VLAN…_ / _VLAN Mapping…_), **Administrative PVID**, **Frame Type**, **Ingress Filtering**.                                                                                                                                                  | Port w trybie **Access** może być członkiem **nieoznaczonym (untagged) tylko jednego** VLAN. Aby port był **tagged**, ustaw najpierw tryb **Trunk** albo **General**. [D] Domyślnego trybu portów w tej wersji firmware NIE SPRAWDZONO.                                                                                                                                                                                                                                                                                                                                    | [E-kod]; [D] t_interface_settings_1                                                            |
| VLAN – tagged/untagged (na później)          | Sposób A: VLAN Management → **Port to VLAN** → filtr **VLAN ID** _equals to_ X → **Go**. Sposób B: VLAN Management → **Port VLAN Membership** → zaznacz port → **Join VLAN...** | A: kolumny **Interface Name**, **VLAN Mode**, **Membership Type** (_Forbidden_ / _Excluded_ / _Tagged_ / _Untagged_), **PVID**. **Apply**. B: **Access VLAN ID** (Access), **Native VLAN ID** + **Tagged VLANs** (_All VLANs_ / _User Defined_) (Trunk), **Untagged VLANs** / **Tagged VLANs** / **Forbidden VLANs** / **General PVID** (General).                                                                   | Legenda na stronie Port VLAN Membership: _T – Tagged member, U – Untagged member, F – Forbidden member, P – PVID_. Nowy VLAN ma domyślnie wszystkie porty jako _Excluded_. [D]                                                                                                                                                                                                                                                                                                                                                                                             | [E-kod]; [D] t_port_to_vlan, t_port_vlan_membership                                            |
| Ustawienia portów (na później)               | Port Management → **Port Settings** → zaznacz port → **Edit...**                                                                                                                | **Edit Port Settings**: **Port Description**, **Administrative Status** (_Up_ / _Down_), **Auto Negotiation**, **Administrative Port Speed**, **Administrative Duplex Mode**, **Link Status SNMP Traps**, **Time Range**. Na stronie głównej: **Jumbo Frames**, **Link Flap Prevention**.                                                                                                                            | Zmiana **Jumbo Frames** działa dopiero po zapisie i restarcie (komunikat na stronie). [E-kod]                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | [E-kod] `bridgeif/bridg_interface_portconfig_router_*`                                         |

---

# 2. Ruter TP-Link Archer C6 v4 (nowy, niebieski interfejs)

## 2.1. Logowanie

| Co                             | Wartość                                                                                                                                                                                                           | Źródło                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Adres panelu                   | `http://tplinkwifi.net` albo `http://192.168.0.1`                                                                                                                                                                 | [D] FAQ 87; LAN `192.168.0.1 / 255.255.255.0` widziany w emulatorze [E]                                         |
| Domyślne dane logowania        | Brak loginu. Przy **pierwszym** wejściu ruter każe **utworzyć hasło administratora** (stare „admin/admin” dotyczy starszych modeli).                                                                              | [D] FAQ 87; tekst „Create an administrator password” w słowniku [E-kod]                                         |
| Ekran logowania                | Tylko jedno pole hasła (**Local Password**), bez nazwy użytkownika.                                                                                                                                               | [E-kod] moduł `login/localLogin`                                                                                |
| Emulator                       | Otwiera się od razu na **Network Map**, bez logowania. Ekranu tworzenia hasła **nie widziałem**.                                                                                                                  | [E]                                                                                                             |
| Wymagania hasła administratora | Od **6 do 32 znaków**. Co najmniej **dwa rodzaje** znaków z trzech: litery, cyfry, symbole (komunikat: _„Must contain at least two types of the following characters: letters(A-Z, a-z), numbers and symbols.”_). | [E-kod] model `changeLoginPassword`, słownik. Czy ekran **tworzenia** hasła ma te same zasady – NIE SPRAWDZONO. |

## 2.2. Drzewo menu [E]

Pasek górny (4 zakładki): **Network Map** · **Internet** · **Wireless** · **Advanced**. Ikony w prawym górnym rogu: **Search**, **TP-Link ID**, **Log Out**, **UPDATE**.

Zakładka **Advanced** (menu po lewej):

```
Quick Setup
Operation Mode
Network
  Status
  Internet          ← WAN
  LAN               ← adres LAN
  IPTV/VLAN
  DHCP Server       ← DHCP + Address Reservation + DHCP Client List
  Dynamic DNS
  Routing
TP-Link ID
EasyMesh
Wireless
  Wireless Settings, Guest Network, Wireless Schedule, WPS, Additional Settings, WDS
NAT Forwarding
  Port Forwarding, Port Triggering, UPnP, DMZ
Parental Controls
QoS
Security
  Firewall, Access Control, IP & MAC Binding, ALG
IPv6
System
  Firmware Update, Backup & Restore, Administration ← hasło, System Log,
  CWMP Settings, Diagnostics, Time & Language, Reboot, LED Control
```

Zakładka **Internet** na górze to skrócona wersja strony Advanced → Network → Internet. Ma te same pola WAN, ale bez MAC Clone i NAT [E].

## 2.3. Jak działa zapis zmian

- Przycisk **SAVE** jest na dole strony, w pasku obok **SUPPORT** i **BACK TO TOP**. Jest **ukryty**, dopóki nic nie zmienisz w formularzu [E-kod: `index.html`, `index.js`]. W emulatorze przed zmianą faktycznie go nie widać [E].
- Jeden **SAVE** zapisuje zmiany od razu. Ruter nie ma osobnej konfiguracji „running/startup” jak Cisco [W, zgodne z kodem: SAVE wysyła dane od razu].
- Okna (np. rezerwacja adresu) mają własne przyciski **CANCEL** / **SAVE** [E].

## 2.4. Tabela: linijka z arkusza → ścieżka → pola → pułapki

| Linijka z arkusza                                    | Ścieżka w menu                                                                  | Nazwy pól (tak jak w interfejsie)                                                                                                                                                                                                                                                                                                                                                                                               | Pułapki                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Źródło                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Adres IP WAN (statyczny), maska, brama**           | Advanced → Network → **Internet** (albo zakładka **Internet** na górze)         | **Internet Connection Type**: lista _Dynamic IP_ / _Static IP_ / _PPPoE_ / _L2TP_ / _PPTP_ → wybierz **Static IP**. Pola: **IP Address**, **Subnet Mask**, **Default Gateway**. Pozostałe: **MTU Size** (1500 bytes, _„Do not change unless necessary.”_), sekcja **MAC Clone** (**Router MAC Address**), sekcja **NAT** (**Enable NAT**, **Enable NAT Boost**), **Internet Port Negotiation Speed Setting**. Na dole **SAVE**. | 1) Pola IP pojawiają się dopiero po wybraniu **Static IP**. [E] 2) Adres WAN i adres LAN **nie mogą być w tej samej podsieci** (komunikat: _„WAN IP address and LAN IP address cannot be in the same subnet.”_). [E-kod] 3) Emulator ma od razu ustawione _Static IP_ z `0.0.0.0`. Domyślnego typu na prawdziwym ruterze NIE SPRAWDZONO (zwykle _Dynamic IP_ – [W]).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | [E]                          |
| **Serwery DNS dla WAN (główny i drugi)**             | ta sama strona (Network → Internet)                                             | **Primary DNS**, **Secondary DNS** (opis „(Optional)”)                                                                                                                                                                                                                                                                                                                                                                          | Drugi DNS jest opcjonalny, ale arkusz zwykle go wymaga, więc trzeba go wpisać. [W]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | [E]                          |
| **Adres IP LAN z maską**                             | Advanced → Network → **LAN**                                                    | **MAC Address** (tylko odczyt), **IP Address** (domyślnie `192.168.0.1`), **Subnet Mask**: lista _255.255.255.0_ / _255.255.0.0_ / _255.0.0.0_ / _Custom_. **SAVE**.                                                                                                                                                                                                                                                            | 1) Po zmianie adresu pojawia się okno _„The new IP address will be used to access the web management page from now on. Save and log in again?”_ (przycisk **OK**). Potem ok. **40 s** napisu _„Redirecting to the new login page...”_ i przekierowanie na `http://tplinkwifi.net`. [E-kod] 2) **Panel trzeba otworzyć pod nowym adresem.** Komputer z adresem ze starej podsieci musi najpierw dostać nowy adres (odnowić DHCP, np. `ipconfig /renew`, albo przepiąć kabel) albo dostać ręcznie adres z nowej podsieci. [W] 3) Czy pula DHCP sama przesuwa się do nowej podsieci – NIE SPRAWDZONO. Po zmianie LAN zawsze sprawdź stronę DHCP Server. [W]                                                                                                                                                                                                                                       | [E] pola; [E-kod] komunikaty |
| **Serwer DHCP: włączenie, zakres, DNS dla klientów** | Advanced → Network → **DHCP Server**                                            | **DHCP Server**: pole wyboru **Enable** · **IP Address Pool**: dwa pola, od – do (domyślnie `192.168.0.100` – `192.168.0.249`) · **Address Lease Time** (minuty, domyślnie 120, zakres 1–2880) · **Default Gateway** (Optional) · **Primary DNS** (Optional) · **Secondary DNS** (Optional). **SAVE**.                                                                                                                          | 1) Zakres podaje się dwoma adresami: „od” i „do”, a nie liczbą adresów. [E] 2) Pula musi być w tej samej podsieci co adres LAN (_„The IP address pool and LAN IP address should be in the same subnet”_). [E-kod] 3) Pola DNS są „Optional”. Jeśli są puste, ruter rozdaje swój adres jako DNS [W]. Arkusz zwykle wymaga konkretnego DNS, więc trzeba go wpisać tutaj, a nie na stronie Internet. [W]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [E]                          |
| **Rezerwacja adresu IP dla karty (po MAC)**          | Advanced → Network → **DHCP Server** → sekcja **Address Reservation** → **Add** | Okno **Add a Reservation Entry**: **MAC Address** (6 pól po 2 znaki, myślniki są stałe), przycisk **VIEW CONNECTED DEVICES**, **IP Address**. Przyciski **CANCEL** / **SAVE**. Tabela: **Device Name**, **MAC Address**, **Reserved IP Address**, **Status** (przełącznik), **Modify** (edytuj / usuń).                                                                                                                         | 1) **Można wybrać z listy.** **VIEW CONNECTED DEVICES** otwiera okno **Select from Connected Devices**. Kliknięcie urządzenia wpisuje jego MAC **i jego obecny adres IP**. Adres IP trzeba potem zmienić na ten z arkusza. [E] 2) **Format MAC: myślniki** `XX-XX-XX-XX-XX-XX`, wielkie lub małe litery. [D] FAQ 182. W emulatorze: 6 osobnych pól po 2 znaki szesnastkowe. Klawisz `-` przechodzi do następnego pola. Klawisz `:` jest blokowany, ale pole i tak przeskakuje dalej po 2 znakach. Wklejenie całego MAC przez Ctrl+V jest blokowane. [E-kod] `mac.js` 3) MAC z `ipconfig /all` w Windows ma już myślniki. [W] 4) Wpis ma przełącznik **Status**. Wpis wyłączony nie działa. FAQ każe go włączyć. [D] FAQ 182, [E] (przykładowy wpis w emulatorze jest wyłączony) 5) Karta dostanie zarezerwowany adres dopiero przy kolejnym pobraniu adresu z DHCP (odnowienie dzierżawy). [W] | [E]; [D] FAQ 182             |
| **Zmiana hasła administratora**                      | Advanced → System → **Administration** → sekcja **Change Password**             | **Old Password**, **New Password**, **Confirm New Password**. **SAVE**. Na tej stronie są też: **Local Management** (**Local Managers**: _All Devices_ / _Specified Devices_), **Remote Management**, **HTTP Referer Head Check**.                                                                                                                                                                                              | 1) Trzeba znać **stare** hasło. 2) Nowe hasło: 6–32 znaki, co najmniej dwa rodzaje znaków. [E-kod] 3) Nie zmieniaj **Local Managers** na _Specified Devices_, bo możesz zablokować sobie dostęp. [W]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | [E] pola; [E-kod] zasady     |
| **Zapis / zastosowanie zmian**                       | przycisk **SAVE** na dole każdej strony (pojawia się po zmianie)                | —                                                                                                                                                                                                                                                                                                                                                                                                                               | 1) Bez **SAVE** zmiana nie trafia do rutera. Przejście na inną stronę porzuca zmianę [W]. Ostrzeżenia o niezapisanych zmianach w kodzie nie znalazłem. 2) Zmiana LAN = przekierowanie i nowy adres panelu (wiersz LAN wyżej). 3) Kopia zapasowa: System → **Backup & Restore** (**BACK UP**, **BROWSE**, **RESTORE**, **FACTORY RESTORE**). Restart: System → **Reboot** (**REBOOT**). [E]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [E], [E-kod]                 |

## 2.5. Stary (zielony) interfejs TP-Link – czym się różni

Sprawdzone na emulatorze TL-WR842N v3 (firmware 3.16.9 Build 150921). Stary panel składa się z ramek (frames). Ma jedno długie menu po lewej, bez zakładek Basic/Advanced, z pozycjami m.in. **Network** (WAN, MAC Clone, LAN), **DHCP** (DHCP Settings, DHCP Client List, Address Reservation) i **System Tools** (Password, Reboot) [E]. Domyślne logowanie to `admin` / `admin`, a adres to `192.168.0.1` albo `192.168.1.1` (zależy od modelu) [D] FAQ 87. Każda strona ma własny przycisk **Save**. Część zmian (np. rezerwacja adresu, zmiana LAN) działa dopiero po restarcie rutera [D] FAQ 182 dla starszych modeli, [W] dla LAN.

---

# 3. Najważniejsze pułapki dla ucznia (podsumowanie)

| #   | Urządzenie | Pułapka                                                                                                                                                                     | Co zrobić                                                                                          |
| --- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Cisco      | **Apply ≠ zapis.** Zmiany są tylko w Running Configuration i znikają po restarcie.                                                                                          | Na końcu kliknij **Save** w pasku górnym albo File Operations → _Duplicate_, Running → Startup.    |
| 2   | Cisco      | Pierwsze logowanie `cisco/cisco` wymusza **nowego użytkownika** (nie może się nazywać `cisco`) i **trudne hasło** (8+ znaków, 3 klasy, bez `abc`/`123`, bez `cisco`/`cbs`). | Przygotuj login i hasło przed egzaminem. Zapisz je na kartce przy stanowisku.                      |
| 3   | Cisco      | Fabryczny adres `192.168.1.254` (gdy brak DHCP) jest w innej sieci niż adres z arkusza. Po **Apply** nowego adresu przeglądarka traci połączenie.                           | Zmień adres komputera na sieć docelową i zaloguj się pod nowym adresem. Potem zapisz konfigurację. |
| 4   | Cisco      | Brama domyślna **nie jest** na stronie IPv4 Interface.                                                                                                                      | IPv4 Static Routes → Add: `0.0.0.0` / `0` → Next Hop = brama.                                      |
| 5   | TP-Link    | Po zmianie adresu LAN panel przenosi się pod nowy adres, a komputer zostaje w starej podsieci.                                                                              | Odnów adres karty (DHCP) i wejdź na nowy adres LAN albo `tplinkwifi.net`.                          |
| 6   | TP-Link    | Przycisk **SAVE** jest ukryty na dole strony i pojawia się dopiero po zmianie.                                                                                              | Po każdej zmianie przewiń w dół i kliknij **SAVE**.                                                |
| 7   | TP-Link    | Wybór z **VIEW CONNECTED DEVICES** wpisuje **obecny** adres IP karty, a nie adres z arkusza. Nowy wpis rezerwacji może być wyłączony.                                       | Popraw **IP Address**. Sprawdź, czy **Status** wpisu jest włączony.                                |

# 4. Czego nie sprawdziłem

- **Cisco:** ekranów po zalogowaniu (logowanie zablokowane w moim środowisku). Układ pól, przyciski i komunikaty znam tylko z plików emulatora i z pomocy. Nie sprawdziłem też domyślnego trybu VLAN portów w firmware 3.3 ani tego, czy wpis typu _Default_ (fabryczny adres) da się edytować przez **Edit...**.
- **TP-Link:** ekranu tworzenia hasła przy pierwszym logowaniu (emulator go pomija). Nie wpisywałem wartości w pola, więc nie sprawdziłem: komunikatów walidacji na ekranie, faktycznego działania **SAVE**, czy pula DHCP przesuwa się po zmianie LAN, czy rezerwacja wymaga restartu w nowym interfejsie, domyślnego typu WAN na prawdziwym ruterze.
- Modelu TP-Link w pracowni – do potwierdzenia przez operatora.

## Kreator: najprostsza droga do adresu i bramy przełącznika (PYT-094a)

Widziane na ekranie emulatora przez operatora [E, zrzut operatora 2026-11-23]. Ścieżka:
Configuration Wizards → **Getting Started Wizard** → kroki: 1. General Information · **2. IP Settings** · 3. User Account · 4. Time Settings · 5. Summary · 6. Finish.

| Pole w „2. IP Settings”            | Co widać                                                                | Co wpisać (arkusz, styczeń 2025)        |
| ---------------------------------- | ----------------------------------------------------------------------- | --------------------------------------- |
| **Interface**                      | wybór: _Unit 1 · Port GE1_ (zaznaczone domyślnie) / LAG / VLAN 1 / None | **VLAN 1**                              |
| **IP Interface Source**            | _DHCP_ / _Static_ (zaznaczone Static)                                   | Static                                  |
| **IP Address** (wymagane)          | puste                                                                   | 192.168.1.2                             |
| **Network Mask** (wymagane)        | puste                                                                   | 255.255.255.128 (/25)                   |
| **Administrative Default Gateway** | puste                                                                   | 192.168.1.1                             |
| **DNS Server**                     | wypełnione przez emulator (10.28.116.24)                                | arkusz nie wymaga – zostaw albo wyczyść |

Pułapki:

1. **Interfejs domyślnie to Port GE1, a nie VLAN 1.** Adres zarządzania przełącznika ustawia się
   na VLAN 1 (wszystkie porty są w nim z fabryki). Adres na jednym porcie zadziała tylko przez ten
   port. [W]
2. Maska jako **Network Mask** (255.255.255.128), nie jako /25. [E]
3. Kreator **nie zapisuje** na stałe: po Apply na końcu kreatora w górnym pasku widać **Save**
   [E, sprawdzone przez operatora 2026-11-25, PYT-108] – trzeba je jeszcze kliknąć.
