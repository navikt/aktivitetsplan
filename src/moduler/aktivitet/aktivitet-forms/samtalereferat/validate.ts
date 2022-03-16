import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export const validateTittel = (value?: string) => {
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut tema for samtalen';
    }
    if (value.length > 100) {
        return `Du må korte ned teksten til 100 tegn`;
    }
};

export const validateReferat = (value?: string) => {
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut samtalereferat';
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
};

export const validateKanal = (value: string) => {
    if (value.length === 0) {
        return 'Du må fylle ut samtaleform';
    }
};

export const validateFraDato = (value?: string) => {
    if (!value || value.trim().length === 0) {
        return 'Du må fylle ut dato for samtalen';
    }
    return validerDato(value);
};
