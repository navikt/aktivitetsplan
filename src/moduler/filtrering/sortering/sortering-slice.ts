import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Sorteringsfelt {
    ENDRET_DATO = 'ENDRET_DATO',
    AKTIVITET_DATO = 'AKTIVITET_DATO',
}

export enum Sorteringsrekkefolge {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface SorteringState {
    felt: Sorteringsfelt;
    rekkefolge: Sorteringsrekkefolge;
}

const initialState: SorteringState = {
    felt: Sorteringsfelt.ENDRET_DATO,
    rekkefolge: Sorteringsrekkefolge.DESC,
};

const sorteringSlice = createSlice({
    name: 'sortering',
    initialState,
    reducers: {
        setSortering: (state, action: PayloadAction<SorteringState>) => {
            state.felt = action.payload.felt;
            state.rekkefolge = action.payload.rekkefolge;
        },
    },
});

export const { setSortering } = sorteringSlice.actions;

export default sorteringSlice.reducer;
