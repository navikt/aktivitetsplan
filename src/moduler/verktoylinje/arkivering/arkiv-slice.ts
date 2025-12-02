import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';

interface ArkivState {
    forhaandsvisningStatus: Status;
    journalføringStatus: Status;
    forhaandsvisning:
        | {
              uuid: string;
              pdf: string;
              forhaandsvisningOpprettet: string;
              sistJournalført: string | undefined;
          }
        | undefined;
}

const arkivSlice = createSlice({
    name: 'arkiv',
    initialState: {
        forhaandsvisningStatus: Status.NOT_STARTED,
    } as ArkivState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentPdfTilForhaandsvisning.pending, (state) => {
            state.forhaandsvisningStatus =
                state.forhaandsvisningStatus === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
            state.journalføringStatus = Status.NOT_STARTED;
        });
        builder.addCase(hentPdfTilForhaandsvisning.fulfilled, (state, action) => {
            state.forhaandsvisning = action.payload;
            state.forhaandsvisningStatus = Status.OK;
        });
        builder.addCase(hentPdfTilForhaandsvisning.rejected, (state) => {
            state.forhaandsvisningStatus = Status.ERROR;
        });
        builder.addCase(journalfør.pending, (state) => {
            state.journalføringStatus =
                state.journalføringStatus === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
        });
        builder.addCase(journalfør.rejected, (state) => {
            state.journalføringStatus = Status.ERROR;
        });
        builder.addCase(journalfør.fulfilled, (state, action) => {
            if (state.forhaandsvisning) {
                state.forhaandsvisning.sistJournalført = action.payload.sistJournalført;
            }
            state.journalføringStatus = Status.OK;
        });
    },
});

export const journalfør = createAsyncThunk(
    `${arkivSlice.name}/journalfoering`,
    async ({
        forhaandsvisningOpprettet,
        journalførendeEnhet,
        oppfolgingsperiodeId,
    }: {
        forhaandsvisningOpprettet: string;
        journalførendeEnhet: string;
        oppfolgingsperiodeId: string;
    }) => {
        return await Api.journalfoerAktivitetsplanOgDialog(
            oppfolgingsperiodeId,
            forhaandsvisningOpprettet,
            journalførendeEnhet,
        );
    },
);

export function selectJournalføringstatus(state: RootState) {
    return state.data.arkiv.journalføringStatus;
}

export const hentPdfTilForhaandsvisning = createAsyncThunk(
    `${arkivSlice.name}/forhaandsvisning`,
    async ({
        journalførendeEnhet,
        oppfolgingsperiodeId,
        filter
    }: {
        journalførendeEnhet: string;
        oppfolgingsperiodeId: string;
        filter?: ArkivFilter;
    }) => {
        return await Api.genererPdfTilForhaandsvisning(oppfolgingsperiodeId, journalførendeEnhet, filter);
    },
);

export function selectForhaandsvisningStatus(state: RootState) {
    return state.data.arkiv.forhaandsvisningStatus;
}

export function selectPdf(state: RootState) {
    return state.data.arkiv?.forhaandsvisning?.pdf;
}

export function selectForhaandsvisningOpprettet(state: RootState) {
    return state.data.arkiv?.forhaandsvisning?.forhaandsvisningOpprettet;
}

export function selectSistJournalfort(state: RootState) {
    return state.data.arkiv?.forhaandsvisning?.sistJournalført;
}

export const arkivReducer = arkivSlice.reducer;

export interface ArkivFilter {
    inkluderHistorikk: boolean
}
