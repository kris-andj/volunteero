# Volunteero – Uporabniške zgodbe

Uporabniške zgodbe pokrivajo vse funkcionalnosti iz dokumenta `02-funkcionalnosti-in-obseg.md` (F1–F12). Statusi so enaki kot v podatkovnem modelu. Akciji se **prekrivata**, če velja `A.zacetek < B.konec` in `B.zacetek < A.konec`.

## Pregled

| Oznaka | Vloga | Zgodba | Funkcionalnost |
|---|---|---|---|
| US-01 | Študent | Registracija z vpisno številko | F1 |
| US-02 | Organizator | Registracija z organizacijo | F1 |
| US-03 | Vsi | Prijava v sistem | F1 |
| US-04 | Skrbnik | Potrditev študenta | F2 |
| US-05 | Skrbnik | Odobritev organizacije | F2 |
| US-06 | Organizator | Objava akcije | F3 |
| US-07 | Študent | Prijava na akcijo | F4 |
| US-08 | Organizator | Pregled in sprejem prijav | F5, F11 |
| US-09 | Študent | Razrešitev konflikta | F5 |
| US-10 | Organizator | Označevanje udeležbe | F6 |
| US-11 | Študent | Napredovanje s čakalne vrste | F7 |
| US-12 | Študent | Profil s prijavami in urami | F8 |
| US-13 | Študent | Preklic prijave | F9 |
| US-14 | Organizator | Preklic akcije | F10 |
| US-15 | Študent | Iskanje akcij | F12 |

---

## US-01: Registracija študenta

- **Funkcionalnost:** F1
- **Vloga:** Študent

**Kot** študent **želim** ustvariti račun z vpisno številko, **da** se lahko prijavljam na akcije.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Obvezna polja so ime, priimek, e-naslov, geslo in vpisna številka.
2. Geslo mora imeti vsaj 8 znakov.
3. Če e-naslov že obstaja, se prikaže »Uporabnik s tem e-naslovom že obstaja«.
4. Nov račun ima vlogo `STUDENT` in `potrjen = false`.

---

## US-02: Registracija organizatorja z organizacijo

- **Funkcionalnost:** F1
- **Vloga:** Organizator

**Kot** predstavnik organizacije **želim** ustvariti račun skupaj z organizacijo, **da** lahko objavljam akcije.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Poleg osebnih podatkov so obvezni naziv, matična številka in e-naslov organizacije.
2. Organizacije z že registrirano matično številko ni mogoče ustvariti.
3. Nova organizacija ima `odobrena = false`.
4. Dokler organizacija ni odobrena, gumb za objavo akcije ni na voljo.

---

## US-03: Prijava v sistem

- **Funkcionalnost:** F1
- **Vloga:** Vsi uporabniki

**Kot** uporabnik se **želim** prijaviti z e-naslovom in geslom, **da** dostopam do funkcij svoje vloge.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Ob pravilnih podatkih uporabnik dobi žeton JWT z ID-jem in vlogo.
2. Ob napačnih podatkih se prikaže »Napačen e-naslov ali geslo«.
3. Uporabnik je preusmerjen na začetno stran svoje vloge.
4. Do strani druge vloge uporabnik nima dostopa.

---

## US-04: Potrditev študenta

- **Funkcionalnost:** F2
- **Vloga:** Skrbnik

**Kot** skrbnik **želim** potrditi ali zavrniti nove študente, **da** se prijavljajo samo pravi študenti.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Skrbnik vidi seznam študentov s `potrjen = false` in njihovo vpisno številko.
2. Po potrditvi se študent lahko prijavlja na akcije.
3. Po zavrnitvi se račun študenta deaktivira.
4. Nepotrjen študent se ne more prijaviti na akcijo (P1).

---

## US-05: Odobritev organizacije

- **Funkcionalnost:** F2
- **Vloga:** Skrbnik

**Kot** skrbnik **želim** odobriti ali zavrniti nove organizacije, **da** akcije objavljajo samo resnične organizacije.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Skrbnik vidi seznam organizacij z `odobrena = false` in njihovo matično številko.
2. Po odobritvi lahko organizatorji te organizacije objavljajo akcije.
3. Po zavrnitvi se deaktivirajo organizacija in njeni organizatorji.
4. Organizator neodobrene organizacije ne more objaviti akcije (P2).

---

## US-06: Objava akcije

- **Funkcionalnost:** F3
- **Vloga:** Organizator

**Kot** organizator **želim** objaviti akcijo s terminom, krajem in številom mest, **da** se nanjo prijavijo študenti.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Obvezna polja so naziv, opis, lokacija, začetek, konec in število mest.
2. Konec mora biti po začetku, začetek pa v prihodnosti.
3. Število mest mora biti vsaj 1.
4. Objavljena akcija ima status `OBJAVLJENA` in je vidna študentom.

---

## US-07: Prijava na akcijo

- **Funkcionalnost:** F4
- **Vloga:** Študent

