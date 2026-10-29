# Volunteero – Podatkovni model

Uporabljena je podatkovna baza **MongoDB** s shemami **Mongoose**. Vsaka entiteta je svoja zbirka, povezane pa so z referencami (`ObjectId`).

## 1. Entitete

### Uporabnik (`uporabniki`)
| Polje | Tip | Opis |
|---|---|---|
| `_id` | ObjectId | Primarni ključ |
| `ime`, `priimek` | String | Ime in priimek |
| `eposta` | String, unikaten | E-naslov za prijavo |
| `gesloHash` | String | Zgoščeno geslo |
| `vloga` | enum | `STUDENT`, `ORGANIZATOR`, `SKRBNIK` |
| `vpisnaStevilka` | String | Samo študent |
| `potrjen` | Boolean | Študenta potrdi skrbnik |
| `organizacijaId` | ObjectId → Organizacija | Samo organizator |

### Organizacija (`organizacije`)
| Polje | Tip | Opis |
|---|---|---|
| `_id` | ObjectId | Primarni ključ |
| `naziv` | String | Naziv organizacije |
| `maticnaStevilka` | String | Matična številka (AJPES) |
| `kontaktnaEposta` | String | Uradni e-naslov |
| `odobrena` | Boolean | Organizacijo odobri skrbnik |

### Akcija (`akcije`)
| Polje | Tip | Opis |
|---|---|---|
| `_id` | ObjectId | Primarni ključ |
| `organizacijaId` | ObjectId → Organizacija | Kdo organizira |
| `naziv`, `opis`, `lokacija` | String | Osnovni podatki |
| `zacetek`, `konec` | Date | Termin akcije |
| `steviloMest` | Number | Število potrebnih prostovoljcev |
| `status` | enum | `OBJAVLJENA`, `PREKLICANA`, `ZAKLJUCENA` |

### Prijava (`prijave`)
| Polje | Tip | Opis |
|---|---|---|
| `_id` | ObjectId | Primarni ključ |
| `studentId` | ObjectId → Uporabnik | Študent |
| `akcijaId` | ObjectId → Akcija | Akcija |
| `status` | enum | `ODDANA`, `POTRJENA`, `KONFLIKT`, `CAKALNA_VRSTA`, `ZAVRNJENA`, `PREKLICANA`, `UDELEZEN` |
| `ure` | Number | Ure, ko je študent udeležen |
| `oddanaDne` | Date | Čas prijave |
| `nastopVVrsto` | Date | Čas, ko je prijava prišla na čakalno vrsto (določa vrstni red) |

Indeks na (`akcijaId`, `status`, `nastopVVrsto`) omogoča hitro iskanje naslednje prijave v čakalni vrsti.

## 2. Povezave

| Povezava | Kardinalnost |
|---|---|
| Organizacija → Uporabnik (organizatorji) | 1 : 0..* |
| Organizacija → Akcija | 1 : 0..* |
| Uporabnik (študent) → Prijava | 1 : 0..* |
| Akcija → Prijava | 1 : 0..* |

Študent in akcija sta povezana **mnogo proti mnogo** prek zbirke `prijave`.

## 3. Diagram entitet

```mermaid
erDiagram
    ORGANIZACIJA ||--o{ UPORABNIK : "ima organizatorje"
    ORGANIZACIJA ||--o{ AKCIJA : organizira
    UPORABNIK ||--o{ PRIJAVA : odda
    AKCIJA ||--o{ PRIJAVA : prejme
```

## 4. Razredni diagram

```mermaid
classDiagram
    direction LR

    class Uporabnik {
        +ObjectId _id
        +String ime
        +String priimek
        +String eposta
        +String gesloHash
        +Vloga vloga
        +String vpisnaStevilka
        +Boolean potrjen
        +ObjectId organizacijaId
        +skupneUre() Number
    }

    class Organizacija {
        +ObjectId _id
        +String naziv
        +String maticnaStevilka
        +String kontaktnaEposta
        +Boolean odobrena
    }

    class Akcija {
        +ObjectId _id
        +ObjectId organizacijaId
        +String naziv
        +String opis
        +String lokacija
        +Date zacetek
        +Date konec
        +Number steviloMest
        +StatusAkcije status
        +jeZasedena() Boolean
        +trajanjeUr() Number
        +sePrekriva(Akcija druga) Boolean
        +napredujCakalnoVrsto()
    }

    class Prijava {
        +ObjectId _id
        +ObjectId studentId
        +ObjectId akcijaId
        +StatusPrijave status
        +Number ure
        +Date oddanaDne
        +Date nastopVVrsto
        +sprejmi()
        +zavrni()
        +preklici()
        +resiKonflikt(Boolean obdrzi)
        +postaviVCakalnoVrsto()
        +oznaciUdelezbo()
    }

    class Vloga {
        <<enumeration>>
        STUDENT
        ORGANIZATOR
        SKRBNIK
    }

    class StatusAkcije {
        <<enumeration>>
        OBJAVLJENA
        PREKLICANA
        ZAKLJUCENA
    }

    class StatusPrijave {
        <<enumeration>>
        ODDANA
        POTRJENA
        KONFLIKT
        CAKALNA_VRSTA
        ZAVRNJENA
        PREKLICANA
        UDELEZEN
    }

    Organizacija "1" --> "0..*" Uporabnik : ima organizatorje
    Organizacija "1" --> "0..*" Akcija : organizira
    Uporabnik "1" --> "0..*" Prijava : odda
    Akcija "1" --> "0..*" Prijava : prejme

    Uporabnik ..> Vloga
    Akcija ..> StatusAkcije
    Prijava ..> StatusPrijave
```

## 5. Stanja prijave

```mermaid
stateDiagram-v2
    [*] --> ODDANA : študent se prijavi
    ODDANA --> ZAVRNJENA : organizator zavrne
    ODDANA --> POTRJENA : organizator sprejme, prosto mesto, ni prekrivanja
    ODDANA --> KONFLIKT : organizator sprejme, prekriva se s potrjeno akcijo
    ODDANA --> CAKALNA_VRSTA : organizator sprejme, akcija je polna
    CAKALNA_VRSTA --> POTRJENA : mesto se sprosti, študent je prvi brez prekrivanja
    CAKALNA_VRSTA --> PREKLICANA : študent prekliče / akcija se začne
    KONFLIKT --> POTRJENA : študent obdrži to akcijo
    KONFLIKT --> PREKLICANA : študent obdrži drugo akcijo
    ODDANA --> PREKLICANA : študent prekliče
    POTRJENA --> PREKLICANA : študent prekliče pred začetkom (sproži napredovanje vrste)
    POTRJENA --> UDELEZEN : organizator po koncu označi udeležbo
    UDELEZEN --> [*]
```

## 6. Potek napredovanja čakalne vrste

```mermaid
flowchart TD
    A[Mesto na akciji se sprosti] --> B{Ali je kdo na čakalni vrsti?}
    B -- ne --> Z[Konec: mesto ostane prosto]
    B -- da --> C[Vzemi naslednjo prijavo po nastopVVrsto]
    C --> D{Ali se akcija prekriva s potrjenimi akcijami tega študenta?}
    D -- da --> E[Preskoči, prijava ostane v vrsti]
    E --> F{Ali je v vrsti še kdo?}
    F -- da --> C
    F -- ne --> Z
    D -- ne --> G[Atomarno: prijava postane POTRJENA]
    G --> H[Konec]
```
