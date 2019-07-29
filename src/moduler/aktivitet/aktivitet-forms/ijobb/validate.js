export function validateTittel(value) {
    if (value.trim().length <= 0) {
        return 'Du må fylle ut stillingstittel';
    }
    if (value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }

    return null;
}

export function validateFeltForLangt(value) {
    if (value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }
    return null;
}

export function validateBeskrivelse(value) {
    if (value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
    return null;
}

export function validateJobbstatus(value) {
    if (value.length <= 0) {
        return 'Du må velge heltid eller deltid';
    }
    return null;
}

export function validateFraDato(value) {
    if (value.trim().length <= 0) {
        return 'Du må fylle ut fra dato';
    }
    return null;
}
