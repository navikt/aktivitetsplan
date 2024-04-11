import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface AktivEnhet {
    aktivEnhet: string | undefined;
}

const aktivEnhetSlice = createSlice({
    name: 'aktivEnhet',
    initialState: {
        aktivEnhet: undefined,
    } as AktivEnhet,
    reducers: {
        settAktivEnhet: (state, action: PayloadAction<string>) => {
            state.aktivEnhet = action.payload;
        },
    },
});

export function selectAktivEnhet(state: RootState) {
    return state.data.aktivEnhet.aktivEnhet;
}

export const aktivEnhetReducer = aktivEnhetSlice.reducer;
