import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export function validateTittel(avtalt, value) {
    if (avtalt) {
        return null;
    }
    if (!value || value.trim().length <= 0) {
        return 'Du må fylle ut navn på aktiviteten';
    }
    if (value.length > 100) {
        return `Du må korte ned teksten til 100 tegn`;
    }

    return null;
}

export function validateFeltForLangt(avtalt, value) {
    if (avtalt) {
        return null;
    }
    if (value && value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }
    return null;
}

export function validateBeskrivelse(avtalt, value) {
    if (avtalt) {
        return null;
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
    return null;
}

export function validateLenke(avtalt, value) {
    if (avtalt) {
        return null;
    }
    if (value && value.length > 2000) {
        return `Du må korte ned teksten til 2000 tegn`;
    }
    return null;
}

export function validateFraDato(avtalt, tilDato, value) {
    if (avtalt) {
        return null;
    }
    if (!value || value.trim().length <= 0) {
        return 'Du må fylle ut fra dato';
    }
    return validerDato(value, tilDato, null);
}

export function validateTilDato(fraDato, value) {
    if (!value || value.trim().length <= 0) {
        return 'Du må fylle ut til dato';
    }
    return validerDato(value, null, fraDato);
}
