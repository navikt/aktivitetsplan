[![CircleCI](https://circleci.com/gh/navikt/aktivitetsplan.svg?style=svg)](https://circleci.com/gh/navikt/aktivitetsplan)

# Aktivitetsplan

Aktivitetsplan er et verktøy for veiledere og brukere av NAV som skal synliggjøre hvilke aktiviteter og tiltak som skal
gjennomføres for at en bruker skal oppnå sine mål. Her kan brukere opprette aktiviteter som å delta på kurs, søke
på en bestemt jobb eller motta behandling. Bruker har også mulighet til å kommunisere direkte med sin veileder via en dialogløsning.

Dette prosjektet benytter seg av felleskomponenter fra [nav-frontend-moduler](https://github.com/navikt/nav-frontend-moduler).

### Hvordan bygge

Løsningen består av en versjon tilpasset for sluttbruker (utside) samt en versjon tilpasset veiledere på NAV (innside).

Kjør `npm run build` for å bygge både innside og utside.

### Utviklingsmilø

For å starte et utviklingsmiljø som kjører kontinuerlig bygg kan man kjøre `npm run dev:mock` for innside og
`npm run dev:mock:utside` for utside.

### Kontakt og spørsmål

Opprett en issue i GitHub for eventuelle spørsmål.
