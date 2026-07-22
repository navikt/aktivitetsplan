import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store/rootReducer';
import { OppfolgingsPeriodeId } from '../../../datatypes/brandedTypes';

const valgtPeriodeSlice = createSlice({
    name: 'valgtPeriodeSlice',
    initialState: { valgtPeriodeId: null as OppfolgingsPeriodeId | null },
    reducers: {
        velgPeriode: (state, action: PayloadAction<OppfolgingsPeriodeId>) => {
            state.valgtPeriodeId = action.payload;
        },
    },
});

export const { velgPeriode } = valgtPeriodeSlice.actions;

export const selectValgtPeriodeSlice = (state: RootState) => state.data.valgtPeriode;
export const selectValgtPeriodeId = createSelector(selectValgtPeriodeSlice, (valgtPeriodeSlice) => {
    return valgtPeriodeSlice.valgtPeriodeId;
});

export default valgtPeriodeSlice.reducer;
