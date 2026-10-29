# Volunteero

Spletna aplikacija, v kateri študentske in druge organizacije objavljajo prostovoljske akcije, študenti pa se nanje prijavljajo. Sistem zazna prekrivanje terminov, vodi čakalno vrsto za polne akcije in študentom samodejno šteje opravljene prostovoljske ure.

Projekt nastaja pri predmetu Razvoj informacijskih rešitev in storitev (RIRS) na FERI, Univerza v Mariboru.

## Uporabniške vloge

- **Študent** – se prijavlja na akcije, razrešuje konflikte terminov in spremlja svoje ure.
- **Organizator** – objavlja akcije, sprejema ali zavrača prijave in označuje udeležbo.
- **Skrbnik** – potrjuje študente in odobrava organizacije.

## Tehnologije

| Področje | Tehnologija |
|---|---|
| Frontend | React (Vite), React Router, Fetch API |
| Backend | Node.js, Express |
| Podatkovna baza | MongoDB, Mongoose |
| Avtentikacija | JWT, bcrypt |
| Testiranje | Jest |
| Orodja | VS Code, Git, GitHub, Postman |

## Struktura repozitorija

```
├── frontend/   # React aplikacija (v pripravi)
├── backend/    # Express REST API (v pripravi)
└── docs/       # projektna dokumentacija
```

## Dokumentacija

1. [Zasnova rešitve](docs/01-zasnova-resitve.md)
2. [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
3. [Podatkovni model](docs/03-podatkovni-model.md)
4. [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
5. [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
6. [Wireframes](docs/06-wireframes.md)
7. [Arhitekturne odločitve (ADR)](docs/adr/)

## Razvojni proces

Repozitorij uporablja **GitHub Flow**: veja `main` je zaščitena, vse spremembe se razvijajo v ločenih vejah in združujejo prek pull requestov.