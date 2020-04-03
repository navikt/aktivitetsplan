import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export function validateTittel(value) {
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut tema for samtalen';
    }
    if (value.length > 100) {
        return `Du må korte ned teksten til 100 tegn`;
    }

    return null;
}

export function validateReferat(value) {
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut samtalereferat';
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
    return null;
}

export function validateKanal(value) {
    if (value.length === 0) {
        return 'Du må fylle ut samtaleform';
    }
    return null;
}

export function validateFraDato(value) {
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut dato for samtalen';
    }
    return validerDato(value, null, null);
}
