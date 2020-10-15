const kjonn = Math.random() > 0.5 ? 'K' : 'M';
const fornavn = 'Test';
const etternavn = 'Testus';

export default function (fnr) {
    return {
        fornavn: fornavn,
        mellomnavn: null,
        etternavn: etternavn,
        sammensattNavn: `${fornavn} ${etternavn}`,
        fodselsnummer: fnr,
        fodselsdato: '1900-00-00',
        dodsdato: null,
        barn: [],
        diskresjonskode: null,
        kontonummer: '',
        geografiskTilknytning: '',
        behandlendeEnhet: {
            enhetsnummer: '007',
            navn: 'Den sorte dame',
        },
        telefon: null,
        epost: null,
        statsborgerskap: 'NORGE',
        sikkerhetstiltak: null,
        sivilstand: {},
        partner: null,
        bostedsadresse: {},
        midlertidigAdresseNorge: null,
        midlertidigAdresseUtland: null,
        postAdresse: null,
        egenAnsatt: false,
        kjonn: kjonn,
    };
}
