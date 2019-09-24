import { erEksternBruker } from './demo/sessionstorage';

const eksternbruker = {
    id: '1234567890',
    erVeileder: false,
    erBruker: true
};

const veileder = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false
};

const erEksternbruker = erEksternBruker();

export default () => {
    if (erEksternbruker) return eksternbruker;
    else return veileder;
};
