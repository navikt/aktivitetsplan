import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import createGenericSlice, { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';

interface ArkivState {
    status: Status;
}

const arkivSlice = createGenericSlice({
    name: 'arkiv',
    initialState: {
        status: Status.NOT_STARTED,
    } as ArkivState,
    reducers: {},
});

export const arkiver = createAsyncThunk(`${arkivSlice.name}/arkiver`, async (oppfolgingsperiodeId: string) => {
    return await Api.arkiver(oppfolgingsperiodeId);
});

export const hentPdfTilForhaandsvisning = createAsyncThunk(`${arkivSlice.name}/forhaandsvisning`, async (oppfolgingsperiodeId: string) => {
    return await Api.genererPdfTilForhaandsvisning(oppfolgingsperiodeId)
});

export function selectArkivStatus(state: RootState) {
    return state.data.arkiv.status;
}

export const arkivReducer = arkivSlice.reducer;
