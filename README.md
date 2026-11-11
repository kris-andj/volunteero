# Volunteero

Spletna aplikacija, v kateri študentske in druge organizacije objavljajo prostovoljske akcije, študenti pa se nanje prijavljajo. Sistem zazna prekrivanje terminov, vodi čakalno vrsto za polne akcije in študentom samodejno šteje opravljene prostovoljske ure.

Projekt nastaja pri predmetu Razvoj informacijskih rešitev in storitev (RIRS) na FERI, Univerza v Mariboru.

## Uporabniške vloge

- **Študent** – pregleduje akcije (tudi v svoji bližini), se prijavlja, razrešuje konflikte terminov in spremlja svoje ure.
- **Organizator** – objavlja akcije svoje organizacije, sprejema ali zavrača prijave in označuje udeležbo.
- **Skrbnik** – potrjuje študente in odobrava organizacije.

## Tehnologije

| Področje | Tehnologija |
|---|---|
| Frontend | React (Vite), React Router, Fetch API, lucide-react |
| Backend | Node.js, Express |
| Podatkovna baza | MongoDB (lokalno), Mongoose |
| Avtentikacija | JWT, bcrypt |
| Orodja | VS Code, Git, GitHub, MongoDB Compass |

## Struktura repozitorija

```
├── backend/            # Express REST API
│   ├── middleware/     # preverjanje JWT žetona in vlog
│   ├── models/         # Mongoose modeli (Uporabnik, Organizacija, Akcija, Prijava)
│   ├── routes/         # končne točke API-ja
│   ├── services/       # samodejno napredovanje čakalne vrste
│   └── scripts/        # skripta za ustvarjanje skrbnika
├── frontend/           # React aplikacija
│   └── src/
│       ├── components/ # skupne komponente
│       └── pages/      # strani za študenta, organizatorja in skrbnika
└── docs/               # projektna dokumentacija
```

## Lokalni zagon

### Predpogoji

- [Node.js](https://nodejs.org) (LTS različica)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community), nameščen in zagnan kot storitev (privzeto na `mongodb://localhost:27017`)
- Git

### 1. Kloniranje repozitorija

```bash
git clone https://github.com/kris-andj/volunteero.git
cd volunteero
```

### 2. Backend

```bash
cd backend
npm install
```

V mapi `backend` ustvarite datoteko `.env` po vzoru `.env.example`:

```
PORT=5050
MONGODB_URI=mongodb://localhost:27017/volunteero
JWT_SKRIVNOST=poljubna_skrivnost
```

Ustvarite skrbnika (samo prvič) in zaženite strežnik:

```bash
npm run skrbnik
npm run dev
```

Strežnik teče na `http://localhost:5050`. Delovanje preverite na `http://localhost:5050/api`.

### 3. Frontend

V novem terminalu:

```bash
cd frontend
npm install
npm run dev
```

Aplikacija je dostopna na `http://localhost:5173`.

### 4. Prvi koraki

1. Prijavite se kot skrbnik: `skrbnik@volunteero.si` / `skrbnik123`.
2. V drugem zavihku se registrirajte kot organizacija in kot študent.
3. Skrbnik v razdelku **Potrditve** odobri organizacijo in potrdi študenta.
4. Organizator objavi akcijo, študent se nanjo prijavi, organizator prijavo sprejme.

## Glavne končne točke API-ja

| Metoda | Pot | Vloga |
|---|---|---|
| POST | `/api/registracija`, `/api/vpis` | vsi |
| GET | `/api/akcije` | vsi |
| GET / POST | `/api/akcije/moje`, `/api/akcije` | organizator |
| POST | `/api/akcije/:id/prijave` | študent |
| GET | `/api/prijave/moje` | študent |
| PATCH | `/api/prijave/:id/resi-konflikt`, `/api/prijave/:id/preklici` | študent |
| GET | `/api/prijave/akcija/:akcijaId` | organizator |
| PATCH | `/api/prijave/:id/sprejmi`, `/zavrni`, `/udelezba` | organizator |
| GET / PATCH | `/api/skrbnik/uporabniki`, `/api/skrbnik/organizacije` | skrbnik |

## Dokumentacija

1. [Zasnova rešitve](docs/01-zasnova-resitve.md)
2. [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
3. [Podatkovni model](docs/03-podatkovni-model.md)
4. [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
5. [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
6. [Wireframes](docs/06-wireframes.md)
7. [Arhitekturne odločitve (ADR)](docs/adr/)

## Razvojni proces

Repozitorij uporablja **GitHub Flow**: veja `main` je zaščitena, vsaka naloga je GitHub Issue na tabli GitHub Projects, razvija se v ločeni veji in združi prek pull requesta, ki zapre pripadajoči Issue.

## Avtorica

Kristina Andjelkovic