import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import createGenericSlice, { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';
import { Root } from 'react-dom/client';

interface ArkivState {
    status: Status;
    data:
        | {
              uuid: string;
              pdf: string;
              forhaandsvisningOpprettet: string;
          }
        | undefined;
}

const arkivSlice = createGenericSlice({
    name: 'arkiv',
    initialState: {
        status: Status.NOT_STARTED,
    } as ArkivState,
    reducers: {},
});

export const arkiver = createAsyncThunk(
    `${arkivSlice.name}/arkiv`,
    async ({
        oppfolgingsperiodeId,
        forhaandsvisningOpprettet,
    }: {
        oppfolgingsperiodeId: string;
        forhaandsvisningOpprettet: string;
    }) => {
        return await Api.arkiver(oppfolgingsperiodeId, forhaandsvisningOpprettet);
    },
);

export const hentPdfTilForhaandsvisning = createAsyncThunk(
    `${arkivSlice.name}/forhaandsvisning`,
    async (oppfolgingsperiodeId: string) => {
        return await Api.genererPdfTilForhaandsvisning(oppfolgingsperiodeId);
    },
);

export function selectArkivStatus(state: RootState) {
    return state.data.arkiv.status;
}

export function selectPdf(state: RootState) {
    return state.data.arkiv?.data?.pdf;
}

export function selectForhaandsvisningOpprettet(state: RootState) {
    return state.data.arkiv?.data?.forhaandsvisningOpprettet;
}

export const arkivReducer = arkivSlice.reducer;
