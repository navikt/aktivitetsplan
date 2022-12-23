let id = 1002;
let versjon = 1002;

export function etSamtalereferat({ tittel }) {
    id += 1000;
    versjon += 1000;

    return {
        id: `${id}`,
        versjon: `${versjon}`,
        tittel,
        referat: 'Dette er et referat\n\nMed flere avsnitt.\nOg linjeskift.',
        adresse: null,
        ansettelsesforhold: null,
        antallStillingerIUken: null,
        antallStillingerSokes: null,
        arbeidsgiver: null,
        arbeidssted: null,
        arbeidstid: null,
        avsluttetKommentar: null,
        avtaleOppfolging: null,
        avtalt: false,
        behandlingOppfolging: null,
        behandlingSted: null,
        behandlingType: null,
        beskrivelse: null,
        effekt: null,
        endretAv: '1602677081175',
        endretDato: '2020-10-14T12:04:41.175Z',
        erReferatPublisert: true,
        etikett: null,
        forberedelser: null,
        fraDato: '2020-10-14T12:04:33.649Z',
        hensikt: null,
        historisk: false,
        jobbStatus: null,
        kanal: 'TELEFON',
        kontaktperson: null,
        lagtInnAv: 'NAV',
        lenke: null,
        oppfolging: null,
        opprettetDato: '2020-10-14T12:04:41.175Z',
        status: 'GJENNOMFORES',
        stillingsTittel: null,
        tilDato: null,
        transaksjonsType: 'OPPRETTET',
        type: 'SAMTALEREFERAT',
        forhaandsorientering: null,
    };
}
