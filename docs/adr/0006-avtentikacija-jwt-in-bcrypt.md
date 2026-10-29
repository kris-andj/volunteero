# Avtentikacija z JWT in bcrypt

- **Status:** sprejeta
- **Datum:** 2026-10-28

## Kontekst in opis problema

Aplikacija ima tri vloge (študent, organizator, skrbnik) in vsaka sme izvajati druga dejanja. Backend mora pri vsakem zahtevku vedeti, kdo ga pošilja in kakšno vlogo ima. Gesla morajo biti v bazi varno shranjena.

## Obravnavane možnosti

- **JWT žeton + bcrypt** – po prijavi uporabnik dobi žeton, geslo je zgoščeno.
- **Seje na strežniku** – strežnik si zapomni prijavljene uporabnike.
- **Prijava z Google računom** – avtentikacija prek zunanjega ponudnika.

## Odločitev

Izbrala sem »JWT + bcrypt«, ker žeton vsebuje ID in vlogo uporabnika, zato strežniku ni treba hraniti sej. bcrypt gesla zgosti, tako da niso berljiva niti v bazi.

Seje bi zahtevale shranjevanje na strežniku, kar je pri REST API-ju manj praktično. Prijava z Google računom ne bi preverila, ali je uporabnik res študent.

## Posledice

### Pozitivne

- Gesla v bazi niso berljiva.
- Strežnik iz žetona takoj ve, kaj uporabnik sme.
- Deluje dobro z ločenim frontendom.

### Negativne

- Žetona ni mogoče preklicati, dokler ne poteče.
- Žeton moram varno hraniti v brskalniku.