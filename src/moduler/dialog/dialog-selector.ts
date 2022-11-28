import { createSelector } from 'reselect';

import { STATUS } from '../../api/utils';
import { AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import { Dialog } from '../../datatypes/dialogTypes';
import { selectHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { Periode, datoErIPeriode } from '../filtrering/filter/filter-utils';
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
    valgtHistoriskPeriode?: Periode,
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
        if (d.aktivitetId === aktivitet.id) {
            return true;
        } else if (isArenaAktivitet(aktivitet) && d.aktivitetId === aktivitet.aktivitetId?.toString()) {
            return true;
        }
        return false;
    });
}

export function selectDialogFeilmeldinger(state: any) {
    const feilmeldinger = selectDialogSlice(state).status === STATUS.ERROR && selectDialogSlice(state).feil;
    return feilmeldinger ? feilmeldinger : [];
}