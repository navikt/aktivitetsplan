import { hentFraSessionStorage, SessionStorageElement } from "./sessionstorage";

const eksternbruker = {
    id: '1234567890',
    erVeileder: false,
    erBruker: true,
};

const veileder = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

const erEksternbruker = hentFraSessionStorage(SessionStorageElement.EKSTERN_BRUKER) === 'true';

export default () => {
    if (erEksternbruker) return eksternbruker;
    else return veileder;
};
