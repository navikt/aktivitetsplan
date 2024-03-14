import { createAsyncThunk } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import createGenericSlice, { Status } from '../../../createGenericSlice';
import { RootState } from '../../../store';

const journalfoeringSlice = createGenericSlice({
    name: 'journalfoering',
    initialState: {
        status: Status.NOT_STARTED as Status,
    },
    reducers: {
        resettStatus: (state) => {
            state.status = Status.NOT_STARTED;
        },
    },
});

export const journalfoer = createAsyncThunk(
    `${journalfoeringSlice.name}/journalfoering`,
    async ({
        oppfolgingsperiodeId,
        forhaandsvisningOpprettet,
    }: {
        oppfolgingsperiodeId: string;
        forhaandsvisningOpprettet: string;
    }) => {
        return await Api.journalfoerAktivitetsplanOgDialog(oppfolgingsperiodeId, forhaandsvisningOpprettet);
    },
);

export function selectJournalfoeringstatus(state: RootState) {
    return state.data.arkivJournalfoering.status;
}

export const journalfoeringReducer = journalfoeringSlice.reducer;
export const { resettStatus } = journalfoeringSlice.actions;
