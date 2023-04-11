import { createSelector } from 'reselect';

import { Status } from '../../createGenericSlice';
import { Dialog } from '../../datatypes/dialogTypes';
import { HistoriskOppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';
import { selectHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectForrigeHistoriskeSluttDato } from '../oppfolging-status/oppfolging-selector';

const selectDialogerSlice = (state: RootState) => state.data.dialog;

export const selectDialogStatus = (state: RootState) => selectDialogerSlice(state).status;

export const selectDialogerData = (state: RootState) => selectDialogerSlice(state).data;

export const selectDialoger = createSelector(
    [selectDialogerData, selectHistoriskPeriode, selectForrigeHistoriskeSluttDato],
    (dialoger, valgtHistoriskPeriode?: HistoriskOppfolgingsperiode, forrigeSluttDato?: string) => {
        return dialoger.filter((d: Dialog) => datoErIPeriode(d.opprettetDato, valgtHistoriskPeriode, forrigeSluttDato));
    }
);

export const selectSistOppdatert = (state: RootState) => selectDialogerSlice(state).sistOppdatert;

export const selectDialogForAktivitetId = (aktivitetId: string) => (state: RootState) => {
    return selectDialogerData(state).find((d: Dialog) => {
        return d.aktivitetId === aktivitetId;
    });
};

export function selectDialogFeilmeldinger(state: RootState) {
    const feilmeldinger = selectDialogerSlice(state).status === Status.ERROR && selectDialogerSlice(state).feil;
    return feilmeldinger ? feilmeldinger : [];
}
