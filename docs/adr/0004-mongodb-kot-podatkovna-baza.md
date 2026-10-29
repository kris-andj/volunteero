# MongoDB kot podatkovna baza

- **Status:** sprejeta
- **Datum:** 2026-10-28

## Kontekst in opis problema

Shraniti moram štiri vrste podatkov: uporabnike, organizacije, akcije in prijave. Študenti in organizatorji imajo različna polja (študent ima vpisno številko, organizator pripada organizaciji). Baza mora delovati lokalno na mojem računalniku.

## Obravnavane možnosti

- **MongoDB** – dokumentna baza, podatki v obliki JSON.
- **PostgreSQL** – relacijska baza s tabelami in SQL-om.
- **Firebase Firestore** – dokumentna baza v oblaku.

## Odločitev

Izbrala sem »MongoDB«, ker dokumentna baza naravno podpira različna polja pri uporabnikih, podatki pa so v obliki JSON, tako kot v JavaScriptu. Za razvoj uporabljam lokalni MongoDB in MongoDB Compass za pregled podatkov.

PostgreSQL bi zahteval več dela s tabelami in SQL-om. Firestore deluje samo v oblaku in je vezan na Firebase.

## Posledice

### Pozitivne

- Ni treba pisati SQL-a.
- Enostavno dodam novo polje.
- Podatke lahko pregledujem v MongoDB Compass.

### Negativne

- Povezave med podatki niso tako stroge kot v relacijski bazi.
- Pravilnost podatkov moram preverjati v kodi (rešeno z Mongoose, ADR 0005).