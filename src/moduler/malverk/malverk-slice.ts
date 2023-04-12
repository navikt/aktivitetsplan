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
        status: Status.OK,
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
        builder.addCase(hentMalverkMedType.pending, (state) => {
            state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
        });
        builder.addCase(hentMalverkMedType.fulfilled, (state, action) => {
            state.malverker = action.payload;
            state.status = Status.OK;
        });
        builder.addCase(hentMalverkMedType.rejected, (state) => {
            state.status = Status.ERROR;
        });
    },
});

export const hentMalverkMedType = createAsyncThunk(
    `${malverkSlice.name}/fetchMalverkMedType`,
    async (type: string) => {
        return await Api.hentMalverkMedType(type);
    }
);

export const { settValgtMalverk, slettValgtMalverk } = malverkSlice.actions;

export default malverkSlice.reducer;
