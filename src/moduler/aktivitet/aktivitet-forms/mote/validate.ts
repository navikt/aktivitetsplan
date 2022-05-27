import moment, { now } from 'moment';

import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

const TITTEL_MAKS_LENGDE = 100;
const TITTEL_MAKS_LENGDE_TEKST = `Du må korte ned teksten til ${TITTEL_MAKS_LENGDE} tegn`;
export const ADRESSE_MAKS_LENGDE = 255;
const ADRESSE_MAKS_LENGDE_TEKST = `Du må korte ned teksten til ${ADRESSE_MAKS_LENGDE} tegn`;
export const HENSIKT_MAKS_LENGDE = 5000;
const HENSIKT_MAKS_LENGDE_TEKST = `Du må korte ned teksten til ${HENSIKT_MAKS_LENGDE} tegn`;
export const FORBEREDELSER_MAKS_LENGDE = 500;
const FORBEREDELSER_MAKS_LENGDE_TEKST = `Du må korte ned teksten til ${FORBEREDELSER_MAKS_LENGDE} tegn`;

const tekstForLang = (maxLengde: number, value: string) => {
    return value.length > maxLengde;
};

const erVerdiSatt = (value: string) => {
    return value && value.trim().length > 0;
};

export const validateTittel = (avtalt: boolean, value: string) => {
    if (avtalt) {
        return;
    }

    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut tema for møtet';
    }

    if (tekstForLang(TITTEL_MAKS_LENGDE, value)) {
        return TITTEL_MAKS_LENGDE_TEKST;
    }
};

export const validateAdresse = (_avtalt: boolean, value: string) => {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut møtested eller annen praktisk informasjon';
    }

    if (tekstForLang(ADRESSE_MAKS_LENGDE, value)) {
        return ADRESSE_MAKS_LENGDE_TEKST;
    }
};

export const validateMoteDato = (value: string) => {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut dato for møtet';
    }

    const fraDato = moment(value);

    if (fraDato.isBefore(moment(now()), 'day')) return 'Datoen må tidligst være i dag';

    return validerDato(value);
};

export const validateHensikt = (avtalt: boolean, value: string) => {
    if (avtalt) {
        return;
    }

    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut hensikten med møtet';
    }

    if (tekstForLang(HENSIKT_MAKS_LENGDE, value)) {
        return HENSIKT_MAKS_LENGDE_TEKST;
    }
};

export const validateForberedelser = (avtalt: boolean, value: string) => {
    if (avtalt) {
        return;
    }

    if (tekstForLang(FORBEREDELSER_MAKS_LENGDE, value)) {
        return FORBEREDELSER_MAKS_LENGDE_TEKST;
    }
};

export const validateKlokkeslett = (_avtalt: boolean, value: string) => {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut klokkeslett';
    }
};

export const validateVarighet = (_avtalt: boolean, value: string) => {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut varighet';
    }
};
export const validateKanal = (_avtalt: boolean, value: string) => {
    if (!erVerdiSatt(value)) {
        return 'Du må fylle ut møteform';
    }
};
