import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import createGenericSlice, { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';

interface ForhaandsvisningState {
    status: Status;
    data:
        | {
              uuid: string;
              pdf: string;
              forhaandsvisningOpprettet: string;
          }
        | undefined;
}

const forhaandsvisningSlice = createGenericSlice({
    name: 'forhaandsvisning',
    initialState: {
        status: Status.NOT_STARTED,
    } as ForhaandsvisningState,
    reducers: {},
});

export const hentPdfTilForhaandsvisning = createAsyncThunk(
    `${forhaandsvisningSlice.name}/forhaandsvisning`,
    async (oppfolgingsperiodeId: string) => {
        return await Api.genererPdfTilForhaandsvisning(oppfolgingsperiodeId);
    },
);

export function selectForhaandsvisningStatus(state: RootState) {
    return state.data.arkivForhaandsvisning.status;
}

export function selectPdf(state: RootState) {
    return state.data.arkivForhaandsvisning?.data?.pdf;
}

export function selectForhaandsvisningOpprettet(state: RootState) {
    return state.data.arkivForhaandsvisning?.data?.forhaandsvisningOpprettet;
}

export const forhaandsvisningReducer = forhaandsvisningSlice.reducer;
