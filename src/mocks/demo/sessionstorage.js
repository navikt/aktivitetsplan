export const SessionStorageElement = {
    PRIVAT_BRUKER: 'privatbruker',
    MANUELL_BRUKER: 'manuellbruker',
    KRR_BRUKER: 'krrbruker',
    GAMMEL_ESKALERT_BRUKER: 'eskalertbruker_gammel',
    ESKALERT_BRUKER: 'eskalertbruker',
    INNLOGGET_NIVAA4: 'innlogget_nivaa4',
    OPPF_FEILET: 'oppffeilet',
    DIALOG_FEILET: 'dialogfeilet',
    AKTIVITET_FEILET: 'aktivitetfeilet',
    ARENA_FEILET: 'arenafeilet',
    MAAL_FEILET: 'maalfeilet',
    NIVAA4_FEILET: 'nivaa4feilet',
    OPPDATERING_KUN_FEILER: 'oppdonlyfeiler',
    EKSTERN_BRUKER: 'eksternbruker',
    INGEN_OPPF_PERIODER: 'ingen_oppf_perioder',
    AUTOMATISKE_AKTIVITETER: 'automatiske_aktiviteter',
    TEST_AKTIVITETER: 'testaktiviteter',
    ARENA_AKTIVITETER: 'arena_aktiviteter',
    EKSTERNE_AKTIVITETER: 'eksterne_aktiviteter',
    TEST_DIALOGER: 'test_dialoger',
    INGEN_MAL: 'ingen_mal',
    ULESTE_DIALOGER: 'uleste_dialoger',
};

export const settSessionStorage = (key, value) => {
    window.localStorage.setItem(key, value);
};

export const hentFraSessionStorage = (key) => {
    return window.localStorage.getItem(key);
};

const erSatt = (sessionStorageElement) => {
    return hentFraSessionStorage(sessionStorageElement) === 'true';
};

const erSkrudAv = (sessionStorageElement) => hentFraSessionStorage(sessionStorageElement) === 'false';

export const erEksternBruker = () => erSatt(SessionStorageElement.EKSTERN_BRUKER);

export const erPrivatBruker = () => erSatt(SessionStorageElement.PRIVAT_BRUKER);

export const erManuellBruker = () => erSatt(SessionStorageElement.MANUELL_BRUKER);

export const erKRRBruker = () => erSatt(SessionStorageElement.KRR_BRUKER);

export const erEskalertBrukerGammel = () => erSatt(SessionStorageElement.GAMMEL_ESKALERT_BRUKER);

export const erEskalertBruker = () => erSatt(SessionStorageElement.ESKALERT_BRUKER);

export const ikkeLoggetInnNivaa4 = () => erSatt(SessionStorageElement.INNLOGGET_NIVAA4);

export const ingenOppfPerioder = () => erSatt(SessionStorageElement.INGEN_OPPF_PERIODER);

export const visAutomatiskeAktiviteter = () => erSatt(SessionStorageElement.AUTOMATISKE_AKTIVITETER);

export const visTestAktiviteter = () => !erSkrudAv(SessionStorageElement.TEST_AKTIVITETER);

export const visArenaAktiviteter = () => erSatt(SessionStorageElement.ARENA_AKTIVITETER);

export const visEksterneAktiviteter = () => erSatt(SessionStorageElement.EKSTERNE_AKTIVITETER);

export const visDialoger = () => erSatt(SessionStorageElement.TEST_DIALOGER);

export const oppfFeilet = () => erSatt(SessionStorageElement.OPPF_FEILET);

export const dialogFeilet = () => erSatt(SessionStorageElement.DIALOG_FEILET);

export const aktivitetFeilet = () => erSatt(SessionStorageElement.AKTIVITET_FEILET);

export const arenaFeilet = () => erSatt(SessionStorageElement.ARENA_FEILET);

export const maalFeilet = () => erSatt(SessionStorageElement.MAAL_FEILET);

export const nivaa4Feilet = () => erSatt(SessionStorageElement.NIVAA4_FEILET);

export const oppdateringKunFeiler = () => erSatt(SessionStorageElement.OPPDATERING_KUN_FEILER);

export const ulesteDialoger = () => erSatt(SessionStorageElement.ULESTE_DIALOGER);

const fetureprefix = 'mock_feature__';
export const setFeatureTogle = (name, value) => settSessionStorage(fetureprefix + name, value);
export const fetureStatus = (name) => hentFraSessionStorage(fetureprefix + name) !== 'false';

export const ingenMal = () => erSatt(SessionStorageElement.INGEN_MAL);
