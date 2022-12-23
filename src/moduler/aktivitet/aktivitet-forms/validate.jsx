import { validerDato } from '../../../felles-komponenter/skjema/datovelger/utils';

export function validateFeltForLangt(avtalt, value) {
    if (avtalt) {
        return undefined;
    }
    if (value && value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }
}

export function validateBeskrivelse(avtalt, value) {
    if (avtalt) {
        return;
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
}

export function validateLenke(avtalt, value) {
    if (avtalt) {
        return;
    }
    if (value && value.length > 2000) {
        return `Du må korte ned teksten til 2000 tegn`;
    }
}

export function validateFraDato(avtalt, tilDato, value) {
    if (avtalt) {
        return;
    }
    if (!value || value.trim().length <= 0) {
        return 'Du må fylle ut fra dato';
    }
    return validerDato(value, tilDato, null);
}
