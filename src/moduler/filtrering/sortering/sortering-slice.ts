import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';

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

export type KolonneSorteringState = Partial<Record<AktivitetStatus, SorteringState>>;

const initialState: KolonneSorteringState = {};

export const defaultSortering: SorteringState = {
    felt: Sorteringsfelt.ENDRET_DATO,
    rekkefolge: Sorteringsrekkefolge.DESC,
};

const sorteringSlice = createSlice({
    name: 'sortering',
    initialState,
    reducers: {
        setSorteringForKolonne: (
            state,
            action: PayloadAction<{ status: AktivitetStatus; sortering: SorteringState }>,
        ) => {
            state[action.payload.status] = action.payload.sortering;
        },
    },
});

export const { setSorteringForKolonne } = sorteringSlice.actions;

export default sorteringSlice.reducer;
