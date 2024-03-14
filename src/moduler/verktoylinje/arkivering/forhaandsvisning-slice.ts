import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import createGenericSlice, { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';
import { hentSistJournalfoert } from '../../../api/aktivitetAPI';
import { response } from 'msw';

interface ForhaandsvisningState {
    status: Status;
    data:
        | {
              uuid: string;
              pdf: string;
              forhaandsvisningOpprettet: string;
              sistJournalfoert: string;
          }
        | undefined;
}

const forhaandsvisningSlice = createGenericSlice({
    name: 'forhaandsvisning',
    initialState: {
        status: Status.NOT_STARTED,
    } as ForhaandsvisningState,
    reducers: {
        hentSistJournalfoert: (state, oppfolgingsperiodeId: PayloadAction<string>) => {
            Api.hentSistJournalfoert(oppfolgingsperiodeId.payload).then((response) => {
                response.status == 200 && state.data
                    ? (state.data.sistJournalfoert = response.body.sistJournalfoert)
                    : undefined;
            });
        },
    },
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

export function selectSistJournalfort(state: RootState) {
    return state.data.arkivForhaandsvisning?.data?.sistJournalfoert;
}

export const forhaandsvisningReducer = forhaandsvisningSlice.reducer;
