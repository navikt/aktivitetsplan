import { createSelector } from 'reselect';

import { Status } from '../../createGenericSlice';
import { Dialog } from '../../datatypes/dialogTypes';
import { HistoriskOppfolgingsperiode } from '../../datatypes/oppfolgingTypes';
import { RootState } from '../../store';
import { selectErrors, selectFeil } from '../feilmelding/feil-selector';
import { selectHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { datoErIPeriode } from '../filtrering/filter/filter-utils';
import { selectForrigeHistoriskeSluttDato } from '../oppfolging-status/oppfolging-selector';
import { hentDialoger } from './dialog-slice';
import { SerializedError } from '../../api/utils';

const selectDialogerSlice = (state: RootState) => state.data.dialog;

export const selectDialogStatus = (state: RootState) => selectDialogerSlice(state).status;
export const selectDialogerData = (state: RootState) => selectDialogerSlice(state).data;
export const selectSistOppdatert = (state: RootState) => selectDialogerSlice(state).sistOppdatert;
export const selectDialoger = createSelector(
    [selectDialogerData, selectHistoriskPeriode, selectForrigeHistoriskeSluttDato],
    (dialoger: Dialog[], valgtHistoriskPeriode: HistoriskOppfolgingsperiode | null, forrigeSluttDato?: string) => {
        return dialoger.filter((d: Dialog) =>
            datoErIPeriode(d.opprettetDato, valgtHistoriskPeriode ?? undefined, forrigeSluttDato),
        );
    },
);
export const selectDialogForAktivitetId = (aktivitetId: string) => (state: RootState) => {
    return selectDialogerData(state).find((d: Dialog) => {
        return d.aktivitetId === aktivitetId;
    });
};

export const selectDialogFeilmeldinger: (state: RootState) => SerializedError[] = createSelector(
    selectDialogerSlice,
    selectErrors,
    (dialogState, errors) => {
        return dialogState.status === Status.ERROR ? selectFeil(errors, hentDialoger.rejected.type) : [];
    },
);
