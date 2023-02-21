import { RangeValidationT } from '@navikt/ds-react/esm/date/hooks/useRangeDatepicker';

import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export function validateBeskrivelse(avtalt: any, value: any) {
    if (avtalt) {
        return;
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
}

export function validateOppfolging(avtalt: any, value: any) {
    if (avtalt) {
        return;
    }
    if (value && value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }
}

export function validateAntallStillinger(avtalt: any, value: any) {
    if (avtalt || !value) {
        return;
    }

    if (!Number.isInteger(Number(value))) {
        return 'Antall må være et heltall';
    } else if (value > 99) {
        return 'Antall søknader må ikke være høyere enn 99';
    }
}

export function validateAntallStillingerIUken(avtalt: any, value: any, antallStillingerSokes: any) {
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

export function validateFraDato(avtalt: any, tilDato: any, value: any) {
    if (value.trim().length === 0) {
        return 'Du må fylle ut fra dato';
    }
    return validerDato(value, tilDato, null as any);
}

export function validateTilDato(avtalt: any, fraDato: any, value: any) {
    if (value.trim().length === 0) {
        return 'Du må fylle ut til dato';
    }
    return validerDato(value, null as any, fraDato);
}

interface RangeError {
    from?: string;
    to?: string;
}

export const validateRange = (range: RangeValidationT): RangeError => {
    let fromError;
    if (range.from.isEmpty) {
        fromError = 'Du må fylle ut fra dato';
    } else if (range.from.isInvalid) {
        fromError = 'Fra dato er ugyldig';
    }

    let toError;
    if (range.to.isEmpty) {
        toError = 'Du må fylle ut til dato';
    } else if (range.to.isInvalid) {
        toError = 'Til dato er ugyldig';
    }

    return {
        from: fromError,
        to: toError,
    };
};
