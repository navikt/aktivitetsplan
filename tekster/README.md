# Tekster for aktivitetsplan

FOO

## Tekstnøkler og navn på filer
Når man bruker applikasjonen kan man legge til parameteren `vistekster=true` i URL'en for å få se hvilke nøkler som ligger bak hvilke tekster. Avhengig av miljø vil URL'en se omtrent slik ut: `https://tjenester-t4.nav.no/aktivitetsplan/?vistekster=true`. Dette fungerer både i brukers flate og i saksbehandlers flate.
Et eksempel på en tekst med ?vistekster=true parameteren på, er `Aktivitetsplan [hovedside.tittel]`. Det som står mellom hakeparentesene er nøkkelen man kan bruke for å slå opp i BitBucket. Den akutelle filen for nøkkelen `hovedside.tittel` vil være `hovedside.tittel_nb.txt`. `nb` står for norsk bokmål, og hvis man skal oversette applikasjonen til andre spårk vil man lage et nytt sett med filer med andre språkkoder, f.eks. `nn` for nynorsk eller `en` for engelsk. Legg også merke til filendelsen `.txt` som må være med. Innholdet i filen er den teksten som vil vises i applikasjonen.


## Parameter substitusjon
I noen tilfeller vil en tekst inneholde krøllparenteser `{}`. Disse brukes for å legge til en variabel verdi i teksten. For eksempel `Beskrivelsen kan ikke være lenger enn {MAKS_LENGDE} tegn`. I dette tilfellet vil `MAKS_LENGDE` være en parameter som erstattes med f.eks. tallet 500.
Man kan fritt endre teksten utenfor krøllparentesene, men det som står innenfor er en kodeverdi som må spesifiseres akkurat slik.


## Forskjellige meldinger basert på parameter verdi
Ved å følge en spesiell syntaks kan man spesifisere forskjellige tekster basert på verdien av en parameter.
```
{underOppfolging, select,
true { Når du og NAV er enige om målet ditt, kan vi samarbeide om aktuelle aktiviteter. }
false { Legg inn hva slags arbeidsoppgaver og stillinger du ser etter. }
}
```
I eksempelet over sjekker vi parameteren `underOppfolging` og velger en av to tekster avhengig av om verdien av parameteren er `true` eller `false`. Med denne syntaksen må man være nøyaktig med krøllparenteser og komma, samt ordet `select` som er kodeordet som signaliserer at vi vil velge tekst basert på verdiene til parameterert.


## Nøkler for feilmeldinger
Tekstnøkler for feilmeldinger er håndtert litt spessielt i løsningen. For en gitt feilsituasjon som kan oppstå genererer vi et sett med nøkkler basert på hvilken opperasjon man forsøkte å utføre i det feilsituasjonen oppsto. Hvis man bruker `vistekster=true` parameteren vil man se en liste med alle nøklene for den aktuelle feilen, sortert synkende etter hvor spesifik nøkkelen er. Mange av disse nøklene vil ikke ha en verdi i BitBucket, og den som vises til bruker vil være den mest spesifikke som har en verdi.

#### Opprettelse av nye filer
Hvis man ønsker å legge til en mer spesifikk feilmelding, må man opprette en ny fil i BitBucket for den nøkkelen.
1. Klikk på `+ New File` knappen oppe til høyre
1. Fyll inn følgende i boksen for filename: `src/main/resources/[nøkkel]_nb.txt` hvor du erstatter `[nøkkel]` med den aktuelle nøkkelen du ønsker å legge til en tekst for. Husk å få med riktig språkkode og filendelse. Og desverre er man nødt til å ha med `src/main/resources/` foran filnavnet for at filen skal havne i riktig mappe.
1. Fyll inn ønsket tekst i editeringsvinduet.
1. Klikk på `Commit...` knappen og dertter på `Commit Changes` knappen i dialogen som dukker opp.

## Vilkårsteksten
I aktivitetsplan håndteres teksten for vilkår separat. Dette er fordi man ønsker å støtte rik formattering med HTML i vilkårsteksten. Og fordi man må ha en entydig historikk over endringer som gjøres i vilkårene. Selve teksten finnes her: http://stash.devillo.no/projects/TEKST/repos/veilarboppfolging-vilkar/browse/src/main/tekster/veilarboppfolging-vilkar Det ligger to filer der, en for brukere som er under oppfølging og en for de som ønsker å bruke planen i privat modus.
