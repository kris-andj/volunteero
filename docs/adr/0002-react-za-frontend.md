# React za frontend

- **Status:** sprejeta
- **Datum:** 2026-10-28

## Kontekst in opis problema

Aplikacija ima več zaslonov: seznam akcij, profil študenta, upravljanje prijav in potrditve skrbnika. Veliko elementov se ponavlja (npr. kartica akcije, tabela prijav). Potrebujem knjižnico, s katero bom hitro in pregledno naredila uporabniški vmesnik.

## Obravnavane možnosti

- **React** – knjižnica s komponentami, zelo razširjena.
- **Angular** – celotno ogrodje z več pravili in TypeScriptom.
- **Navaden HTML in JavaScript** – brez knjižnice.

## Odločitev

Izbrala sem »React«, ker ga že poznam in lahko zaslone sestavim iz ponovno uporabnih komponent. Z React Routerjem enostavno naredim več strani v eni aplikaciji (SPA).

Angular je zame bolj zahteven in bi potrebovala več časa za učenje. Z navadnim JavaScriptom bi morala veliko stvari narediti sama, koda pa bi hitro postala nepregledna.

## Posledice

### Pozitivne

- Komponente (npr. kartica akcije) uporabim na več mestih.
- Veliko primerov, dokumentacije in pomoči na spletu.
- Hiter razvoj z orodjem Vite.

### Negativne

- Potrebujem dodatne knjižnice (npr. React Router).
- Stanje aplikacije (prijavljen uporabnik) moram urediti sama.