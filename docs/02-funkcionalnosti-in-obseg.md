# Volunteero – Funkcionalnosti in obseg

## 1. Uporabniške vloge

### Študent
- **Lahko:** se registrira z vpisno številko, pregleduje akcije, se prijavi, prekliče prijavo, razreši konflikt, vidi svoje prijave, mesto na čakalni vrsti in ure.
- **Ne more:** se prijaviti, dokler ga skrbnik ne potrdi; ustvarjati akcij; sprejemati prijav.

### Organizator
- **Lahko:** objavi in prekliče akcije svoje organizacije, sprejme ali zavrne prijave, označi udeležbo.
- **Ne more:** objavljati akcij, dokler organizacija ni odobrena; urejati akcij drugih organizacij; se prijaviti kot prostovoljec.

### Skrbnik
- **Lahko:** potrdi študente, odobri organizacije, deaktivira uporabnike.
- **Ne more:** ustvarjati akcij ali se nanje prijavljati.

## 2. Predvidene funkcionalnosti

| ID | Funkcionalnost | Vrsta | MVP |
|---|---|---|---|
| F1 | Registracija in prijava v sistem z vlogami | CRUD | **MVP** |
| F2 | Potrjevanje študentov in odobritev organizacij (skrbnik) | Domenska | **MVP** |
| F3 | Objava akcije (termin, kraj, število mest) | CRUD | **MVP** |
| F4 | Prijava na akcijo s preverjanjem prostih mest in prekrivanja s potrjenimi akcijami | Domenska | **MVP** |
| F5 | Sprejem prijave z zaznavanjem konflikta in izbira študenta, katero akcijo obdrži | Domenska | **MVP** |
| F6 | Označevanje udeležbe in samodejni izračun ur | Domenska | **MVP** |
| F7 | **Čakalna vrsta s samodejnim napredovanjem**: ko se sprosti mesto, sistem potrdi prvega študenta v vrsti, ki nima prekrivanja (podrobneje v poglavju 3) | Domenska | **MVP** |
| F8 | Profil študenta s potrjenimi akcijami in skupnimi urami | Domenska | |
| F9 | Preklic prijave s strani študenta (sprosti mesto za čakalno vrsto) | Domenska | |
| F10 | Preklic akcije s strani organizatorja (vse prijave se prekličejo) | Domenska | |
| F11 | Pregled prijav na akcijo za organizatorja | CRUD | |
| F12 | Iskanje in filtriranje akcij po datumu in kraju | CRUD | |

MVP vsebuje 7 funkcionalnosti, od tega jih je 5 domenskih (F2, F4, F5, F6, F7).

## 3. Poslovna pravila

| ID | Pravilo |
|---|---|
| P1 | ČE študent ni potrjen, POTEM se ne more prijaviti na akcijo. |
| P2 | ČE organizacija ni odobrena, POTEM organizator ne more objaviti akcije. |
| P3 | ČE organizator sprejme prijavo, akcija pa je zasedena (število potrjenih = `steviloMest`), POTEM prijava dobi status `CAKALNA_VRSTA` in čas `nastopVVrsto`. |
| P4 | ČE se akcija prekriva s potrjeno akcijo študenta, POTEM se študent nanjo ne more prijaviti. |
| P5 | KO organizator sprejme prijavo in prekrivanja ni, prijava dobi status `POTRJENA`. |
| P6 | KO organizator sprejme prijavo, ki se prekriva s potrjeno akcijo, prijava dobi status `KONFLIKT`. |
| P7 | KO študent razreši konflikt, izbrana prijava postane `POTRJENA`, druga pa `PREKLICANA`. |
| P8 | KO organizator po koncu akcije označi udeležbo, se študentu prištejejo ure = trajanje akcije. |
| P9 | KO se na akciji sprosti mesto (študent prekliče potrjeno prijavo ali jo opusti pri razrešitvi konflikta), sistem samodejno sproži napredovanje čakalne vrste. |
| P10 | PRI napredovanju sistem pregleda prijave s statusom `CAKALNA_VRSTA` po vrstnem redu `nastopVVrsto` in potrdi prvo, ki se ne prekriva s potrjenimi akcijami istega študenta. |
| P11 | ČE se prijava v vrsti prekriva s potrjeno akcijo študenta, jo sistem preskoči; prijava ostane v vrsti in obdrži svoje mesto. |
| P12 | KO se akcija začne, vse prijave, ki so še na čakalni vrsti, dobijo status `PREKLICANA`. |

**Prekrivanje:** akciji A in B se prekrivata, če `A.zacetek < B.konec` in `B.zacetek < A.konec`.

| Primer | Rezultat |
|---|---|
| Potrjena 9:00–13:00, prijava na 12:00–16:00 | Prijava ni mogoča (P4) |
| Potrjena 9:00–12:00, prijava na 12:00–16:00 | Prijava mogoča (se ne prekrivata) |
| Prijava 12:00–16:00 sprejeta, 9:00–13:00 že potrjena | `KONFLIKT` (P6) |
| Akcija ima 2 mesti, obe potrjeni; organizator sprejme tretjo prijavo | `CAKALNA_VRSTA` (P3) |
| Potrjen študent prekliče; v vrsti sta Ana (prva) in Marko (drugi) | Ana `POTRJENA` (P9, P10) |
| Isto, toda Ana ima ob tem času že drugo potrjeno akcijo | Ana ostane v vrsti, Marko `POTRJENA` (P11) |

### Čakalna vrsta s samodejnim napredovanjem (F7)

To je najzahtevnejša funkcionalnost rešitve, ker povezuje več pravil hkrati:

1. **Vrstni red:** prijave v vrsti so urejene po času, ko jih je organizator sprejel (`nastopVVrsto`), ne po času oddaje.
2. **Sprožilec:** napredovanje ni ročno, temveč se zgodi samodejno ob vsakem dogodku, ki sprosti mesto.
3. **Preverjanje prekrivanj:** pred potrditvijo sistem za vsakega kandidata ponovno preveri, ali se akcija prekriva z njegovimi potrjenimi akcijami. Neprimerne kandidate preskoči.
4. **Veriženje:** ko študent razreši konflikt in obdrži novo akcijo, se mesto na drugi akciji sprosti, kar sproži napredovanje čakalne vrste na **tej drugi** akciji. En dogodek lahko tako spremeni stanje več akcij.
5. **Sočasnost:** isto mesto se ne sme dodeliti dvema študentoma, zato se potrditev izvede z atomarno posodobitvijo, ki uspe le, če je mesto še prosto.

## 4. Kasnejše nadgradnje

1. Obvestila po e-pošti (potrditev, konflikt, preklic).
2. Priporočanje akcij glede na pretekle akcije in interese študenta.
3. Potrdilo o opravljenih urah v PDF.
4. Prestavitev akcije s ponovnim preverjanjem prekrivanj.
5. Samodejna potrditev študenta prek univerzitetnega e-naslova.
6. Statistika za organizacije.

## 5. Izven obsega

- Plačila (prostovoljno delo je neplačano).
- Mobilna aplikacija.
- Nalaganje dokumentov (potrdilo o vpisu, pooblastila).
- Klepet med študenti in organizatorji.
- Delna udeležba (štejejo se samo cele ure akcije).
