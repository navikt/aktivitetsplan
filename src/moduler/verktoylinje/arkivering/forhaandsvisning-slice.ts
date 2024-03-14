import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';

interface ForhaandsvisningState {
    status: Status;
    forhaandsvisning:
        | {
              uuid: string;
              pdf: string;
              forhaandsvisningOpprettet: string;
          }
        | undefined;
    sistJournalfoert: string | undefined;
}

const forhaandsvisningSlice = createSlice({
    name: 'forhaandsvisning',
    initialState: {
        status: Status.NOT_STARTED,
    } as ForhaandsvisningState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentPdfTilForhaandsvisning.pending, (state) => {
            state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
            state.sistJournalfoert = undefined;
        });
        builder.addCase(hentPdfTilForhaandsvisning.fulfilled, (state, action) => {
            state.forhaandsvisning = action.payload;
            state.status = Status.OK;
        });
        builder.addCase(hentPdfTilForhaandsvisning.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(hentSistJournalfort.fulfilled, (state, action) => {
            state.sistJournalfoert = action.payload.sistJournalført;
        });
    },
});

export const hentPdfTilForhaandsvisning = createAsyncThunk(
    `${forhaandsvisningSlice.name}/forhaandsvisning`,
    async (oppfolgingsperiodeId: string) => {
        return await Api.genererPdfTilForhaandsvisning(oppfolgingsperiodeId);
    },
);

export const hentSistJournalfort = createAsyncThunk(
    `${forhaandsvisningSlice.name}/sistJournalfort`,
    async (oppfolgingsperiodeId: string) => {
        return await Api.hentSistJournalfoert(oppfolgingsperiodeId);
    },
);

export function selectForhaandsvisningStatus(state: RootState) {
    return state.data.arkivForhaandsvisning.status;
}

export function selectPdf(state: RootState) {
    return state.data.arkivForhaandsvisning?.forhaandsvisning?.pdf;
}

export function selectForhaandsvisningOpprettet(state: RootState) {
    return state.data.arkivForhaandsvisning?.forhaandsvisning?.forhaandsvisningOpprettet;
}

export function selectSistJournalfort(state: RootState) {
    return state.data.arkivForhaandsvisning?.sistJournalfoert;
}

export const forhaandsvisningReducer = forhaandsvisningSlice.reducer;
