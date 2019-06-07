
export const SessionStorageElement = {
    PRIVAT_BRUKER: 'privatbruker',
    EKSTERN_BRUKER: 'eksternbruker',

};

export const settSessionStorage = (key, value) => {
    window.sessionStorage.setItem(key, value);
};

export const hentFraSessionStorage = (key) => {
    return window.sessionStorage.getItem(key);
};

export const erEksternBruker = () => {
    return hentFraSessionStorage(SessionStorageElement.EKSTERN_BRUKER) === 'true';
};

export const erPrivatBruker = () => {
    return hentFraSessionStorage(SessionStorageElement.PRIVAT_BRUKER) === 'true';
};
