import { createSelector } from 'reselect';

import { Status } from '../../createGenericSlice';
import { AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { Dialog } from '../../datatypes/dialogTypes';
import { HistoriskOppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { selectHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectForrigeHistoriskeSluttDato } from '../oppfolging-status/oppfolging-selectorts';

function erViktigMelding(dialog: Dialog) {
    return (dialog?.egenskaper?.length || 0) > 0;
}

function selectDialogSlice(state: any) {
    return state.data.dialog;
}

export function selectDialogStatus(state: any) {
    return selectDialogSlice(state).status;
}

export function selectEskaleringsFilter(state: any) {
    return selectDialogSlice(state).esklaringsFilter;
}

export function selectAlleDialoger(state: any) {
    return selectDialogSlice(state).data;
}

const hentDialogerFraState = (
    dialogSlice: any,
    esklaringsFilter: boolean,
    valgtHistoriskPeriode?: HistoriskOppfolgingsperiode,
    forrigeSluttDato?: string
) =>
    dialogSlice.data
        .filter((d: Dialog) => datoErIPeriode(d.opprettetDato, valgtHistoriskPeriode, forrigeSluttDato))
        .filter((d: Dialog) => erViktigMelding(d) || !esklaringsFilter);

export const selectDialoger = createSelector(
    [selectDialogSlice, selectEskaleringsFilter, selectHistoriskPeriode, selectForrigeHistoriskeSluttDato],
    hentDialogerFraState
);

export function selectSistOppdatert(state: any) {
    return selectDialogSlice(state).sistOppdatert;
}

export function createSelectDialogForAktivitetId(aktivitet: AlleAktiviteter) {
    return (state: any) => selectDialogForAktivitetId(state, aktivitet);
}

export function selectDialogForAktivitetId(state: any, aktivitet: AlleAktiviteter) {
    return selectAlleDialoger(state).find((d: Dialog) => {
        return d.aktivitetId === aktivitet.id;
    });
}

export function selectDialogFeilmeldinger(state: any) {
    const feilmeldinger = selectDialogSlice(state).status === Status.ERROR && selectDialogSlice(state).feil;
    return feilmeldinger ? feilmeldinger : [];
}
