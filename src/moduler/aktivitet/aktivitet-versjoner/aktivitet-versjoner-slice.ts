import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import * as Api from '../../../api/aktivitetAPI';
import { Status } from '../../../createGenericSlice';
import { VeilarbAktivitet } from '../../../datatypes/internAktivitetTypes';
import {
    flyttAktivitet,
    markerForhaandsorienteringSomLest,
    oppdaterAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterReferat,
    oppdaterStillingFraNavSoknadsstatus,
    publiserReferat,
    settAktivitetTilAvtalt,
} from '../aktivitet-actions';
import { getFnrIfVeileder } from '../../../utils/displayedUserSlice';
import { RootState } from '../../../reducer';

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
        builder.addCase(hentVersjonerForAktivitet.pending, (state) => {
            state.status = state.status === Status.NOT_STARTED ? Status.PENDING : Status.RELOADING;
        });
        builder.addCase(hentVersjonerForAktivitet.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = Status.OK;
        });
        builder.addCase(hentVersjonerForAktivitet.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addMatcher(
            isAnyOf(
                oppdaterAktivitetEtikett.fulfilled,
                oppdaterAktivitet.fulfilled,
                oppdaterStillingFraNavSoknadsstatus.fulfilled,
                oppdaterReferat.fulfilled,
                publiserReferat.fulfilled,
                markerForhaandsorienteringSomLest.fulfilled,
                settAktivitetTilAvtalt.fulfilled,
                flyttAktivitet.fulfilled,
            ),
            (state, action) => {
                if (state.status === Status.NOT_STARTED) {
                    return state;
                }
                return { ...state, data: [action.payload, ...state.data] };
            },
        );
    },
});

export const hentVersjonerForAktivitet = createAsyncThunk(
    `${aktivitetVersjonerSlice.name}/fetchVersjonerForAktivitet`,
    async (aktivitet: VeilarbAktivitet, thunkAPI) => {
        const fnr = getFnrIfVeileder(thunkAPI.getState() as RootState);
        return await Api.hentVersjonerTilAktivitet(aktivitet, fnr);
    },
);

export const { fjernVersjoner } = aktivitetVersjonerSlice.actions;

export default aktivitetVersjonerSlice.reducer;
