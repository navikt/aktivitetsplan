import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export function validateBeskrivelse(avtalt, value) {
    if (avtalt) {
        return;
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
}

export function validateOppfolging(avtalt, value) {
    if (avtalt) {
        return;
    }
    if (value && value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }
}

export function validateAntallStillinger(avtalt, value) {
    if (avtalt || !value) {
        return;
    }

    if (!Number.isInteger(Number(value))) {
        return 'Antall må være et heltall';
    } else if (value > 99) {
        return 'Antall søknader må ikke være høyere enn 99';
    }
}

export function validateAntallStillingerIUken(avtalt, value, antallStillingerSokes) {
    if (avtalt || !!antallStillingerSokes) {
        return;
    }

    if (value.length === 0) {
        return 'Du må fylle ut antall søknader i uken';
    }

    if (!Number.isInteger(Number(value))) {
        return 'Antall må være et heltall';
    } else if (value > 99) {
        return 'Antall søknader må ikke være høyere enn 99';
    }
}

export function validateFraDato(avtalt, tilDato, value) {
    if (value.trim().length === 0) {
        return 'Du må fylle ut fra dato';
    }
    return validerDato(value, tilDato, null);
}

export function validateTilDato(avtalt, fraDato, value) {
    if (value.trim().length === 0) {
        return 'Du må fylle ut til dato';
    }
    return validerDato(value, null, fraDato);
}
