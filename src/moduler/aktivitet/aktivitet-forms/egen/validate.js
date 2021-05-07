import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export function validateTittel(avtalt, value) {
    if (avtalt) {
        return;
    }
    if (!value || value.trim().length <= 0) {
        return 'Du må fylle ut navn på aktiviteten';
    }
    if (value.length > 100) {
        return `Du må korte ned teksten til 100 tegn`;
    }
}

export function validateTilDato(fraDato, value) {
    if (!value || value.trim().length <= 0) {
        return 'Du må fylle ut til dato';
    }
    return validerDato(value, null, fraDato);
}
