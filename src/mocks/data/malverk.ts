import { RestRequest } from 'msw';

const egenMalverk = [
    {
        hensikt: 'Bli synlig for arbeidsgivere',
        fraDato: '2018-04-24T14:20:36.716Z',
        type: 'EGEN',
        tittel: 'Du må registrere CV-en din på nav.no',
        tilDato: '2018-05-02T14:20:36.716Z',
        lenke: 'https://tjenester.nav.no/sbl/nav_security_check?goto=/sbl/arbeid/endreCv',
        beskrivelse:
            'Som arbeidssøker er det viktig at du er synlig for flest mulige arbeidsgivere. Det blir du ved å registrere CV-en din på nav.no, Nav samarbeider med bemannings- og rekrutteringsbransjen. Det er også nødvendig for Nav å ha CV-din for å kunne følge deg opp på en god måte.',
        status: 'BRUKER_ER_INTERESSERT',
    },
    {
        hensikt: 'Bli synlig for arbeidsgivere',
        fraDato: '2018-04-24T14:20:36.718Z',
        oppfolging: '',
        type: 'EGEN',
        tittel: 'Du må registrere jobbønskene dine på nav.no',
        tilDato: '2018-05-02T14:20:36.718Z',
        lenke: 'https://tjenester.nav.no/sbl/nav_security_check?goto=/sbl/arbeid/endrePreferanser',
        beskrivelse:
            'Jobbønskene dine gir match når arbeidsgivere og veiledere i Nav leter etter kandidater i CV-basen vår. Du får også et automatisk abonnement på ledige stillinger',
        status: 'BRUKER_ER_INTERESSERT',
    },
    {
        hensikt: 'Få råd og tips når du søker jobber',
        fraDato: '2018-04-24T14:20:36.718Z',
        oppfolging: '',
        type: 'EGEN',
        tittel: 'Hvordan søker du jobber?',
        tilDato: '2018-05-08T14:20:36.718Z',
        lenke: 'https://tjenester.nav.no/jobbsokerkompetanse/',
        beskrivelse:
            'Svar på noen spørsmål om hvordan du søker på jobber. Få råd og tips til søknaden, CV-en, intervjuet og hvordan du finner jobbene.',
        status: 'BRUKER_ER_INTERESSERT',
    },
];

export const hentMalverk = async (req: RestRequest) => {
    const body = await req.json();
    const { type } = body;

    if (type === 'EGEN') {
        return egenMalverk;
    } else {
        return [];
    }
};
