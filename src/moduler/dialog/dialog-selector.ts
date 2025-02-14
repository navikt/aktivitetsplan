import { createSelector } from '@reduxjs/toolkit';

import { Status } from '../../createGenericSlice';
import { Dialog } from '../../datatypes/dialogTypes';
import { RootState } from '../../store';
import { selectErrors, selectFeil } from '../feilmelding/feil-selector';
import { hentDialoger } from './dialog-slice';
import { SerializedError } from '../../api/utils';
import { selectValgtPeriodeId } from '../filtrering/filter/valgt-periode-slice';

const selectDialogerSlice = (state: RootState) => state.data.dialog;

export const selectDialogStatus = (state: RootState) => selectDialogerSlice(state).status;
export const selectDialogerData = (state: RootState) => selectDialogerSlice(state).data;
export const selectSistOppdatert = (state: RootState) => selectDialogerSlice(state).sistOppdatert;
export const selectDialoger = createSelector(
    [selectDialogerData, selectValgtPeriodeId],
    (dialoger: Dialog[], valgtPeriodeId) => {
        return dialoger.filter((d: Dialog) => d.oppfolgingsperiode === valgtPeriodeId);
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
