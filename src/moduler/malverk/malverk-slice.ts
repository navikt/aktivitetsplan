import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as Api from '../../api/malverkAPI';
import { Status } from '../../createGenericSlice';

interface MalverkState {
    malverker: object[];
    valgtMalverk: object;
    status: Status;
}

const malverkSlice = createSlice({
    name: 'malverk',
    initialState: {
        malverker: [],
        valgtMalverk: {},
        status: Status.NOT_STARTED,
    } as MalverkState,
    reducers: {
        settValgtMalverk: (state, action: PayloadAction<object>) => {
            state.valgtMalverk = action.payload;
        },
        slettValgtMalverk: (state) => {
            state.valgtMalverk = {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(hentMalverk.pending, (state) => {
            state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
        });
        builder.addCase(hentMalverk.fulfilled, (state, action) => {
            state.malverker = action.payload;
            state.status = Status.OK;
        });
        builder.addCase(hentMalverk.rejected, (state) => {
            state.status = Status.ERROR;
        });
    },
});

export const hentMalverk = createAsyncThunk(`${malverkSlice.name}/fetchMalverk`, async () => {
    return await Api.hentMalverkMed();
});

export const { settValgtMalverk, slettValgtMalverk } = malverkSlice.actions;

export default malverkSlice.reducer;
