import { HENTING_FEILET as AKTIVITET_HENT_FEILET } from '../aktivitet/aktivitet-action-types';
import { HENTING_FEILET as DIALOG_HENT_FEIL } from '../dialog/dialog-reducer';

import { FeilmeldingType } from './FeilmeldingTypes';

export const tekster = {
    fallback: 'Noe gikk dessverre galt med aktivitetsplanen. Prøv igjen senere.',
    aktivitetFeilet: 'Noe gikk galt, og du får dessverre ikke sett alle aktiviteter. Prøv igjen senere.',
    dialogFeilet: 'Noe gikk galt, og du får dessverre ikke sett dialogmeldinger. Prøv igjen senere.',
    unauthorized: 'Du er blitt logget ut. Ta vare på alt ulagret arbeid før du logger inn ved å laste siden på nytt.',
    forbidden: 'Noe gikk dessverre galt med aktivitetsplanen. Du har ikke tilgang til å se dette',
};

export function getErrorText(feilmeldinger: FeilmeldingType[]): string {
    const antallFeil = feilmeldinger.length;
    const feil = feilmeldinger[0];

    if (feil.httpStatus === 401) return tekster.unauthorized;
    if (feil.httpStatus === 403) return tekster.forbidden;

    if (antallFeil > 1) {
        return tekster.fallback;
    }

    if (feil.type === AKTIVITET_HENT_FEILET) {
        return tekster.aktivitetFeilet;
    }

    if (feil.type === DIALOG_HENT_FEIL) {
        return tekster.dialogFeilet;
    }

    return tekster.fallback;
}
