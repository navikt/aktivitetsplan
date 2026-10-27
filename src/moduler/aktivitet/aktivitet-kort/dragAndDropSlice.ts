import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { AktivitetStatus, AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { RootState } from '../../../store/rootReducer';
import { selectAktivitetListe } from '../aktivitetlisteSelector';
import { sorterAktiviteter } from '../aktivitet-util';

export const DROP_TYPE_AKTIVITETSKORT = 'AktivitetsKort';

export interface AktivitetskortDragData {
    aktivitet: AlleAktiviteter;
}

interface State {
    dragging: boolean;
    aktivitet?: AlleAktiviteter;
}

const initialState: State = {
    dragging: false,
    aktivitet: undefined,
};

const aktivitetsviewSlice = createSlice({
    name: 'drag',
    initialState: initialState,
    reducers: {
        startDragging: (state, action: PayloadAction<AlleAktiviteter>) => {
            state.dragging = true;
            state.aktivitet = action.payload;
        },
        stopDragging: (state) => {
            state.dragging = false;
            state.aktivitet = undefined;
        },
    },
});

const selectDragAndDropSlice = (state: RootState) => state.view.dragAndDrop;

export const selectDraggingAktivitet = (state: RootState) => selectDragAndDropSlice(state).aktivitet;

export const selectSorterteKolonneAktiviteter = createSelector(
    [selectAktivitetListe, (_state: RootState, status: AktivitetStatus) => status],
    (aktiviteter, status) => sorterAktiviteter(aktiviteter, status),
);

export const { startDragging, stopDragging } = aktivitetsviewSlice.actions;

export default aktivitetsviewSlice.reducer;
