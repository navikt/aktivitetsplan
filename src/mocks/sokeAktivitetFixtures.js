let id = 1001;
let versjon = 9001;

export function enSokeAktivitet({ tittel }) {
    id += 1000;

    versjon += 1000;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel,
        beskrivelse:
            'Nav forventer at du søker omtrent 20 stillinger i denne perioden. Det er viktig at du søker på de jobbene du mener du er kvalifisert for. Det er også viktig å søke på mange stillinger, det øker sjansene dine til å finne en jobb. Legg til hver stilling du søker i aktiviteten «En jobb jeg vil søke på».',
        lenke: null,
        type: 'SOKEAVTALE',
        status: 'GJENNOMFORES',
        fraDato: '2023-01-21T08:00:00+02:00',
        tilDato: '2023-08-21T12:15:00+02:00',
        opprettetDato: '2018-08-21T11:55:14.044+02:00',
        endretDato: '2018-08-21T11:57:57.636+02:00',
        endretAv: 'z990207',
        historisk: false,
        avsluttetKommentar: null,
        avtalt: true,
        endretAvType: 'NAV',
        transaksjonsType: 'OPPRETTET',
        etikett: null,
        kontaktperson: null,
        arbeidsgiver: null,
        arbeidssted: null,
        stillingsTittel: null,
        hensikt: null,
        oppfolging: null,
        antallStillingerSokes: null,
        antallStillingerIUken: 5,
        avtaleOppfolging: null,
        jobbStatus: null,
        ansettelsesforhold: null,
        arbeidstid: null,
        behandlingType: null,
        behandlingSted: null,
        effekt: null,
        behandlingOppfolging: null,
        kanal: null,
        erReferatPublisert: false,
        forhaandsorientering: null,
    };
}
