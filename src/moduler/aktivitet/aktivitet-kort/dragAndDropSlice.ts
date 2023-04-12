import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { RootState } from '../../../store';

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

export const { startDragging, stopDragging } = aktivitetsviewSlice.actions;

export default aktivitetsviewSlice.reducer;
