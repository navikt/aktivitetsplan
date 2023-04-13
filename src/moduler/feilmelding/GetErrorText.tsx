import { hentAktivitet, hentAktiviteter } from '../aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentNivaa4 } from '../tilgang/tilgang-slice';
import { FeilmeldingType } from './FeilmeldingTypes';

export const tekster = {
    fallback: 'Noe gikk dessverre galt med aktivitetsplanen. Prøv igjen senere.',
    aktivitetFeilet: 'Noe gikk galt, og du får dessverre ikke sett alle aktiviteter. Prøv igjen senere.',
    dialogFeilet: 'Noe gikk galt, og du får dessverre ikke sett dialogmeldinger. Prøv igjen senere.',
    unauthorized: 'Du er blitt logget ut. Ta vare på alt ulagret arbeid før du logger inn ved å laste siden på nytt.',
    forbidden: 'Noe gikk dessverre galt med aktivitetsplanen. Du har ikke tilgang til å se dette',
    nivaa4: 'Noe gikk galt, og du får dessverre ikke sende forhåndsorientering. Prøv igjen senere.',
};

// TODO feilmelding skal ikke komme fra state, men catches gjennom errorboundary
export function getErrorText(feilmeldinger: FeilmeldingType[]): string {
    const antallFeil = feilmeldinger.length;
    const feil = feilmeldinger[0];

    if (feil.type === hentDialoger.rejected.type && antallFeil === 1) {
        return tekster.dialogFeilet;
    }

    if (feil.httpStatus === 401) return tekster.unauthorized;
    if (feil.httpStatus === 403) return tekster.forbidden;

    if (antallFeil > 1) {
        return tekster.fallback;
    }

    if (feil.type === hentAktiviteter.rejected.type) {
        return tekster.aktivitetFeilet;
    }

    if (feil.type === hentAktivitet.rejected.type) {
        return tekster.aktivitetFeilet;
    }

    if (feil.type === hentArenaAktiviteter.rejected.type) {
        return tekster.aktivitetFeilet;
    }

    if (feil.type === hentNivaa4.rejected.type) {
        return tekster.nivaa4;
    }

    return tekster.fallback;
}
