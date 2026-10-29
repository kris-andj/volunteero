# Node.js in Express za backend

- **Status:** sprejeta
- **Datum:** 2026-10-28

## Kontekst in opis problema

Potrebujem strežnik, ki nudi REST API, preverja vloge uporabnikov in izvaja poslovna pravila (prekrivanje, konflikti, čakalna vrsta). Projekt delam sama v enem semestru, zato mora biti tehnologija preprosta.

## Obravnavane možnosti

- **Node.js z Express** – JavaScript na strežniku, preprosto ogrodje.
- **Java Spring Boot** – zmogljivo, a bolj obsežno ogrodje.
- **Python Django** – ogrodje z veliko vgrajenimi funkcijami.

## Odločitev

Izbrala sem »Node.js z Express«, ker tako za frontend in backend uporabljam isti jezik (JavaScript). Express je preprost, končne točke API-ja pa naredim z nekaj vrsticami kode.

Spring Boot in Django bi zahtevala učenje novega jezika in več nastavitev, kar za ta projekt ni potrebno.

## Posledice

### Pozitivne

- En jezik za celoten projekt.
- Hitro postavim končne točke API-ja.
- Veliko dodatnih paketov prek npm (npr. bcrypt, jsonwebtoken).

### Negativne

- Express nima vnaprej določene strukture, zato moram mape (routes, models, controllers) urediti sama.
- Napake v JavaScriptu se lahko pokažejo šele med izvajanjem.