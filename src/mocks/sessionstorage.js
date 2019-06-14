export const SessionStorageElement = {
    PRIVAT_BRUKER: 'privatbruker',
    EKSTERN_BRUKER: 'eksternbruker',
    INGEN_OPPF_PERIODER: 'ingen_oppf_perioder',
    AUTOMATISKE_AKTIVITETER: 'automatiske_aktiviteter',
    ARENA_AKTIVITETER: 'arena_aktiviteter',
};

export const settSessionStorage = (key, value) => {
    window.sessionStorage.setItem(key, value);
};

export const hentFraSessionStorage = key => {
    return window.sessionStorage.getItem(key);
};

export const erEksternBruker = () => {
    return (
        hentFraSessionStorage(SessionStorageElement.EKSTERN_BRUKER) === 'true'
    );
};

export const erPrivatBruker = () => {
    return (
        hentFraSessionStorage(SessionStorageElement.PRIVAT_BRUKER) === 'true'
    );
};

export const ingenOppfPerioder = () => {
    return (
        hentFraSessionStorage(SessionStorageElement.INGEN_OPPF_PERIODER) ===
        'true'
    );
};

export const visAutomatiskeAktiviteter = () => {
    return (
        hentFraSessionStorage(SessionStorageElement.AUTOMATISKE_AKTIVITETER) ===
        'true'
    );
};

export const visArenaAktiviteter = () => {
    return (
        hentFraSessionStorage(SessionStorageElement.ARENA_AKTIVITETER) ===
        'true'
    );
};
