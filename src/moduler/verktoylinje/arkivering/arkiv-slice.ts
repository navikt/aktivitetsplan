import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';
import { ArkivFilter } from '../../journalforing/journalforingFilter';

interface ArkivState {
    forhaandsvisningStatus: Status;
    forhaandsvisningSendTilBrukerStatus: Status;
    journalføringStatus: Status;
    sendTilBrukerStatus: Status;
    forhaandsvisning:
        | {
              uuid: string;
              pdf: string;
              forhaandsvisningOpprettet: string;
              sistJournalført: string | undefined;
          }
        | undefined;
    forhaandsvisningSendTilBruker:
        | {
        pdf: string;
        forhaandsvisningOpprettet: string;
    }
        | undefined;
}

const arkivSlice = createSlice({
    name: 'arkiv',
    initialState: {
        forhaandsvisningStatus: Status.NOT_STARTED,
        forhaandsvisningSendTilBrukerStatus: Status.NOT_STARTED
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
        builder.addCase(hentPdfTilForhaandsvisningSendTilBruker.pending, (state) => {
            state.forhaandsvisningSendTilBrukerStatus =
                state.forhaandsvisningSendTilBrukerStatus === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
            state.sendTilBrukerStatus = Status.NOT_STARTED;
        });
        builder.addCase(hentPdfTilForhaandsvisningSendTilBruker.fulfilled, (state, action) => {
            state.forhaandsvisningSendTilBruker = action.payload;
            state.forhaandsvisningSendTilBrukerStatus = Status.OK;
        });
        builder.addCase(hentPdfTilForhaandsvisningSendTilBruker.rejected, (state) => {
            state.forhaandsvisningSendTilBrukerStatus = Status.ERROR;
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
        builder.addCase(journalforOgSendTilBruker.pending, (state) => {
            state.sendTilBrukerStatus =
                state.sendTilBrukerStatus === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
        });
        builder.addCase(journalforOgSendTilBruker.rejected, (state) => {
            state.sendTilBrukerStatus = Status.ERROR;
        });
        builder.addCase(journalforOgSendTilBruker.fulfilled, (state) => {
            state.sendTilBrukerStatus = Status.OK;
        });
    },
});

export const journalfør = createAsyncThunk(
    `${arkivSlice.name}/journalfoering`,
    async ({
        forhaandsvisningOpprettet,
        journalførendeEnhetId,
        oppfolgingsperiodeId,
    }: {
        forhaandsvisningOpprettet: string;
        journalførendeEnhetId: string;
        oppfolgingsperiodeId: string;
    }) => {
        return await Api.journalfoerAktivitetsplanOgDialog(
            oppfolgingsperiodeId,
            forhaandsvisningOpprettet,
            journalførendeEnhetId,
        );
    },
);

export function selectJournalføringstatus(state: RootState) {
    return state.data.arkiv.journalføringStatus;
}

export const hentPdfTilForhaandsvisning = createAsyncThunk(
    `${arkivSlice.name}/forhaandsvisning`,
    async ({
        oppfolgingsperiodeId,
        journalførendeEnhetId,
    }: {
        oppfolgingsperiodeId: string;
        journalførendeEnhetId: string;
    }) => {
        return await Api.genererPdfTilForhaandsvisning(oppfolgingsperiodeId, journalførendeEnhetId);
    },
);

export const hentPdfTilForhaandsvisningSendTilBruker = createAsyncThunk(
    `${arkivSlice.name}/forhaandsvisning-send-til-bruker`,
    async ({
               oppfolgingsperiodeId,
               filter,
               journalførendeEnhetId,
               tekstTilBruker
           }: {
        oppfolgingsperiodeId: string;
        filter: ArkivFilter;
        journalførendeEnhetId: string;
        tekstTilBruker: string;
    }) => {
        return await Api.genererPdfTilForhaandsvisningSendTilBruker(oppfolgingsperiodeId, filter, journalførendeEnhetId, tekstTilBruker);
    },
);


export const journalforOgSendTilBruker = createAsyncThunk(
    `${arkivSlice.name}/send-til-bruker`,
    async ({
               forhaandsvisningOpprettet,
               journalførendeEnhetId,
               oppfolgingsperiodeId,
               filter,
               tekstTilBruker
           }: {
        forhaandsvisningOpprettet: string;
        journalførendeEnhetId: string;
        oppfolgingsperiodeId: string;
        filter: ArkivFilter;
        tekstTilBruker?: string;
    }) => {
        return await Api.journalforOgSendTilBruker(oppfolgingsperiodeId, forhaandsvisningOpprettet, journalførendeEnhetId, filter, tekstTilBruker);
    },
)

export function selectSendTilBrukerStatus(state: RootState) {
    return state.data.arkiv.sendTilBrukerStatus;
}

export function selectForhaandsvisningStatus(state: RootState) {
    return state.data.arkiv.forhaandsvisningStatus;
}

export function selectForhaandsvisningSendTilBrukerStatus(state: RootState) {
    return state.data.arkiv.forhaandsvisningSendTilBrukerStatus;
}

export function selectPdfForhaandsvisning(state: RootState) {
    return state.data.arkiv?.forhaandsvisning?.pdf;
}

export function selectPdfForhaandsvisningSendTilBruker(state: RootState) {
    return state.data.arkiv?.forhaandsvisningSendTilBruker?.pdf;
}

export function selectForhaandsvisningOpprettet(state: RootState) {
    return state.data.arkiv?.forhaandsvisning?.forhaandsvisningOpprettet;
}

export function selectForhaandsvisningSendTilBrukerOpprettet(state: RootState) {
    return state.data.arkiv?.forhaandsvisningSendTilBruker?.forhaandsvisningOpprettet;
}

export function selectSistJournalfort(state: RootState) {
    return state.data.arkiv?.forhaandsvisning?.sistJournalført;
}

export const arkivReducer = arkivSlice.reducer;
