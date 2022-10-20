import { isAfter, isBefore } from 'date-fns';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../datatypes/dialogTypes';
import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';

function aktivitetIKvpPeriode(aktivitet: AlleAktiviteter, kvpPeriode: KvpPeriode) {
    const aktivitetDato = new Date(aktivitet.opprettetDato);
    const kvpFraDato = new Date(kvpPeriode.opprettetDato);

    return (
        isAfter(aktivitetDato, kvpFraDato) &&
        (!kvpPeriode.avsluttetDato || isBefore(aktivitetDato, new Date(kvpPeriode.avsluttetDato)))
    );
}

function aktivitetUtenforKvp(aktivitet: AlleAktiviteter, kvpPerioder: KvpPeriode[]) {
    return kvpPerioder.every((kvp) => !aktivitetIKvpPeriode(aktivitet, kvp));
}

export function filtrerAktiviteter(
    utskriftType: string | undefined,
    kvpPerioder: KvpPeriode[] | undefined,
    valgtKvpPeriode: KvpPeriode | undefined,
    aktiviteter: AlleAktiviteter[] | undefined
): AlleAktiviteter[] | undefined {
    if (!aktiviteter) {
        return;
    }

    if (valgtKvpPeriode) {
        return aktiviteter.filter((a) => aktivitetIKvpPeriode(a, valgtKvpPeriode));
    }

    if (utskriftType === 'aktivitetsplan' && kvpPerioder) {
        return aktiviteter.filter((a) => aktivitetUtenforKvp(a, kvpPerioder));
    }

    return aktiviteter;
}

function dialogIKvpPeriode(dialog: Dialog, periode: KvpPeriode): boolean {
    const dialogSisteDato = new Date(dialog.sisteDato);
    const kvpStart = new Date(periode.opprettetDato);
    const dialogOpprettet = new Date(dialog.opprettetDato);

    if (isBefore(dialogSisteDato, kvpStart)) {
        return false;
    }

    return !periode.avsluttetDato || isBefore(dialogOpprettet, new Date(periode.avsluttetDato));
}

function dialogUtenforKvp(dialog: Dialog, kvpPerioder: KvpPeriode[]) {
    return kvpPerioder.every((kvp) => !dialogIKvpPeriode(dialog, kvp));
}

export function filtrerDialoger(
    utskriftType: string | undefined,
    kvpPerioder: KvpPeriode[] | undefined,
    valgtKvpPeriode: KvpPeriode | undefined,
    dialoger: Dialog[] | undefined
): Dialog[] | undefined {
    if (!dialoger || !utskriftType) {
        return undefined;
    }

    if (valgtKvpPeriode) {
        return dialoger.filter((d) => dialogIKvpPeriode(d, valgtKvpPeriode));
    }

    if (utskriftType === 'aktivitetsplan' && kvpPerioder) {
        return dialoger.filter((d) => dialogUtenforKvp(d, kvpPerioder));
    }

    return dialoger;
}
