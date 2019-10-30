export const SessionStorageElement = {
    PRIVAT_BRUKER: 'privatbruker',
    MANUELL_BRUKER: 'manuellbruker',
    KRR_BRUKER: 'krrbruker',
    ESKALERT_BRUKER: 'eskalertbruker',
    OPPF_FEILET: 'oppffeilet',
    EKSTERN_BRUKER: 'eksternbruker',
    INGEN_OPPF_PERIODER: 'ingen_oppf_perioder',
    AUTOMATISKE_AKTIVITETER: 'automatiske_aktiviteter',
    TEST_AKTIVITETER: 'testaktiviteter',
    ARENA_AKTIVITETER: 'arena_aktiviteter',
    TEST_DIALOGER: 'test_dialoger',
    INGEN_MAL: 'ingen_mal'
};

export const settSessionStorage = (key, value) => {
    window.localStorage.setItem(key, value);
};

export const hentFraSessionStorage = key => {
    return window.localStorage.getItem(key);
};

const erSatt = sessionStorageElement => {
    return hentFraSessionStorage(sessionStorageElement) === 'true';
};

const erSkrudAv = sessionStorageElement => hentFraSessionStorage(sessionStorageElement) === 'false';

export const erEksternBruker = () => erSatt(SessionStorageElement.EKSTERN_BRUKER);

export const erPrivatBruker = () => erSatt(SessionStorageElement.PRIVAT_BRUKER);

export const erManuellBruker = () => erSatt(SessionStorageElement.MANUELL_BRUKER);

export const erKRRBruker = () => erSatt(SessionStorageElement.KRR_BRUKER);

export const erEskalertBruker = () => erSatt(SessionStorageElement.ESKALERT_BRUKER);

export const ingenOppfPerioder = () => erSatt(SessionStorageElement.INGEN_OPPF_PERIODER);

export const visAutomatiskeAktiviteter = () => erSatt(SessionStorageElement.AUTOMATISKE_AKTIVITETER);

export const visTestAktiviteter = () => !erSkrudAv(SessionStorageElement.TEST_AKTIVITETER);

export const visArenaAktiviteter = () => erSatt(SessionStorageElement.ARENA_AKTIVITETER);

export const visDialoger = () => erSatt(SessionStorageElement.TEST_DIALOGER);

export const oppfFeilet = () => erSatt(SessionStorageElement.OPPF_FEILET);

const fetureprefix = 'mock_feature__';
export const setFeatureTogle = (name, value) => settSessionStorage(fetureprefix + name, value);
export const fetureStatus = name => hentFraSessionStorage(fetureprefix + name) !== 'false';

export const ingenMal = () => erSatt(SessionStorageElement.INGEN_MAL);
