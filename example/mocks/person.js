import { MOCK_CONFIG } from './utils';
import faker from 'faker/locale/nb_NO';

faker.seed(MOCK_CONFIG.seed);
const kjonn = Math.random() > 0.5 ? 'K' : 'M';
const fornavn = faker.name.firstName(kjonn === 'K' ? 1 : 0);
const etternavn = faker.name.lastName(kjonn === 'K' ? 1 : 0);

export default function(fnr) {
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
        behandlendeEnhet: {},
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
