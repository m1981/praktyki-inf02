# Cisco CBS350-24MGP-4X (emulator, FW 3.3) – mapa menu i pola konfiguracyjne

Źródło: emulator Cisco Business (CBS350-24MGP-4X), widok **Basic**, stan na 23.11.2026.
Zakres: wszystkie strony widoczne w menu w trybie Basic (100 stron). Strony dostępne tylko w trybie Advanced pominięto.

**Legenda typów**

| Typ              | Znaczenie                                                                        |
| ---------------- | -------------------------------------------------------------------------------- |
| flaga (checkbox) | pole zaznacz/odznacz, najczęściej „Enable”                                       |
| wybór (radio)    | jedna opcja z kilku                                                              |
| lista rozwijana  | select / dropdown                                                                |
| pole tekstowe    | wartość wpisywana ręcznie                                                        |
| _(wyszarzone)_   | pole nieaktywne w bieżącym stanie, zwykle odblokowuje się po zmianie innej opcji |

Uwagi:

- „Pola informacyjne” to wartości tylko do odczytu (status, liczniki).
- „Kolumny tabeli” to kolumny list (np. VLAN-y, porty). Pola edycji wierszy otwierają się w oknach Add/Edit, których nazwy plików podano przy przyciskach. Zawartości tych okien nie spisywano.
- Etykiety oznaczone _(uzup.)_ nie odczytały się automatycznie i zostały uzupełnione na podstawie wyglądu strony.

## 1. Mapa menu (tryb Basic)

