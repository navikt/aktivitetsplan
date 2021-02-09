import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export const validateBehandlingType = (avtalt: boolean, value?: string) => {
    if (avtalt) {
        return undefined;
    }
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut type behandling';
    }
    if (value.length > 100) {
        return 'Du må korte ned teksten til 100 tegn';
    }

    return undefined;
};

export const validateBehandlingSted = (avtalt: boolean, value?: string) => {
    if (avtalt) {
        return undefined;
    }
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut behandlingssted';
    }
    if (value.length > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }

    return undefined;
};

export const validateFeltForLangt = (avtalt: boolean, value?: string) => {
    if (avtalt) {
        return undefined;
    }
    if (value && value.length > 255) {
        return 'Du må korte ned teksten til 255 tegn';
    }
    return undefined;
};

export const validateFraDato = (avtalt: boolean, tilDato: string, value?: string) => {
    if (avtalt) {
        return undefined;
    }
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut fra dato';
    }

    const validertDato = validerDato(value, tilDato, null);

    return validertDato ? validertDato : undefined;
};

export const validateTilDato = (fraDato: string, value?: string) => {
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut til dato. Hvis du ikke vet når behandlingen avsluttes, kan du legge inn en foreløpig til dato.';
    }

    const validertDato = validerDato(value, null, fraDato);

    return validertDato ? validertDato : undefined;
};

export const validateBeskrivelse = (avtalt: boolean, value?: string) => {
    if (avtalt) {
        return undefined;
    }
    if (value && value.length > 5000) {
        return 'Du må korte ned teksten til 5000 tegn';
    }
    return undefined;
};