**Kot** študent se **želim** prijaviti na akcijo, **da** sodelujem kot prostovoljec.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Prijava je mogoča le na akcijo `OBJAVLJENA`, ki se še ni začela; nova prijava ima status `ODDANA`.
2. Če se akcija prekriva s potrjeno akcijo študenta, prijava ni mogoča (P4).
3. Akciji, ki se le stikata (9.00–12.00 in 12.00–16.00), se ne prekrivata.
4. Na isto akcijo se študent ne more prijaviti dvakrat.

---

## US-08: Pregled in sprejem prijav

- **Funkcionalnost:** F5, F11
- **Vloga:** Organizator

**Kot** organizator **želim** pregledati prijave na svojo akcijo in jih sprejeti ali zavrniti, **da** izberem prostovoljce.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Organizator vidi prijave na svojo akcijo, razvrščene po statusu.
2. Sprejeta prijava brez prekrivanja in s prostim mestom dobi status `POTRJENA` (P5).
3. Sprejeta prijava, ki se prekriva s potrjeno akcijo študenta, dobi status `KONFLIKT` (P6).
4. Sprejeta prijava na polno akcijo dobi status `CAKALNA_VRSTA` (P3).
5. Zavrnjena prijava dobi status `ZAVRNJENA`.

---

## US-09: Razrešitev konflikta

- **Funkcionalnost:** F5
- **Vloga:** Študent

**Kot** študent **želim** izbrati, katero od dveh prekrivajočih se akcij obdržim, **da** nisem obvezan na dveh mestih hkrati.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Študent na profilu vidi obe akciji v konfliktu.
2. Izbrana prijava postane `POTRJENA`, druga `PREKLICANA` (P7).
3. Sproščeno mesto samodejno sproži napredovanje čakalne vrste (P9).

---

## US-10: Označevanje udeležbe

- **Funkcionalnost:** F6
- **Vloga:** Organizator

**Kot** organizator **želim** po koncu akcije označiti, kdo je prišel, **da** se prostovoljcem zabeležijo ure.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Udeležbo je mogoče označiti šele po koncu akcije.
2. Označena prijava dobi status `UDELEZEN`.
3. Polje `ure` dobi trajanje akcije (npr. 9.00–13.00 = 4 ure) (P8).
4. Akcija nato dobi status `ZAKLJUCENA`.

---

## US-11: Napredovanje s čakalne vrste

- **Funkcionalnost:** F7
- **Vloga:** Študent

**Kot** študent na čakalni vrsti **želim** samodejno dobiti mesto, ko se sprosti, **da** mi ni treba stalno preverjati akcije.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Ob sproščenem mestu sistem pregleda vrsto po `nastopVVrsto` (P9, P10).
2. Potrdi se prvi študent, ki nima prekrivajoče se potrjene akcije.
3. Študent s prekrivanjem se preskoči, a obdrži mesto v vrsti (P11).
4. Število potrjenih nikoli ne preseže `steviloMest`, tudi ob hkratnih preklicih.
5. Ob začetku akcije se preostale prijave v vrsti prekličejo (P12).

---

## US-12: Profil s prijavami in urami

- **Funkcionalnost:** F8
- **Vloga:** Študent

**Kot** študent **želim** videti svoje prijave in ure, **da** imam pregled nad prostovoljstvom.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Prijave so razdeljene na potrjene, v konfliktu, na čakalni vrsti in pretekle.
2. Pri čakalni vrsti je prikazano mesto v vrsti (npr. »2. v vrsti«).
3. Skupne ure so vsota `ure` vseh prijav `UDELEZEN`.

---

## US-13: Preklic prijave

- **Funkcionalnost:** F9
- **Vloga:** Študent

**Kot** študent **želim** preklicati prijavo, **da** sprostim mesto, če ne morem sodelovati.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Preklic je mogoč le pred začetkom akcije.
2. Preklicana prijava dobi status `PREKLICANA`.
3. Preklic potrjene prijave sproži napredovanje čakalne vrste (US-11).

---

## US-14: Preklic akcije

- **Funkcionalnost:** F10
- **Vloga:** Organizator

**Kot** organizator **želim** preklicati akcijo, **da** študenti vedo, da je termin spet prost.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Preklic je mogoč le za akcijo, ki se še ni začela, in zahteva potrditev.
2. Akcija dobi status `PREKLICANA` in ni več vidna na seznamu.
3. Vse aktivne prijave na akcijo dobijo status `PREKLICANA`.

---

## US-15: Iskanje akcij

- **Funkcionalnost:** F12
- **Vloga:** Študent

**Kot** študent **želim** iskati akcije po datumu in kraju, **da** hitro najdem primerne.

**Acceptance criteria (pogoji sprejemljivosti):**
1. Prikazane so le objavljene akcije, ki se še niso začele, od najbližje naprej.
2. Filter po kraju deluje od 3 znakov naprej in ne loči velikih in malih črk.
3. Akcije, ki se prekrivajo s potrjenimi akcijami študenta, so označene.
4. Če ni zadetkov, se prikaže »Ni akcij za izbrane filtre«.
