import faker from 'faker/locale/nb_NO';
import { MOCK_CONFIG } from './utils';

faker.seed(MOCK_CONFIG.seed);

function lagVeileder() {
    const kjonn = Math.random() > 0.5 ? 'K' : 'M';
    const fornavn = faker.name.firstName(kjonn === 'K' ? 1 : 0);
    const etternavn = faker.name.lastName(kjonn === 'K' ? 1 : 0);

    const id = 'Z' + (Math.floor(Math.random() * 1000000) + 100000);

    return {
        ident: id,
        navn: fornavn + ' ' + etternavn,
        fornavn: fornavn,
        etternavn: etternavn,
    };
}

export default {
    veilederListe: new Array(20).fill(0).map(() => lagVeileder()),
};
