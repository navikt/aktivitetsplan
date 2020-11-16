import { createSelector } from 'reselect';

import { STATUS } from '../../ducks/utils';
import { selectHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectForrigeHistoriskeSluttDato } from '../oppfolging-status/oppfolging-selector';

function erViktigMelding(dialog) {
    return dialog.egenskaper.length > 0;
}

function selectDialogSlice(state) {
    return state.data.dialog;
}

export function selectDialogStatus(state) {
    return selectDialogSlice(state).status;
}

export function selectEskaleringsFilter(state) {
    return selectDialogSlice(state).esklaringsFilter;
}

export function selectAlleDialoger(state) {
    return selectDialogSlice(state).data;
}

const hentDialogerFraState = (dialoger, esklaringsFilter, valgtHistoriskPeriode, forrigeSluttDato) =>
    dialoger.data
        .filter((d) => datoErIPeriode(d.opprettetDato, valgtHistoriskPeriode, forrigeSluttDato))
        .filter((d) => erViktigMelding(d) || !esklaringsFilter);

export const selectDialoger = createSelector(
    [selectDialogSlice, selectEskaleringsFilter, selectHistoriskPeriode, selectForrigeHistoriskeSluttDato],
    hentDialogerFraState
);

export function selectSistOppdatert(state) {
    return selectDialogSlice(state).sistOppdatert;
}

export function createSelectDialogForAktivitetId(aktivitetId) {
    return (state) => selectDialogForAktivitetId(state, aktivitetId);
}

export function selectDialogForAktivitetId(state, aktivitetId) {
    return selectAlleDialoger(state).find((d) => d.aktivitetId === aktivitetId);
}

export function selectDialogFeilmeldinger(state) {
    const feilmeldinger = selectDialogSlice(state).status === STATUS.ERROR && selectDialogSlice(state).feil;
    return feilmeldinger ? feilmeldinger : [];
}
