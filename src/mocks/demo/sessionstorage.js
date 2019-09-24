export const SessionStorageElement = {
    PRIVAT_BRUKER: 'privatbruker',
    MANUELL_BRUKER: 'manuellbruker',
    EKSTERN_BRUKER: 'eksternbruker',
    INGEN_OPPF_PERIODER: 'ingen_oppf_perioder',
    AUTOMATISKE_AKTIVITETER: 'automatiske_aktiviteter',
    TEST_AKTIVITETER: 'testaktiviteter',
    ARENA_AKTIVITETER: 'arena_aktiviteter',
    TEST_DIALOGER: 'test_dialoger'
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

export const ingenOppfPerioder = () => erSatt(SessionStorageElement.INGEN_OPPF_PERIODER);

export const visAutomatiskeAktiviteter = () => erSatt(SessionStorageElement.AUTOMATISKE_AKTIVITETER);

export const visTestAktiviteter = () => !erSkrudAv(SessionStorageElement.TEST_AKTIVITETER);

export const visArenaAktiviteter = () => erSatt(SessionStorageElement.ARENA_AKTIVITETER);

export const visDialoger = () => erSatt(SessionStorageElement.TEST_DIALOGER);

const fetureprefix = 'mock_feature__';
export const setFeatureTogle = (name, value) => settSessionStorage(fetureprefix + name, value);
export const fetureStatus = name => hentFraSessionStorage(fetureprefix + name) !== 'false';
