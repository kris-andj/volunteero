# Mongoose za dostop do baze

- **Status:** sprejeta
- **Datum:** 2026-10-28

## Kontekst in opis problema

MongoDB sam ne preverja, ali so podatki pravilni. Brez preverjanja bi se lahko v bazo shranila prijava brez študenta ali akcija brez začetka. Potrebujem način, da določim obliko podatkov.

## Obravnavane možnosti

- **Mongoose** – knjižnica s shemami in preverjanjem podatkov.
- **Uradni MongoDB gonilnik** – neposreden dostop do baze brez shem.

## Odločitev

Izbrala sem »Mongoose«, ker lahko za vsako entiteto (Uporabnik, Organizacija, Akcija, Prijava) določim shemo z obveznimi polji in dovoljenimi vrednostmi (npr. statusi prijave). Podatki se preverijo, preden se shranijo.

Z uradnim gonilnikom bi morala vse preverjanje napisati sama.

## Posledice

### Pozitivne

- Napačni podatki se ne shranijo v bazo.
- Enostavno pisanje poizvedb in povezovanje entitet (populate).
- Sheme so hkrati dokumentacija podatkovnega modela.

### Negativne

- Še ena knjižnica, ki se jo moram naučiti.
- Malo počasnejše kot uradni gonilnik.