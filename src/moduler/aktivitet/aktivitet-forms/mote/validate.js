import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

const TITTEL_MAKS_LENGDE = 100;
const TITTEL_MAKS_LENGDE_TEKST = `Du må korte ned teksten til ${TITTEL_MAKS_LENGDE} tegn`;
export const ADRESSE_MAKS_LENGDE = 255;
const ADRESSE_MAKS_LENGDE_TEKST = `Du må korte ned teksten til ${ADRESSE_MAKS_LENGDE} tegn`;
export const HENSIKT_MAKS_LENGDE = 5000;
const HENSIKT_MAKS_LENGDE_TEKST = `Du må korte ned teksten til ${HENSIKT_MAKS_LENGDE} tegn`;
export const FORBEREDELSER_MAKS_LENGDE = 500;

function tekstForLang(maxLengde, value) {
    return value.length > maxLengde;
}

function erVerdiSatt(value) {
    return value && value.trim().length > 0;
}

export function validateTittel(avtalt, value) {
    if (avtalt) {
        return null;
    }

    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut tema for møtet';
    }

    if (tekstForLang(TITTEL_MAKS_LENGDE, value)) {
        return TITTEL_MAKS_LENGDE_TEKST;
    }

    return null;
}

export function validateAdresse(avtalt, value) {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut møtested eller annen praktisk informasjon';
    }

    if (tekstForLang(ADRESSE_MAKS_LENGDE, value)) {
        return ADRESSE_MAKS_LENGDE_TEKST;
    }

    return null;
}

export function validateFraDato(avtalt, tilDato, value) {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut dato for møtet';
    }

    return validerDato(value, tilDato, null);
}

export function validateHensikt(avtalt, value) {
    if (avtalt) {
        return null;
    }

    if (tekstForLang(HENSIKT_MAKS_LENGDE, value)) {
        return HENSIKT_MAKS_LENGDE_TEKST;
    }

    return null;
}

export function validateForberedelser(avtalt, value) {
    if (avtalt) {
        return null;
    }

    if (tekstForLang(FORBEREDELSER_MAKS_LENGDE, value)) {
        return HENSIKT_MAKS_LENGDE_TEKST;
    }

    return null;
}

export function validateKlokkeslett(avtalt, value) {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut klokkeslett';
    }

    return null;
}

export function validateVarighet(avtalt, value) {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut varighet';
    }

    return null;
}
export function validateKanal(avtalt, value) {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut møteform';
    }

    return null;
}