- [Getting Started](#p0)
- [Dashboard](#p1)
- [Configuration Wizards](#p2)
- [Search](#p3)
- **Status and Statistics**
  - [System Summary](#p4)
  - [CPU Utilization](#p5)
  - [Port Utilization](#p6)
  - [Interface](#p7)
  - [Etherlike](#p8)
  - [802.1x EAP](#p10)
  - [ACL](#p11)
  - [Hardware Resource Utilization](#p12)
  - [Health and Power](#p13)
  - **Diagnostics**
    - [Optical Module Status](#p20)
    - [Tech-Support Information](#p21)
  - **RMON**
    - [Statistics](#p22)
  - **View Log**
    - [RAM Memory](#p29)
    - [Flash Memory](#p30)
- **Administration**
  - [System Settings](#p31)
  - [Stack Management](#p33)
  - [User Accounts](#p34)
  - [Idle Session Timeout](#p35)
  - **Time Settings**
    - [System Time](#p36)
    - [SNTP Unicast](#p37)
  - **System Log**
    - [Log Settings](#p42)
    - [Remote Log Servers](#p43)
  - **File Management**
    - [Firmware Operations](#p44)
    - [File Operations](#p45)
    - [File Directory](#p46)
  - [Cisco Business Dashboard Settings](#p48)
  - **PNP**
    - [PNP Settings](#p49)
    - [PNP Session](#p50)
  - [Reboot](#p51)
  - [Discovery - Bonjour](#p53)
  - **Discovery - LLDP**
    - [Properties](#p55)
    - [LLDP Port Status](#p59)
    - [LLDP Local Information](#p60)
    - [LLDP Neighbor Information](#p61)
    - [LLDP Statistics](#p62)
  - **Discovery - CDP**
    - [Properties](#p64)
    - [CDP Local Information](#p66)
    - [CDP Neighbor Information](#p67)
    - [CDP Statistics](#p68)
  - [Locate Device](#p69)
  - [Ping](#p70)
  - [Traceroute](#p71)
- **Port Management**
  - [Port Settings](#p72)
  - [Error Recovery Settings](#p73)
  - **Link Aggregation**
    - [LAG Management](#p75)
    - [LAG Settings](#p76)
  - **PoE**
    - [Properties](#p81)
    - [Settings](#p82)
    - [Statistics](#p83)
  - **Green Ethernet**
    - [Properties](#p84)
    - [Port Settings](#p85)
- **Smartport**
  - [Properties](#p86)
- **VLAN Management**
  - [VLAN Settings](#p89)
  - [Interface Settings](#p90)
  - [Port to VLAN](#p91)
  - [Port VLAN Membership](#p92)
  - **Voice VLAN**
    - [Properties](#p103)
    - [Auto Voice VLAN](#p104)
- **Spanning Tree**
  - [STP Status & Global Settings](#p111)
  - [STP Interface Settings](#p112)
  - [RSTP Interface Settings](#p113)
- **MAC Address Tables**
  - [Static Addresses](#p121)
  - [Dynamic Address Settings](#p122)
  - [Dynamic Addresses](#p123)
- **Multicast**
  - **IPv4 Multicast Configuration**
    - [IGMP Snooping](#p128)
  - [Multicast Router Port](#p137)
  - [Forward All](#p138)
- **IPv4 Configuration**
  - [IPv4 Interface](#p140)
  - [IPv4 Static Routes](#p141)
  - [IPv4 Forwarding Table](#p142)
  - [ARP](#p154)
- **General IP Configuration**
  - **DNS**
    - [DNS Settings](#p184)
    - [Search List](#p185)
    - [Host Mapping](#p186)
- **Security**
  - [RADIUS Client](#p188)
  - [TCP/UDP Services](#p212)
  - [Port Security](#p215)
  - **802.1X Authentication**
    - [Properties](#p216)
    - [Port Authentication](#p217)
    - [Host and Session Authentication](#p218)
    - [Authenticated Hosts](#p221)
  - **Denial of Service Prevention**
    - [Security Suite Settings](#p224)
    - [SYN Protection](#p225)
- **Access Control**
  - [MAC-Based ACL](#p253)
  - [MAC-Based ACE](#p254)
  - [IPv4-Based ACL](#p255)
  - [IPv4-Based ACE](#p256)
  - [ACL Binding (VLAN)](#p259)
  - [ACL Binding (Port)](#p260)
- **Quality of Service**
  - **General**
    - [QoS Properties](#p261)
    - [Queue](#p262)
    - [CoS/802.1p to Queue](#p263)
    - [DSCP to Queue](#p264)
  - **QoS Basic Mode**
    - [Global Settings](#p270)
    - [Interface Settings](#p271)
  - **QoS Statistics**
    - [Queue Statistics](#p281)

## 2. Strony – pola, flagi i przyciski

### Getting Started

<a id="p0"></a>

#### Getting Started

`sysinfo/gettingstarted.htm`

| Pole                             | Typ              | Opcje / uwagi |
| -------------------------------- | ---------------- | ------------- |
| Do not show this page on startup | flaga (checkbox) |               |

### Dashboard

<a id="p1"></a>

#### Dashboard

`dashboard/dashboard.htm`

_Brak pól formularza (kafelki/wykresy)._

### Configuration Wizards

<a id="p2"></a>

#### Configuration Wizards

`wizard/configuration_wizards.htm`

**Przyciski:** Launch Wizard... (×3, osobno dla każdego kreatora)

### Search

<a id="p3"></a>

#### Search

`search/search.htm`

_Brak pól formularza (wyszukiwarka stron menu)._

### Status and Statistics

<a id="p4"></a>

#### Status and Statistics › System Summary

`sysinfo/system_general_description_m_jq.htm`

**Pola informacyjne (tylko odczyt):** System Description, System Location, System Contact, Host Name, System Object ID, System Uptime, Current Time, Base MAC Address, Jumbo Frames, Firmware Version (Active Image), Firmware MD5 Checksum (Active Image), Firmware Version (Non-active), Firmware MD5 Checksum (Non-active), HTTP Service, HTTPS Service, SNMP Service, Telnet Service, SSH Service, Maximum Available PoE Power(W), Total PoE Power Consumption(W), PoE Power Mode, Unit 1(Active), Serial Number

<a id="p5"></a>

#### Status and Statistics › CPU Utilization

`diagnostics/maintenance_diagnos_cpuutil_m.htm`

| Pole            | Typ              | Opcje / uwagi                         |
| --------------- | ---------------- | ------------------------------------- |
| CPU Utilization | flaga (checkbox) | Enable                                |
| Refresh Rate    | wybór (radio)    | No refresh / 15 sec / 30 sec / 60 sec |

**Przyciski:** Apply, Cancel

<a id="p6"></a>

#### Status and Statistics › Port Utilization

`ifstats/statist_port_utilization_m.htm`

| Pole                   | Typ             | Opcje / uwagi                      |
| ---------------------- | --------------- | ---------------------------------- |
| Refresh Rate           | lista rozwijana | No Refresh, 15 sec, 30 sec, 60 sec |
| Filter: Interface Type | lista rozwijana | Port of Unit 1 / LAG               |

**Kolumny tabeli:** Interface · Tx Utilization · Rx Utilization

**Przyciski:** View Interface History Graph, Refresh, Go

<a id="p7"></a>

#### Status and Statistics › Interface

`ifstats/statist_interfacestat_interface_m.htm`

| Pole             | Typ             | Opcje / uwagi                         |
| ---------------- | --------------- | ------------------------------------- |
| Interface        | wybór (radio)   | Port / LAG                            |
| Interface – Unit | lista rozwijana | 1                                     |
| Interface – Port | lista rozwijana | GE1 … (28 pozycji)                    |
| Interface – LAG  | lista rozwijana | 1–8                                   |
| Refresh Rate     | wybór (radio)   | No Refresh / 15 sec / 30 sec / 60 sec |

**Pola informacyjne (tylko odczyt):** Receive / Transmit Statistics: Total Bytes (Octets), Unicast Packets, Multicast Packets, Broadcast Packets, Packets with Errors

**Przyciski:** Clear Interface Counters, Refresh, View All Interfaces Statistics, View Interface History Graph

<a id="p8"></a>

#### Status and Statistics › Etherlike

`ifstats/statist_interfacestat_etherlike_m.htm`

| Pole             | Typ             | Opcje / uwagi                         |
| ---------------- | --------------- | ------------------------------------- |
| Interface        | wybór (radio)   | Port / LAG                            |
| Interface – Unit | lista rozwijana | 1                                     |
| Interface – Port | lista rozwijana | GE1 … (28 pozycji)                    |
| Interface – LAG  | lista rozwijana | 1–8                                   |
| Refresh Rate     | wybór (radio)   | No Refresh / 15 sec / 30 sec / 60 sec |

**Pola informacyjne (tylko odczyt):** Frame Check Sequence (FCS) Errors, Single Collision Frames, Late Collisions, Excessive Collisions, Oversize Packets, Internal MAC Receive Errors, Pause Frames Received, Pause Frames Transmitted

**Przyciski:** Clear Interface Counters, Refresh, View All Interfaces Statistics

<a id="p10"></a>

#### Status and Statistics › 802.1x EAP

`ifstats/statist_interfacestat_eap_m_jq.htm`

| Pole             | Typ             | Opcje / uwagi                         |
| ---------------- | --------------- | ------------------------------------- |
| Interface – Unit | lista rozwijana | 1                                     |
| Interface – Port | lista rozwijana | GE1 … (28 pozycji)                    |
| Refresh Rate     | wybór (radio)   | No Refresh / 15 sec / 30 sec / 60 sec |

**Pola informacyjne (tylko odczyt):** EAPOL EAP Frames Received, EAPOL Start Frames Received, EAPOL Logoff Frames Received, EAPOL Announcement Frames Received, EAPOL Announcement Request Frames Received, EAPOL Invalid Frames Received, EAPOL EAP Length Error Frames Received, MKPDU Frames with unrecognized CKN Received, MKPDU Invalid Frames Received, Last EAPOL Frame Version, Last EAPOL Frame Source, EAPOL EAP Supplicant Frames Transmitted, EAPOL Start Frames Transmitted, EAPOL Logoff Frames Transmitted, EAPOL Announcement Frames Transmitted, EAPOL Announcement Request Frames Transmitted, EAPOL EAP Authenticator Frames Transmitted, EAPOL MKA Frames with No CKN Transmitted

**Przyciski:** Clear Interface Counters, Refresh, View All Interfaces Statistics

<a id="p11"></a>

#### Status and Statistics › ACL

`acl/acl_statistics_jq.htm`

| Pole         | Typ           | Opcje / uwagi                         |
| ------------ | ------------- | ------------------------------------- |
| Refresh Rate | wybór (radio) | No Refresh / 15 sec / 30 sec / 60 sec |

**Pola informacyjne (tylko odczyt):** Global Trapped Packet Counter, Trapped Packets - Port/LAG Based, Trapped Packets - VLAN Based

**Przyciski:** Clear Counters, Refresh

<a id="p12"></a>

#### Status and Statistics › Hardware Resource Utilization

`sysinfo/hardware_resources_utilization.htm`

**Kolumny tabeli:** Unit No. · IP Entries · IPv4 Policy Based Routing · IPv6 Policy Based Routing · VLAN Mapping · ACL and QoS Rules (dla każdej: In Use / Maximum)

<a id="p13"></a>

#### Status and Statistics › Health and Power

`stack_manage/maintenance_diagnos_health_tesla_m.htm`

**Pola informacyjne (tylko odczyt):** Current Green Ethernet and Port Power Savings, Cumulative Green Ethernet and Port Power Savings, Projected Annual Green Ethernet and Port Power Savings, Current PoE Power Savings, Cumulative PoE Power Savings, Projected Annual PoE Power Savings

**Kolumny tabeli:** Unit No. · Fan Status · Redundant Fan Status · Sensor Status · Temperature

<a id="p20"></a>

#### Status and Statistics › Diagnostics › Optical Module Status

`diagnostics/maintenance_diagnos_optictrans_m_jq.htm`

| Pole                 | Typ             | Opcje / uwagi |
| -------------------- | --------------- | ------------- |
| Filter: Port of Unit | lista rozwijana | 1             |

**Kolumny tabeli:** Port · Description · Serial Number · PID · VID · Temperature · Voltage · Current · Output Power · Input Power · Transmitter Fault · Loss of Signal · Data Ready

**Przyciski:** Go

<a id="p21"></a>

#### Status and Statistics › Diagnostics › Tech-Support Information

`diagnostics/maintenance_diagnos_tech_support.htm`

| Pole                     | Typ                  | Opcje / uwagi |
| ------------------------ | -------------------- | ------------- |
| Tech-Support Information | tekst wielowierszowy | tylko odczyt  |

**Przyciski:** Generate

<a id="p22"></a>

#### Status and Statistics › RMON › Statistics

`rmonstats/statist_rmon_rmonstatistics_m.htm`

| Pole             | Typ             | Opcje / uwagi                         |
| ---------------- | --------------- | ------------------------------------- |
| Interface        | wybór (radio)   | Port / LAG                            |
| Interface – Unit | lista rozwijana | 1                                     |
| Interface – Port | lista rozwijana | GE1 … (28 pozycji)                    |
| Interface – LAG  | lista rozwijana | 1–8                                   |
| Refresh Rate     | wybór (radio)   | No Refresh / 15 sec / 30 sec / 60 sec |

**Pola informacyjne (tylko odczyt):** Bytes Received, Drop Events, Packets Received, Broadcast Packets Received, Multicast Packets Received, CRC & Align Errors, Undersize Packets, Oversize Packets, Fragments, Jabbers, Collisions, Frames of 64 Bytes, Frames of 65 to 127 Bytes, Frames of 128 to 255 Bytes, Frames of 256 to 511 Bytes, Frames of 512 to 1023 Bytes, Frames of 1024 Bytes or More

**Przyciski:** Clear Interface Counters, Refresh, Graphic View, View All Interfaces Statistics

<a id="p29"></a>

#### Status and Statistics › View Log › RAM Memory

`syslog/system_syslog_memory_m.htm`

**Kolumny tabeli:** Log Index · Log Time · Severity · Description

**Przyciski:** Disable Alert Icon Blinking, Disable Pop-Up Syslog Notifications, Clear Logs, (ikony nawigacji)

<a id="p30"></a>

#### Status and Statistics › View Log › Flash Memory

`syslog/system_syslog_flash_m.htm`

**Kolumny tabeli:** Log Index · Log Time · Severity · Description

**Przyciski:** Clear Logs

### Administration

<a id="p31"></a>

#### Administration › System Settings

`sysinfo/system_general_settings_m.htm`

| Pole                               | Typ                  | Opcje / uwagi                                           |
| ---------------------------------- | -------------------- | ------------------------------------------------------- |
| System Location _(uzup.)_          | pole tekstowe        | maks. 160 znaków                                        |
| System Contact _(uzup.)_           | pole tekstowe        | maks. 160 znaków                                        |
| Host Name _(uzup.)_                | wybór (radio)        | Use Default / User Defined                              |
| Host Name – User Defined _(uzup.)_ | pole tekstowe        | _(wyszarzone)_, maks. 58 znaków, domyślnie switchb0c201 |
| Login Banner                       | tekst wielowierszowy | maks. 1000 znaków                                       |
| Welcome Banner                     | tekst wielowierszowy | maks. 1000 znaków                                       |

**Pola informacyjne (tylko odczyt):** System Description

**Przyciski:** Apply, Cancel, Preview... (×2)

<a id="p33"></a>

#### Administration › Stack Management

`stack_manage/stack_management_jq_tesla.htm`

| Pole                | Typ             | Opcje / uwagi                     |
| ------------------- | --------------- | --------------------------------- |
| Stack Mode          | wybór (radio)   | Native Stacking / Hybrid Stacking |
| Unit ID After Reset | lista rozwijana | Auto, 1, 2                        |

**Pola informacyjne (tylko odczyt):** Stack Topology, Stack Active, Unit 1 Stack Connection Speed

**Przyciski:** Apply and Reboot, Cancel

<a id="p34"></a>

#### Administration › User Accounts

`password/user_accounts_m_jq.htm`

**Kolumny tabeli:** User Name · User Level

**Przyciski:** Add → okno `user_accounts_a_jq.htm`, Edit → okno `user_accounts_e_jq.htm`, Delete

Okno **Add** (`user_accounts_a_jq.htm`), odczytane przy testach:

| Pole                    | Typ           | Opcje / uwagi                                                                                    |
| ----------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| User Name               | pole tekstowe | maks. 20 znaków                                                                                  |
| Password                | hasło         | maks. 64 znaki, przycisk „Suggest Password”                                                      |
| Confirm Password        | hasło         |                                                                                                  |
| Password Strength Meter | wskaźnik      | tylko odczyt                                                                                     |
| User Level              | wybór (radio) | Read-Only CLI Access (1) / Read/Limited Write CLI Access (7) / Read/Write Management Access (15) |

<a id="p35"></a>

#### Administration › Idle Session Timeout

`stack_manage/sessiontimeout.htm`

| Pole                    | Typ             | Opcje / uwagi       |
| ----------------------- | --------------- | ------------------- |
| HTTP Session Timeout    | lista rozwijana | 1, 5, 10, 30, Never |
| HTTPS Session Timeout   | lista rozwijana | 1, 5, 10, 30, Never |
| Console Session Timeout | lista rozwijana | 1, 5, 10, 30, Never |
| Telnet Session Timeout  | lista rozwijana | 1, 5, 10, 30, Never |
| SSH Session Timeout     | lista rozwijana | 1, 5, 10, 30, Never |

**Przyciski:** Apply, Cancel

<a id="p36"></a>

#### Administration › Time Settings › System Time

`sysinfo/system_general_time_m.htm`

| Pole                                                 | Typ              | Opcje / uwagi                         |
| ---------------------------------------------------- | ---------------- | ------------------------------------- |
| Main Clock Source (SNTP Servers)                     | flaga (checkbox) | Enable                                |
| Alternate Clock Source (PC via HTTP/HTTPS) _(uzup.)_ | flaga (checkbox) | Enable                                |
| Date                                                 | pole tekstowe    | _(wyszarzone)_                        |
| Local Time                                           | pole tekstowe    | _(wyszarzone)_                        |
| Get Time Zone from DHCP                              | flaga (checkbox) | Enable                                |
| Time Zone Offset                                     | lista rozwijana  | UTC -12:00 … (39 pozycji)             |
| Time Zone Acronym                                    | pole tekstowe    |                                       |
| Daylight Savings                                     | flaga (checkbox) | Enable                                |
| Time Set Offset                                      | pole tekstowe    | _(wyszarzone)_                        |
| Daylight Savings Type                                | wybór (radio)    | USA / European / By dates / Recurring |
| By dates – From / To                                 | pole tekstowe    | YYYY-MMM-DD + czas, _(wyszarzone)_    |
| Recurring – From / To: Day                           | lista rozwijana  | Sun … Sat                             |
| Recurring – From / To: Week                          | lista rozwijana  | First, 2, 3, 4, Last                  |
| Recurring – From / To: Month                         | lista rozwijana  | Jan … Dec                             |
| Recurring – From / To: Time                          | pole tekstowe    | _(wyszarzone)_                        |

**Pola informacyjne (tylko odczyt):** Last Synchronized Server, Time Zone from DHCP

**Przyciski:** Apply, Cancel

<a id="p37"></a>

#### Administration › Time Settings › SNTP Unicast

`sntp/system_sntp_servers_m.htm`

| Pole                | Typ              | Opcje / uwagi |
| ------------------- | ---------------- | ------------- |
| SNTP Client Unicast | flaga (checkbox) | Enable        |

**Kolumny tabeli:** SNTP Server · Stratum Level · Status · Last Response · Offset · Delay · Source · Interface

**Przyciski:** Apply, Cancel, Add, Delete, Restore Default Servers

<a id="p42"></a>

#### Administration › System Log › Log Settings

`syslog/system_syslog_logparams_m.htm`

| Pole                           | Typ                 | Opcje / uwagi                                                            |
| ------------------------------ | ------------------- | ------------------------------------------------------------------------ |
| Logging                        | flaga (checkbox)    | Enable                                                                   |
| Syslog Aggregator              | flaga (checkbox)    | Enable                                                                   |
| Max. Aggregation Time          | pole tekstowe       | _(wyszarzone)_                                                           |
| RAM Memory Logging _(uzup.)_   | flagi (checkbox) ×8 | Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debug |
| Flash Memory Logging _(uzup.)_ | flagi (checkbox) ×8 | Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debug |

**Przyciski:** Apply, Cancel

<a id="p43"></a>

#### Administration › System Log › Remote Log Servers

`syslog/remote_log_servers_m_jq.htm`

| Pole                   | Typ           | Opcje / uwagi                      |
| ---------------------- | ------------- | ---------------------------------- |
| Server Definition      | wybór (radio) | By Name / By IP Address / Disabled |
| Server IP Address/Name | pole tekstowe | _(wyszarzone)_                     |

**Przyciski:** Apply, Cancel

<a id="p44"></a>

#### Administration › File Management › Firmware Operations

`filemgmt/firmware_operations_jq.htm`

| Pole           | Typ           | Opcje / uwagi                                  |
| -------------- | ------------- | ---------------------------------------------- |
| Operation Type | wybór (radio) | Update Firmware / Backup Firmware / Swap Image |
| Copy Method    | wybór (radio) | HTTP/HTTPS / USB                               |

**Pola informacyjne (tylko odczyt):** Active Firmware File, Active Firmware Version

**Przyciski:** Apply, Cancel

<a id="p45"></a>

#### Administration › File Management › File Operations

`filemgmt/file_operations_jq.htm`

| Pole                  | Typ           | Opcje / uwagi                                                                                                             |
| --------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Operation Type        | wybór (radio) | Update File / Backup File / Duplicate                                                                                     |
| Destination File Type | wybór (radio) | Running Configuration / Startup Configuration / Mirror Configuration / Logging File / Language File / Dashboard Info File |
| Copy Method           | wybór (radio) | HTTP/HTTPS / USB / Internal Flash                                                                                         |

**Przyciski:** Apply, Cancel

<a id="p46"></a>

#### Administration › File Management › File Directory

`filemgmt/file_directory_jq.htm`

| Pole                      | Typ              | Opcje / uwagi |
| ------------------------- | ---------------- | ------------- |
| Auto Mirror Configuration | flaga (checkbox) | Enable        |
| Drive                     | wybór            | Flash / USB   |

**Pola informacyjne (tylko odczyt):** Free Space

**Kolumny tabeli:** File Name · Permissions · Size · Last Modified · Full Path

**Przyciski:** Apply, Cancel, Delete, Refresh, Go

<a id="p48"></a>

#### Administration › Cisco Business Dashboard Settings

`sysinfo/findit_network_settings_jq.htm`

| Pole                          | Typ              | Opcje / uwagi                                     |
| ----------------------------- | ---------------- | ------------------------------------------------- |
| Probe Operation               | flaga (checkbox) | Enable                                            |
| Dashboard Connection          | flaga (checkbox) | Enable                                            |
| Dashboard Definition          | wybór (radio)    | By IP Address / By Name                           |
| IP Address/Name               | pole tekstowe    |                                                   |
| Dashboard Port                | wybór (radio)    | Use Default (443) / User Defined                  |
| Dashboard Port – User Defined | pole tekstowe    | _(wyszarzone)_                                    |
| Connection Setup              | wybór (radio)    | Online with Web Browser / Offline with Access Key |
| Access Key ID                 | pole tekstowe    | _(wyszarzone)_                                    |
| Access Key Secret             | wybór (radio)    | Encrypted / Plaintext                             |
| Access Key Secret             | pole tekstowe ×2 | _(wyszarzone)_                                    |

**Pola informacyjne (tylko odczyt):** Probe Status, Probe Version, Dashboard Status

**Przyciski:** Apply, Cancel, Display Sensitive Data as Encrypted, Reset Connection, Clear Probe Database

<a id="p49"></a>

#### Administration › PNP › PNP Settings

`pnp/pnp_settings_jq.htm`

| Pole                   | Typ              | Opcje / uwagi                                            |
| ---------------------- | ---------------- | -------------------------------------------------------- |
| PNP State              | flaga (checkbox) | Enable                                                   |
| Settings Definition    | wybór (radio)    | Default Settings (From DHCP option 43) / Manual Settings |
| Transport Protocol     | wybór (radio)    | HTTP / HTTPS                                             |
| TCP Port               | pole tekstowe    | _(wyszarzone)_                                           |
| Server Definition      | wybór (radio)    | By IP address / By name                                  |
| Server IP Address/Name | pole tekstowe    | _(wyszarzone)_                                           |
| User Definition        | wybór (radio)    | Default Settings (From DHCP option 43) / Manual Settings |
| User Name              | pole tekstowe    | _(wyszarzone)_                                           |
| Password               | wybór (radio)    | Encrypted / Plaintext                                    |
| Password               | pole tekstowe ×2 | _(wyszarzone)_                                           |

**Przyciski:** Apply, Cancel, Display Sensitive Data as Encrypted

<a id="p50"></a>

#### Administration › PNP › PNP Session

`pnp/pnp_session_jq.htm`

**Pola informacyjne (tylko odczyt):** Administrative Status, Operational Status, PNP Agent State, Transport Protocol, TCP Port, Server IP Address, Username, Password MD5, Session Interval Timeout, Remaining Timeout

**Przyciski:** Resume

<a id="p51"></a>

#### Administration › Reboot

`sysinfo/system_general_reset_m.htm`

| Pole                             | Typ                | Opcje / uwagi            |
| -------------------------------- | ------------------ | ------------------------ |
| Reboot                           | wybór (radio)      | Immediate / Date / In    |
| Date – miesiąc                   | lista rozwijana    | Jan … Dec                |
| Date – dzień                     | lista rozwijana    | 01 … 31                  |
| Time – godzina                   | lista rozwijana    | 00 … 23                  |
| Time – minuta                    | lista rozwijana    | 00 … 59                  |
| In – dni / godziny / minuty      | listy rozwijane ×3 | 00 … (24 lub 60 pozycji) |
| Restore to Factory Defaults      | flaga (checkbox)   |                          |
| Clear Startup Configuration File | flaga (checkbox)   |                          |

**Przyciski:** Reboot, Cancel Reboot, Cancel

<a id="p53"></a>

#### Administration › Discovery - Bonjour

`bonjour/bonjour_router_m.htm`

| Pole      | Typ              | Opcje / uwagi |
| --------- | ---------------- | ------------- |
| Discovery | flaga (checkbox) | Enable        |

**Kolumny tabeli:** Interface Name · IP Address

**Przyciski:** Apply, Cancel, Add, Delete

<a id="p55"></a>

#### Administration › Discovery - LLDP › Properties

`gw/home_gw.html` (NAV_31)

| Pole        | Typ              | Opcje / uwagi |
| ----------- | ---------------- | ------------- |
| LLDP Status | flaga (checkbox) | Enable        |

**Przyciski:** Apply, Cancel

<a id="p59"></a>

#### Administration › Discovery - LLDP › LLDP Port Status

`gw/home_gw.html` (NAV_35)

**Pola informacyjne (tylko odczyt):** Chassis ID Subtype, Chassis ID, System Name, System Description, Supported System Capabilities, Enabled System Capabilities, Port ID Subtype

**Kolumny tabeli:** Interface · LLDP Status · LLDP MED Status · Local PoE (Power Type, Power Source, Power Priority, Power Value) · Remote PoE (Power Type, Power Source, Power Priority, Power Value) · # of neighbors · Neighbor capability of 1st device

**Przyciski:** LLDP Local Information Detail, LLDP Neighbor Information Detail, Go

<a id="p60"></a>

#### Administration › Discovery - LLDP › LLDP Local Information

`gw/home_gw.html` (NAV_36)

| Pole             | Typ             | Opcje / uwagi      |
| ---------------- | --------------- | ------------------ |
| Interface – Unit | lista rozwijana | 1                  |
| Interface – Port | lista rozwijana | GE1 … (28 pozycji) |

**Pola informacyjne (tylko odczyt):** Chassis ID Subtype, Chassis ID, System Name, System Description, Supported System Capabilities, Enabled System Capabilities, Port ID Subtype, Port ID, Port Description, IPv4 Address, IPv6 Global Address, IPv6 Link Local Address, Auto-Negotiation Supported, Auto-Negotiation Enabled, Auto-Negotiation Advertised Capabilities, Operational MAU Type, 802.3 Maximum Frame Size, Aggregation Capability, Aggregation Status, Aggregation Port ID, Local Tx, Local Rx, Remote Tx Echo, Remote Rx Echo, PD Requested Power Value, PSE Allocated Power Value, Capabilities Supported, Current Capabilities, Device Class, PoE Device Type, PoE Power Source, PoE Power Priority, PoE Power Value, Hardware Revision, Firmware Revision, Software Revision, Serial Number, Manufacturer Name, Model Name, Asset ID, Civic, Coordinates, ECS ELIN

**Kolumny tabeli (Network Policy):** Application Type · VLAN ID · VLAN Type · User Priority · DSCP

**Przyciski:** LLDP Port Status Table

<a id="p61"></a>

#### Administration › Discovery - LLDP › LLDP Neighbor Information

`gw/home_gw.html` (NAV_37)

**Kolumny tabeli:** Local Port · Chassis ID Subtype · Chassis ID · Port ID Subtype · Port ID · System Name · Time to Live

**Przyciski:** LLDP Port Status Table, Delete, Details, Refresh, Go, Clear Filter

<a id="p62"></a>

#### Administration › Discovery - LLDP › LLDP Statistics

`gw/home_gw.html` (NAV_39)

**Kolumny tabeli:** Interface · Tx Frames (Total) · Rx Frames (Total / Discarded / Errors) · Rx TLVs (Discarded / Unrecognized) · Neighbor's Information Deletion Count

**Przyciski:** Refresh

<a id="p64"></a>

#### Administration › Discovery - CDP › Properties

`cdp/cdp_properties_m.htm`

| Pole                 | Typ              | Opcje / uwagi |
| -------------------- | ---------------- | ------------- |
| CDP Status _(uzup.)_ | flaga (checkbox) | Enable        |

**Przyciski:** Apply, Cancel

<a id="p66"></a>

#### Administration › Discovery - CDP › CDP Local Information

`cdp/cdplocalinformation_m.htm`

| Pole | Typ             | Opcje / uwagi      |
| ---- | --------------- | ------------------ |
| Unit | lista rozwijana | 1                  |
| Port | lista rozwijana | GE1 … (28 pozycji) |

**Pola informacyjne (tylko odczyt):** CDP State, Device ID Type, Device ID, System Name, Address 1, Address 2, Address 3, Port ID, Capabilities, Version, Platform, Native VLAN, Duplex, Appliance ID, Appliance VLAN ID, Extended Trust, CoS for Untrusted Ports, Request ID, Power Management ID, Available Power, Management Power Level, 4-Pair PoE Supported, Spare Pair Detection/Classification Required, PD Spare Pair Desired State, PD Spare Pair Operational State

<a id="p67"></a>

#### Administration › Discovery - CDP › CDP Neighbor Information

`cdp/cdp_neighbor_m.htm`

**Kolumny tabeli:** Device ID · System Name · Local Interface · Advertisement Version · Time to Live (sec) · Capabilities · Platform · Neighbor Interface

**Przyciski:** Clear Table, Details..., Refresh, Go, Clear Filter

<a id="p68"></a>

#### Administration › Discovery - CDP › CDP Statistics

`cdp/cdp_statistics_table_m.htm`

**Kolumny tabeli:** Interface · Packets Received (Version 1 / Version 2 / Total) · Packets Transmitted (Version 1 / Version 2 / Total) · CDP Error Statistics (Illegal Checksum / Other Errors / Neighbors Over Maximum)

**Przyciski:** Clear Interface Counters, Clear All Interface Counters, Refresh, Go

<a id="p69"></a>

#### Administration › Locate Device

`sysinfo/locate_device_jq.htm`

| Pole     | Typ             | Opcje / uwagi |
| -------- | --------------- | ------------- |
| Duration | pole tekstowe   |               |
| Unit ID  | lista rozwijana | All, 1        |

**Przyciski:** Start

<a id="p70"></a>

#### Administration › Ping

`sysinfo/ping.htm`

| Pole                        | Typ           | Opcje / uwagi           |
| --------------------------- | ------------- | ----------------------- |
| Host Definition             | wybór (radio) | By IP address / By name |
| Destination IP Address/Name | pole tekstowe |                         |

**Pola informacyjne (tylko odczyt):** Status, Number of Sent Packets, Number of Received Packets, Packet Loss, Minimum Round Trip Time, Maximum Round Trip Time, Average Round Trip Time

**Przyciski:** Activate Ping, Cancel

<a id="p71"></a>

#### Administration › Traceroute

`sysinfo/traceroute_m.htm`

| Pole                 | Typ           | Opcje / uwagi           |
| -------------------- | ------------- | ----------------------- |
| Host Definition      | wybór (radio) | By IP address / By name |
| Host IP Address/Name | pole tekstowe |                         |

**Przyciski:** Activate Traceroute, Cancel

### Port Management

<a id="p72"></a>

#### Port Management › Port Settings

`bridgeif/bridg_interface_portconfig_router_m_jq.htm`

| Pole         | Typ              | Opcje / uwagi |
| ------------ | ---------------- | ------------- |
| Jumbo Frames | flaga (checkbox) | Enable        |

**Kolumny tabeli:** Entry No. · Port · Port Type · Operational Status · Port Speed · Duplex Mode · LAG · Protection State

**Przyciski:** Apply, Cancel, Copy, Edit → okno `bridg_interface_portconfig_router_e_jq.htm`, Go

<a id="p73"></a>

#### Port Management › Error Recovery Settings

`bridgeif/error_recovery_settings_m_jq.htm`

| Pole                         | Typ              | Opcje / uwagi |
| ---------------------------- | ---------------- | ------------- |
| Automatic Recovery Interval  | pole tekstowe    |               |
| Port Security                | flaga (checkbox) | Enable        |
| 802.1x Single Host Violation | flaga (checkbox) | Enable        |
| ACL Deny                     | flaga (checkbox) | Enable        |
| STP BPDU Guard               | flaga (checkbox) | Enable        |
| STP Loopback Guard           | flaga (checkbox) | Enable        |
| UDLD                         | flaga (checkbox) | Enable        |
| Loopback Detection           | flaga (checkbox) | Enable        |
| Storm Control                | flaga (checkbox) | Enable        |
| Link Flap Prevention         | flaga (checkbox) | Enable        |

**Kolumny tabeli:** Interface · Suspension Reason

**Przyciski:** Apply, Cancel, Reactivate, Go, Clear Filter

<a id="p75"></a>

#### Port Management › Link Aggregation › LAG Management

`bridgeif/bridg_interface_lagmembership_m.htm`

| Pole                   | Typ           | Opcje / uwagi                |
| ---------------------- | ------------- | ---------------------------- |
| Load Balance Algorithm | wybór (radio) | MAC Address / IP/MAC Address |

**Kolumny tabeli:** LAG · Name · LACP · Link State · Active Member · Standby Member

**Przyciski:** Apply, Cancel, Edit

<a id="p76"></a>

#### Port Management › Link Aggregation › LAG Settings

`bridgeif/bridg_interface_lagconfig_router_m.htm`

**Kolumny tabeli:** Entry No. · LAG · Type · Status · Auto Negotiation · Speed · Flow Control · Protection State

**Przyciski:** Copy, Edit

<a id="p81"></a>

#### Port Management › PoE › Properties

`poe/system_poe_properties_m.htm`

| Pole                 | Typ              | Opcje / uwagi            |
| -------------------- | ---------------- | ------------------------ |
| Power Mode           | wybór (radio)    | Class Limit / Port Limit |
| Traps                | flaga (checkbox) | Enable                   |
| Power Trap Threshold | pole tekstowe    |                          |

**Kolumny tabeli:** Unit No. · Nominal Power · Consumed Power · Available Power · Software Version · PSE Chipset & Hardware Revision

**Przyciski:** Apply, Cancel

<a id="p82"></a>

#### Port Management › PoE › Settings

`poe/system_poe_interface_m_jq.htm`

**Kolumny tabeli:** Entry No. · Port · Administrative Status · Operational Status · Priority Level · Class · Power Consumption (mW) · PoE Standard

**Przyciski:** Copy, Edit → okno `system_poe_interface_e_jq.htm`, Go

<a id="p83"></a>

#### Port Management › PoE › Statistics

`poe/system_poe_statistic_m_jq.htm`

| Pole             | Typ             | Opcje / uwagi                         |
| ---------------- | --------------- | ------------------------------------- |
| Interface – Unit | lista rozwijana | 1                                     |
| Interface – Port | lista rozwijana | All ports, GE1 … GE8                  |
| Refresh Rate     | wybór (radio)   | No Refresh / 15 sec / 30 sec / 60 sec |

**Pola informacyjne (tylko odczyt):** Average Consumption over Last Hour, Average Consumption over Last Day, Average Consumption over Last Week, Overload Counter, Short Counter, Denied Counter, Absent Counter, Invalid Signature Counter

**Przyciski:** Clear Event Counters, View All Interfaces Statistics, View Interface History Graph, Refresh

<a id="p84"></a>

#### Port Management › Green Ethernet › Properties

`gw/home_gw.html` (NAV_12)

| Pole                                  | Typ              | Opcje / uwagi |
| ------------------------------------- | ---------------- | ------------- |
| Energy Detect Mode                    | flaga (checkbox) | Enable        |
| Short Reach                           | flaga (checkbox) | Enable        |
| Port LEDs                             | flaga (checkbox) | Enable        |
| 802.3 Energy Efficient Ethernet (EEE) | flaga (checkbox) | Enable        |

**Przyciski:** Apply, Cancel, Reset Energy Saving Counter

<a id="p85"></a>

#### Port Management › Green Ethernet › Port Settings

`gw/home_gw.html` (NAV_13)

**Pola informacyjne (tylko odczyt):** Energy Detect Mode

**Kolumny tabeli:** Entry No. · Port · Energy Detect (Administrative / Operational / Reason) · Short Reach (Administrative / Operational / Reason / Cable Length) · 802.3 EEE (Administrative / Operational / LLDP Administrative / LLDP Operational / EEE Support on Remote)

**Przyciski:** Copy, Edit, Go

### Smartport

<a id="p86"></a>

#### Smartport › Properties

`gw/home_gw.html` (NAV_41)

| Pole                          | Typ           | Opcje / uwagi                                |
| ----------------------------- | ------------- | -------------------------------------------- |
| Administrative Auto Smartport | wybór (radio) | Disable / Enable / Enable by Auto Voice VLAN |

**Przyciski:** Apply, Cancel

### VLAN Management

<a id="p89"></a>

#### VLAN Management › VLAN Settings

`vmember/bridg_vlan_properties_jq.htm`

**Kolumny tabeli:** VLAN ID · VLAN Name · Originators · VLAN Interface State · Link Status SNMP Traps

**Przyciski:** Add, Edit, Delete

<a id="p90"></a>

#### VLAN Management › Interface Settings

`vmember/bridg_vlan_interfacesettings_m_jq.htm`

**Kolumny tabeli:** Entry No. · Interface · Interface VLAN Mode

**Przyciski:** Copy, Edit → okno `bridg_vlan_interfacesettings_e_jq.htm`, Go

<a id="p91"></a>

#### VLAN Management › Port to VLAN

`vmember/bridg_vlan_port_to_vlan_m_jq.htm`

**Kolumny tabeli:** Interface Name · VLAN Mode · Membership Type · PVID

**Przyciski:** Apply, Cancel, Go

<a id="p92"></a>

#### VLAN Management › Port VLAN Membership

`vmember/porttovlanmembership_m_jq.htm`

**Kolumny tabeli:** Interface · Mode · Administrative VLANs · Operational VLANs · LAG

**Przyciski:** Join VLAN... → okno `porttovlanmembership_e_jq.htm`, Details... → okno `porttovlanmembership_d_jq.htm`, Go

<a id="p103"></a>

#### VLAN Management › Voice VLAN › Properties

`voicevlan/voice_properties.htm`

| Pole                       | Typ             | Opcje / uwagi                                              |
| -------------------------- | --------------- | ---------------------------------------------------------- |
| Voice VLAN ID _(uzup.)_    | pole tekstowe   |                                                            |
| CoS/802.1p                 | lista rozwijana | 0–7                                                        |
| DSCP                       | lista rozwijana | 0–63                                                       |
| Dynamic Voice VLAN         | wybór (radio)   | Enable Auto Voice VLAN / Enable Telephony OUI \* / Disable |
| Auto Voice VLAN Activation | wybór (radio)   | Immediate / By external Voice VLAN trigger                 |

**Przyciski:** Apply, Cancel

<a id="p104"></a>

#### VLAN Management › Voice VLAN › Auto Voice VLAN

`voicevlan/auto_voice.htm`

**Pola informacyjne (tylko odczyt):** Auto Voice VLAN Status, Voice VLAN ID, Source Type, CoS/802.1p, DSCP, Root Switch MAC Address, Switch MAC Address, Voice VLAN ID Change Time

**Kolumny tabeli:** Interface · Source MAC Address · Source Type · Voice VLAN ID · CoS/802.1p · DSCP · Best Local Source

**Przyciski:** Restart Auto Voice VLAN, Refresh

### Spanning Tree

<a id="p111"></a>

#### Spanning Tree › STP Status & Global Settings

`stp/bridg_spantree_stp_properties_m.htm`

| Pole                     | Typ              | Opcje / uwagi                                                                     |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------- |
| Spanning Tree State      | flaga (checkbox) | Enable                                                                            |
| STP Loopback Guard       | flaga (checkbox) | Enable                                                                            |
| STP Operation Mode       | wybór (radio)    | Classic STP / Rapid STP / Multiple STP _ / Per VLAN STP _ / Rapid Per VLAN STP \* |
| BPDU Handling            | wybór (radio)    | Filtering / Flooding                                                              |
| Path Cost Default Values | wybór (radio)    | Short / Long                                                                      |
| Priority                 | pole tekstowe    |                                                                                   |
| Hello Time               | pole tekstowe    |                                                                                   |
| Max Age                  | pole tekstowe    |                                                                                   |
| Forward Delay            | pole tekstowe    |                                                                                   |

**Pola informacyjne (tylko odczyt):** Bridge ID, Root Bridge ID, Root Port, Root Path Cost, Topology Changes Counts, Last Topology Change

**Przyciski:** Apply, Cancel

<a id="p112"></a>

#### Spanning Tree › STP Interface Settings

`stp/bridg_spantree_stp_interfacestngs_port_m.htm`

**Kolumny tabeli:** Entry No. · Interface · STP · Edge Port · Port Role · Priority · Port State · Designated Bridge ID · Designated Port ID · Designated Cost · Forward Transitions · LAG

**Przyciski:** Copy, Edit, Go

<a id="p113"></a>

#### Spanning Tree › RSTP Interface Settings

`rstp/bridg_spantree_rstp_m.htm`

**Kolumny tabeli:** Entry No. · Interface · Point-to-Point Operational Status · Port Role · Mode · Fast Link Operational Status · Port Status

**Przyciski:** Copy, Edit, Activate Protocol Migration, Go

### MAC Address Tables

<a id="p121"></a>

#### MAC Address Tables › Static Addresses

`adrs_tbl/bridg_frddata_staticaddress_m.htm`

**Kolumny tabeli:** VLAN ID · MAC Address · Interface · Status

**Przyciski:** Add, Delete

<a id="p122"></a>

#### MAC Address Tables › Dynamic Address Settings

`adrs_tbl/bridg_frddata_dynamicaddresssettings_m.htm`

| Pole       | Typ           | Opcje / uwagi |
| ---------- | ------------- | ------------- |
| Aging Time | pole tekstowe |               |

**Przyciski:** Apply, Cancel

<a id="p123"></a>

#### MAC Address Tables › Dynamic Addresses

`adrs_tbl/bridg_frddata_dynamicaddress_m.htm`

**Kolumny tabeli:** VLAN ID · MAC Address · Interface

**Przyciski:** Clear Table, Go, Clear Filter

### Multicast

<a id="p128"></a>

#### Multicast › IPv4 Multicast Configuration › IGMP Snooping

`multicast/igmp_snooping_m_jq.htm`

| Pole                 | Typ              | Opcje / uwagi |
| -------------------- | ---------------- | ------------- |
| IGMP Snooping Status | flaga (checkbox) | Enable        |
| IGMP Querier Status  | flaga (checkbox) | Enable        |

**Kolumny tabeli:** Entry No. · VLAN ID · IGMP Snooping Status (Administrative / Operational) · MRouter Ports Auto Learn · Immediate Leave · Last Member Query Counter · IGMP Querier Status · IGMP Querier Election · IGMP Querier Version (Administrative / Operational) · Querier IP Address

**Przyciski:** Apply, Cancel, Copy, Edit → okno `igmp_snooping_e_jq.htm`

<a id="p137"></a>

#### Multicast › Multicast Router Port

`gw/home_gw.html` (NAV_26)

| Pole                                   | Typ             | Opcje / uwagi                                               |
| -------------------------------------- | --------------- | ----------------------------------------------------------- |
| Filter: VLAN ID equals to              | lista rozwijana | 1, 2, 4 … (100 pozycji)                                     |
| Filter: Interface Type equals to       | lista rozwijana | Port of Unit 1, LAG                                         |
| Macierz portów (dla każdego portu/LAG) | wybór (radio)   | m.in. Static / Dynamic, wybór osobno dla każdego interfejsu |

**Przyciski:** Apply, Cancel, Go

<a id="p138"></a>

#### Multicast › Forward All

`multibridge/bridg_multicast_forwardall_m.htm`

| Pole                                   | Typ             | Opcje / uwagi                                     |
| -------------------------------------- | --------------- | ------------------------------------------------- |
| Filter: VLAN ID equals to              | lista rozwijana | 1, 2, 4 … (100 pozycji)                           |
| Filter: Interface Type equals to       | lista rozwijana | Port of Unit 1, LAG                               |
| Macierz portów (dla każdego portu/LAG) | wybór (radio)   | m.in. Static, wybór osobno dla każdego interfejsu |

**Przyciski:** Apply, Cancel, Go

### IPv4 Configuration

<a id="p140"></a>

#### IPv4 Configuration › IPv4 Interface

`ipaddr/system_ipconf_ipinterface_m_jq.htm`

| Pole         | Typ              | Opcje / uwagi |
| ------------ | ---------------- | ------------- |
| IPv4 Routing | flaga (checkbox) | Enable        |

**Kolumny tabeli:** Interface · IP Address Type · IP Address · Mask · Status

**Przyciski:** Apply, Cancel, Add → okno `system_ipconf_ipinterface_a_jq.htm`, Edit, Delete

<a id="p141"></a>

#### IPv4 Configuration › IPv4 Static Routes

`routing/ip_rout_m_jq.htm`

**Kolumny tabeli:** Destination IP Prefix · Prefix Length · Route Type · Next Hop Router IP Address · Metric · Outgoing Interface

**Przyciski:** Add, Edit, Delete

<a id="p142"></a>

#### IPv4 Configuration › IPv4 Forwarding Table

`ipaddr/system_ipconf_forward_table_jq.htm`

**Kolumny tabeli:** Destination IP Prefix · Prefix Length · Route Type · Next Hop Router IP Address · Route Owner · Metric · Administrative Distance · Outgoing Interface

**Przyciski:** Refresh

<a id="p154"></a>

#### IPv4 Configuration › ARP

`ipaddr/system_ipconf_arp_m.htm`

| Pole                    | Typ           | Opcje / uwagi                           |
| ----------------------- | ------------- | --------------------------------------- |
| ARP Entry Age Out       | pole tekstowe |                                         |
| Clear ARP Table Entries | wybór (radio) | All / Dynamic / Static / Normal Age Out |

**Kolumny tabeli:** Interface · IP Address · MAC Address · Status

**Przyciski:** Apply, Cancel, Go, Clear Filter

### General IP Configuration

<a id="p184"></a>

#### General IP Configuration › DNS › DNS Settings

`dns/system_ipconf_dnsserver_m_jq.htm`

| Pole                | Typ           | Opcje / uwagi            |
| ------------------- | ------------- | ------------------------ |
| Server Definition   | wybór (radio) | By IP Address / Disabled |
| Server IP Address   | pole tekstowe | _(wyszarzone)_           |
| Default Domain Name | pole tekstowe |                          |

**Przyciski:** Apply, Cancel

<a id="p185"></a>

#### General IP Configuration › DNS › Search List

`dns/dns_search_list_m_jq.htm`

**Kolumny tabeli:** Domain Name · Source · Interface · Preference

<a id="p186"></a>

#### General IP Configuration › DNS › Host Mapping

`dns/system_ipconf_hostmapping_m.htm`

| Pole        | Typ           | Opcje / uwagi                                     |
| ----------- | ------------- | ------------------------------------------------- |
| Clear Table | wybór (radio) | Static Only / Dynamic Only / All Dynamic & Static |

**Kolumny tabeli:** Host Name · IP Address · IP Version · Type · Status · TTL (Sec) · Remaining TTL (Sec)

**Przyciski:** Apply, Cancel

### Security

<a id="p188"></a>

#### Security › RADIUS Client

`mgmtauthen/security_authen_radius_basicmode_m_jq.htm`

| Pole                   | Typ              | Opcje / uwagi                      |
| ---------------------- | ---------------- | ---------------------------------- |
| Server Definition      | wybór (radio)    | By Name / By IP Address / Disabled |
| Server IP Address/Name | pole tekstowe    |                                    |
| Key String             | wybór (radio)    | Encrypted / Plaintext              |
| Key String             | pole tekstowe ×2 | jedno z nich _(wyszarzone)_        |

**Przyciski:** Apply, Cancel, Display Sensitive Data as Encrypted

<a id="p212"></a>

#### Security › TCP/UDP Services

`mgmtauthen/security_tcp_udp_services.htm`

| Pole           | Typ              | Opcje / uwagi |
| -------------- | ---------------- | ------------- |
| HTTP Service   | flaga (checkbox) | Enable        |
| HTTPS Service  | flaga (checkbox) | Enable        |
| SNMP Service   | flaga (checkbox) | Enable        |
| Telnet Service | flaga (checkbox) | Enable        |
| SSH Service    | flaga (checkbox) | Enable        |

**Kolumny tabeli (TCP):** Service Name · Type · Local IP Address · Local Port · Remote IP Address · Remote Port · State

**Kolumny tabeli (UDP):** Service Name · Type · Local IP Address · Local Port · Application Instance

**Przyciski:** Apply, Cancel

<a id="p215"></a>

#### Security › Port Security

`traffic/security_network_portsecurity_m.htm`

**Kolumny tabeli:** Entry No. · Interface · Interface Status · Learning Mode · Max No. of Addresses Allowed · Action on Violation · Trap · Trap Frequency (sec)

**Przyciski:** Copy, Edit, Go

<a id="p216"></a>

#### Security › 802.1X Authentication › Properties

`netauthen/security_network_properties_m.htm`

| Pole                                | Typ              | Opcje / uwagi                |
| ----------------------------------- | ---------------- | ---------------------------- |
| Port-Based Authentication           | flaga (checkbox) | Enable                       |
| Authentication Method               | wybór (radio)    | RADIUS, None / RADIUS / None |
| Guest VLAN                          | flaga (checkbox) | Enable                       |
| Guest VLAN ID                       | lista rozwijana  | 1                            |
| Guest VLAN Timeout                  | wybór (radio)    | Immediate / User Defined     |
| Guest VLAN Timeout – User Defined   | pole tekstowe    | _(wyszarzone)_               |
| 802.1x Authentication Failure Traps | flaga (checkbox) | Enable                       |
| 802.1x Authentication Success Traps | flaga (checkbox) | Enable                       |
| MAC Authentication Failure Traps    | flaga (checkbox) | Enable                       |
| MAC Authentication Success Traps    | flaga (checkbox) | Enable                       |

**Kolumny tabeli:** VLAN ID · VLAN Name · Authentication

**Przyciski:** Apply, Cancel, Edit

<a id="p217"></a>

#### Security › 802.1X Authentication › Port Authentication

`netauthen/security_network_portauthen_m.htm`

**Kolumny tabeli:** Entry No. · Port · Current Port Control · Administrative Port Control · RADIUS VLAN Assignment · Guest VLAN · Open Access · 802.1x Based Authentication · MAC Based Authentication · Periodic Reauthentication · Reauthentication Period · Authenticator State

**Przyciski:** Go

<a id="p218"></a>

#### Security › 802.1X Authentication › Host and Session Authentication

`netauthen/security_network_multiplehost_m_jq.htm`

**Kolumny tabeli:** Entry No. · Port · Host Authentication · Single Host (Action on Violation · Traps · Trap Frequency · Number of Violations)

**Przyciski:** Copy, Edit → okno `security_network_multiplehost_e_jq.htm`, Go

<a id="p221"></a>

#### Security › 802.1X Authentication › Authenticated Hosts

`netauthen/security_network_authenhost_m.htm`

**Kolumny tabeli:** User Name · Port · Session Time (DD:HH:MM:SS) · Authentication Method · Authentication Server · MAC Address · VLAN ID

<a id="p224"></a>

#### Security › Denial of Service Prevention › Security Suite Settings

`security/globalset.htm`

| Pole                      | Typ              | Opcje / uwagi                                                                      |
| ------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| DoS Prevention            | wybór (radio)    | Disable / System-Level Prevention / System-Level and Interface-Level Prevention \* |
| Stacheldraht Distribution | flaga (checkbox) | Enable                                                                             |
| Invasor Trojan            | flaga (checkbox) | Enable                                                                             |
| Back Orifice Trojan       | flaga (checkbox) | Enable                                                                             |

**Pola informacyjne (tylko odczyt):** CPU Protection Mechanism, CPU Utilization, TCP SYN Protection

**Przyciski:** Apply, Cancel

<a id="p225"></a>

#### Security › Denial of Service Prevention › SYN Protection

`dosfilter/syn_protection_m.htm`

| Pole                     | Typ              | Opcje / uwagi                       |
| ------------------------ | ---------------- | ----------------------------------- |
| Block SYN-FIN Packets    | flaga (checkbox) | Enable                              |
| SYN Protection Mode      | wybór (radio)    | Disable / Report / Block and Report |
| SYN Protection Threshold | pole tekstowe    | _(wyszarzone)_                      |
| SYN Protection Period    | pole tekstowe    | _(wyszarzone)_                      |

**Kolumny tabeli:** Interface · Current Status · Last Attack

**Przyciski:** Apply, Cancel, Go

### Access Control

<a id="p253"></a>

#### Access Control › MAC-Based ACL

`acl/acl_m_mac.htm`

_Nie udało się automatycznie odczytać pól. Strona do sprawdzenia ręcznie (zwykle tabela „ACL Name” z przyciskami Add/Delete)._

<a id="p254"></a>

#### Access Control › MAC-Based ACE

`acl/security_accctrl_macbaseacl_ge_m.htm`

**Kolumny tabeli:** Priority · Action · Logging · Destination (MAC Address / Wildcard Mask) · Source (MAC Address / Wildcard Mask) · VLAN ID · 802.1p · 802.1p Mask · Ethertype

**Przyciski:** MAC-Based ACL Table, Add, Edit, Delete, Go

<a id="p255"></a>

#### Access Control › IPv4-Based ACL

`acl/acl_m_4.htm`

**Kolumny tabeli:** ACL Name

**Przyciski:** IPv4-Based ACE Table, Add → okno `acl_a.htm`, Delete

<a id="p256"></a>

#### Access Control › IPv4-Based ACE

`acl/security_accctrl_ipbaseacl_m.htm`

**Kolumny tabeli:** Priority · Action · Logging · Protocol · Source IP Address (IP Address / Wildcard Mask) · Destination IP Address (IP Address / Wildcard Mask) · Source Port · Destination Port · Flag Set · DSCP · IP Precedence · ICMP Type · ICMP Code · IGMP Type

**Przyciski:** IPv4-Based ACL Table, Add, Edit, Delete, Go

<a id="p259"></a>

#### Access Control › ACL Binding (VLAN)

`acl/security_acccntr_binding_vlan_m_jq.htm`

**Kolumny tabeli:** VLAN ID · MAC ACL · IPv4 ACL · IPv6 ACL · Default Action

**Przyciski:** Copy, Add → okno `security_acccntr_binding_vlan_a_jq.htm`, Edit → okno `security_acccntr_binding_vlan_e_jq.htm`, Delete

<a id="p260"></a>

#### Access Control › ACL Binding (Port)

`acl/security_accctrl_aclmapping_m.htm`

**Kolumny tabeli:** Entry No. · Interface · Input ACL (MAC ACL / IPv4 ACL / IPv6 ACL / Default Action) · Output ACL (MAC ACL / IPv4 ACL / IPv6 ACL / Default Action)

**Przyciski:** Copy, Edit, Delete, Go

### Quality of Service

<a id="p261"></a>

#### Quality of Service › General › QoS Properties

`qosglobal/qos_glob_general_cos_m.htm`

| Pole     | Typ           | Opcje / uwagi                 |
| -------- | ------------- | ----------------------------- |
| QoS Mode | wybór (radio) | Disable / Basic / Advanced \* |

**Kolumny tabeli:** Entry No. · Interface · Default CoS

**Przyciski:** Apply, Cancel, Copy, Edit, Restore CoS Defaults, Go

<a id="p262"></a>

#### Quality of Service › General › Queue

`qosglobal/qos_glob_general_queue_ge.htm`

**Kolumny tabeli:** Queue · Scheduling Method (Strict Priority / WRR) · WRR Weight · % of WRR Bandwidth

**Przyciski:** Apply, Cancel

<a id="p263"></a>

#### Quality of Service › General › CoS/802.1p to Queue

`qosqueue/qos_glob_queuemap_costoqueue_m.htm`

**Kolumny tabeli:** 802.1p · Output Queue

**Przyciski:** Apply, Cancel, Restore Defaults

<a id="p264"></a>

#### Quality of Service › General › DSCP to Queue

`qosqueue/qos_glob_queuemap_dscptoqueue_m.htm`

**Kolumny tabeli:** Ingress DSCP · Output Queue (4 bloki tabeli obok siebie)

**Przyciski:** Apply, Cancel, Restore Defaults

<a id="p270"></a>

#### Quality of Service › QoS Basic Mode › Global Settings

`qosbasic/qos_basic_genersettings_m.htm`

_Nie udało się automatycznie odczytać pól. Strona do sprawdzenia ręcznie (zwykle „Trust Mode”: CoS/802.1p, DSCP, CoS/802.1p-DSCP oraz „Override Ingress DSCP”)._

<a id="p271"></a>

#### Quality of Service › QoS Basic Mode › Interface Settings

`qosbasic/qos_basic_interfacesettings_m.htm`

**Kolumny tabeli:** Entry No. · Port · QoS State

**Przyciski:** Copy, Edit, Go

<a id="p281"></a>

#### Quality of Service › QoS Statistics › Queue Statistics

`qosstatistics/queues_statistics.htm`

| Pole         | Typ             | Opcje / uwagi                      |
| ------------ | --------------- | ---------------------------------- |
| Refresh Rate | lista rozwijana | No Refresh, 15 sec, 30 sec, 60 sec |

**Kolumny tabeli:** Queue · Transmitted Packets · Tail Dropped Packets · Transmitted Bytes · Tail Dropped Bytes

**Przyciski:** Clear Interface Counters, Clear All Interface Counters, Refresh, Go
