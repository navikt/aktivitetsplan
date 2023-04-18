import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AlleAktiviteter } from '../../datatypes/aktivitetTypes';

interface AktivitetsviewState {
    data: AlleAktiviteter[];
}

const initialState: AktivitetsviewState = {
    data: [],
};

const aktivitetsviewSlice = createSlice({
    name: 'aktivitetsview',
    initialState: initialState,
    reducers: {
        settAktivitetSomVist: (state, action: PayloadAction<AlleAktiviteter>) => {
            state.data = [...state.data, action.payload];
        },
    },
});

export const { settAktivitetSomVist } = aktivitetsviewSlice.actions;

export default aktivitetsviewSlice.reducer;
