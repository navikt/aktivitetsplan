import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export function validateBehandlingType(avtalt, value) {
    if (avtalt) {
        return undefined;
    }
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut type behandling';
    }
    if (value.length > 100) {
        return `Du må korte ned teksten til 100 tegn`;
    }

    return null;
}
export function validateBehandlingSted(avtalt, value) {
    if (avtalt) {
        return undefined;
    }
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut behandlingssted';
    }
    if (value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }

    return undefined;
}

export function validateFeltForLangt(avtalt, value) {
    if (avtalt) {
        return undefined;
    }
    if (value && value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }
    return undefined;
}

export function validateFraDato(avtalt, tilDato, value) {
    if (avtalt) {
        return undefined;
    }
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut fra dato';
    }
    return validerDato(value, tilDato, null);
}

export function validateTilDato(fraDato, value) {
    if (!value || value.trim().length === 0) {
        return (
            'Du må fylle ut til dato. Hvis du ikke vet når behandlingen avsluttes, ' +
            'kan du legge inn en foreløpig til dato.'
        );
    }
    return validerDato(value, null, fraDato);
}

export function validateBeskrivelse(avtalt, value) {
    if (avtalt) {
        return undefined;
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
    return undefined;
}
