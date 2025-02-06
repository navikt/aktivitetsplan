import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

const valgtPeriodeSlice = createSlice({
    name: 'valgtPeriodeSlice',
    initialState: { valgtPeriodeId: null as string | null },
    reducers: {
        velgPeriode: (state, action: PayloadAction<string>) => {
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
