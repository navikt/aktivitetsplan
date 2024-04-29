import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as Api from '../../api/oppfolgingAPI';
import { Status } from '../../createGenericSlice';
import { Mal } from '../../datatypes/oppfolgingTypes';
import { hentFraSessionStorage, LocalStorageElement } from '../../mocks/demo/localStorage';

// TODO merge aktivitetsmal og malliste

interface MalState {
    data: Mal;
    status: Status;
}

const initialState: MalState = {
    data: {} as Mal,
    status: Status.NOT_STARTED,
};

const malSlice = createSlice({
    name: 'mal',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentMal.pending, (state) => {
            state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
        });
        builder.addCase(hentMal.fulfilled, (state, action) => {
            state.status = Status.OK;
            state.data = action.payload;
        });
        builder.addCase(hentMal.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(oppdaterMal.fulfilled, (state, action) => {
            state.data = action.payload;
        });
    },
});

export const hentMal = createAsyncThunk(`${malSlice.name}/fetchMal`, async () => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return await Api.fetchMal(fnr ?? undefined);
});

export const oppdaterMal = createAsyncThunk(`${malSlice.name}/oppdaterMal`, async (mal: { mal: string }) => {
    const fnr = hentFraSessionStorage(LocalStorageElement.FNR);
    return await Api.lagreMal(mal.mal, fnr ?? undefined);
});

export default malSlice.reducer;
