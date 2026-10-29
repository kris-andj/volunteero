# Arhitektura odjemalec–strežnik z REST API-jem

- **Status:** sprejeta
- **Datum:** 2026-10-28

## Kontekst in opis problema

Aplikacija ima več poslovnih pravil: preverjanje prekrivanja terminov, zaznavanje konfliktov, število prostih mest in samodejno napredovanje čakalne vrste. Ta pravila morajo veljati enako za vse uporabnike in jih uporabnik ne sme zaobiti. Aplikacijo uporabljajo tri vloge (študent, organizator, skrbnik), ki vidijo različne zaslone. Odločiti sem se morala, kako razdelim aplikacijo na dele.

## Obravnavane možnosti

- **Odjemalec (React) + strežnik (REST API) + baza** – frontend in backend sta ločena, komunicirata prek API-ja.
- **Firebase** – odjemalec dostopa neposredno do baze, pravila se pišejo v nastavitvah Firebase.
- **Mikrostoritve** – vsak del aplikacije je svoja storitev.

## Odločitev

Izbrala sem »odjemalec + REST API + baza«, ker se vsa pravila izvajajo na strežniku in jih iz brskalnika ni mogoče spremeniti. Vse tri vloge uporabljajo isti API, razlikujejo se le zasloni v frontendu.

Firebase nisem izbrala, ker bi bila pravila za čakalno vrsto težja za izvedbo, aplikacija pa bi bila vezana na enega ponudnika. Mikrostoritve so za projekt te velikosti preveč zapletene.

## Posledice

### Pozitivne

- Vsa pravila so na enem mestu, na strežniku.
- API lahko testiram brez frontenda (Postman, Jest).
- Isti API bi lahko kasneje uporabila tudi mobilna aplikacija.

### Negativne

- Zagnati moram dva dela: frontend in backend.
- Nastaviti moram komunikacijo med njima (CORS, žetoni).