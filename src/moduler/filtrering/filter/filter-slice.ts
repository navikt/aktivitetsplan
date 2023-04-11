import { createSlice } from '@reduxjs/toolkit';

import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';

interface FilterState {
    aktivitetTyper: Record<string, boolean>;
    aktivitetEtiketter: Record<string, boolean>;
    arenaAktivitetEtiketter: Record<string, boolean>;
    aktivitetStatus: Record<string, boolean>;
    aktivitetAvtaltMedNav: Record<string, boolean>;
    historiskPeriode: HistoriskOppfolgingsperiode | null;
}

const initialState: FilterState = {
    aktivitetTyper: {},
    aktivitetEtiketter: {},
    arenaAktivitetEtiketter: {},
    aktivitetStatus: {},
    aktivitetAvtaltMedNav: {},
    historiskPeriode: null,
};

const filterSlice = createSlice({
    name: 'filter',
    initialState: initialState,
    reducers: {
        toggleAktivitetsType: (state, action) => {
            return state;
        },
        toggleAktivitetsEtikett: (state, action) => {
            return state;
        },
        velgHistoriskPeriode: (state, action) => {
            return state;
        },
        toggleAktivitetsStatus: (state, action) => {
            return state;
        },
        toggleAktivitetAvtaltMedNav: (state, action) => {
            return state;
        },
    },
});

export const {
    toggleAktivitetsEtikett,
    toggleAktivitetsStatus,
    toggleAktivitetsType,
    toggleAktivitetAvtaltMedNav,
    velgHistoriskPeriode,
} = filterSlice.actions;

export default filterSlice.reducer;
