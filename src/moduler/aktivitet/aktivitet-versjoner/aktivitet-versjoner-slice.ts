import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import { Status } from '../../../createGenericSlice';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import {
    flyttAktivitetThunk,
    markerForhaandsorienteringSomLestThunk,
    oppdaterAktivitetEtikettThunk,
    oppdaterAktivitetThunk,
    oppdaterReferatThunk,
    oppdaterStillingFraNavSoknadsstatusThunk,
    publiserReferatThunk,
    settAktivitetTilAvtaltThunk,
} from '../aktivitet-actions';

interface AktivitetVersjonerState {
    data: VeilarbAktivitet[];
    status: Status;
}

const initialState: AktivitetVersjonerState = {
    data: [],
    status: Status.NOT_STARTED,
};

const aktivitetVersjonerSlice = createSlice({
    name: 'versjoner',
    initialState: initialState,
    reducers: {
        fjernVersjoner: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchVersjonerForAktivitet.pending, (state) => {
            state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
        });
        builder.addCase(fetchVersjonerForAktivitet.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = Status.OK;
        });
        builder.addCase(fetchVersjonerForAktivitet.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addMatcher(
            isAnyOf(
                oppdaterAktivitetEtikettThunk.fulfilled,
                oppdaterAktivitetThunk.fulfilled,
                oppdaterStillingFraNavSoknadsstatusThunk.fulfilled,
                oppdaterReferatThunk.fulfilled,
                publiserReferatThunk.fulfilled,
                markerForhaandsorienteringSomLestThunk.fulfilled,
                settAktivitetTilAvtaltThunk.fulfilled,
                flyttAktivitetThunk.fulfilled
            ),
            (state, action) => {
                if (state.status === Status.NOT_STARTED) {
                    return state;
                }
                return { ...state, data: [action.payload, ...state.data] };
            }
        );
        builder.addMatcher(isAnyOf(oppdaterReferatThunk.rejected, publiserReferatThunk.rejected), (state) => {
            state.status = Status.ERROR;
        });
    },
});

export const fetchVersjonerForAktivitet = createAsyncThunk(
    `${aktivitetVersjonerSlice.name}/fetchVersjonerForAktivitet`,
    async (aktivitet: VeilarbAktivitet) => {
        return await Api.hentVersjonerTilAktivitet(aktivitet);
    }
);

export const { fjernVersjoner } = aktivitetVersjonerSlice.actions;

export default aktivitetVersjonerSlice.reducer;
