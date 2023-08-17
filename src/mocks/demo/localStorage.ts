export enum LocalStorageElement {
    PRIVAT_BRUKER = 'privatbruker',
    MANUELL_BRUKER = 'manuellbruker',
    KRR_BRUKER = 'krrbruker',
    GAMMEL_ESKALERT_BRUKER = 'eskalertbruker_gammel',
    ESKALERT_BRUKER = 'eskalertbruker',
    INNLOGGET_NIVAA4 = 'innlogget_nivaa4',
    OPPF_FEILET = 'oppffeilet',
    DIALOG_FEILET = 'dialogfeilet',
    AKTIVITET_FEILET = 'aktivitetfeilet',
    ARENA_FEILET = 'arenafeilet',
    MAAL_FEILET = 'maalfeilet',
    NIVAA4_FEILET = 'nivaa4feilet',
    OPPDATERING_KUN_FEILER = 'oppdonlyfeiler',
    EKSTERN_BRUKER = 'eksternbruker',
    INGEN_OPPF_PERIODER = 'ingen_oppf_perioder',
    AUTOMATISKE_AKTIVITETER = 'automatiske_aktiviteter',
    TEST_AKTIVITETER = 'testaktiviteter',
    ARENA_AKTIVITETER = 'arena_aktiviteter',
    EKSTERNE_AKTIVITETER = 'eksterne_aktiviteter',
    TEST_DIALOGER = 'test_dialoger',
    INGEN_MAL = 'ingen_mal',
    ULESTE_DIALOGER = 'uleste_dialoger',
}

export const settLocalStorage = (key: string, value: string | boolean) => {
    window.localStorage.setItem(key, String(value));
};

export const hentFraLocalStorage = (key: string) => {
    return window.localStorage.getItem(key);
};

const erSatt = (localStorageElement: LocalStorageElement) => hentFraLocalStorage(localStorageElement) === 'true';

const erSkrudAv = (localStorageElement: LocalStorageElement) => hentFraLocalStorage(localStorageElement) === 'false';

export const erEksternBruker = () => erSatt(LocalStorageElement.EKSTERN_BRUKER);

export const erPrivatBruker = () => erSatt(LocalStorageElement.PRIVAT_BRUKER);

export const erManuellBruker = () => erSatt(LocalStorageElement.MANUELL_BRUKER);

export const erKRRBruker = () => erSatt(LocalStorageElement.KRR_BRUKER);

export const erEskalertBrukerGammel = () => erSatt(LocalStorageElement.GAMMEL_ESKALERT_BRUKER);

export const erEskalertBruker = () => erSatt(LocalStorageElement.ESKALERT_BRUKER);

export const ikkeLoggetInnNivaa4 = () => erSatt(LocalStorageElement.INNLOGGET_NIVAA4);

export const ingenOppfPerioder = () => erSatt(LocalStorageElement.INGEN_OPPF_PERIODER);

export const visAutomatiskeAktiviteter = () => erSatt(LocalStorageElement.AUTOMATISKE_AKTIVITETER);

export const visTestAktiviteter = () => !erSkrudAv(LocalStorageElement.TEST_AKTIVITETER);

export const visArenaAktiviteter = () => erSatt(LocalStorageElement.ARENA_AKTIVITETER);

export const visEksterneAktiviteter = () => erSatt(LocalStorageElement.EKSTERNE_AKTIVITETER);

export const visDialoger = () => erSatt(LocalStorageElement.TEST_DIALOGER);

export const oppfFeilet = () => erSatt(LocalStorageElement.OPPF_FEILET);

export const dialogFeilet = () => erSatt(LocalStorageElement.DIALOG_FEILET);

export const aktivitetFeilet = () => erSatt(LocalStorageElement.AKTIVITET_FEILET);

export const arenaFeilet = () => erSatt(LocalStorageElement.ARENA_FEILET);

export const maalFeilet = () => erSatt(LocalStorageElement.MAAL_FEILET);

export const nivaa4Feilet = () => erSatt(LocalStorageElement.NIVAA4_FEILET);

export const oppdateringKunFeiler = () => erSatt(LocalStorageElement.OPPDATERING_KUN_FEILER);

export const ulesteDialoger = () => erSatt(LocalStorageElement.ULESTE_DIALOGER);

export const ingenMal = () => erSatt(LocalStorageElement.INGEN_MAL);
