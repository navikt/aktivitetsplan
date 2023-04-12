import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { Status } from '../../createGenericSlice';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { UpdateTypes, windowEvent } from '../../utils/UpdateHandler';
import {
    flyttAktivitetThunk,
    hentAktivitetThunk,
    hentAktiviteterThunk,
    lagNyAktivitetThunk,
    markerForhaandsorienteringSomLestThunk,
    oppdaterAktivitetEtikettThunk,
    oppdaterAktivitetThunk,
    oppdaterCVSvarThunk,
    oppdaterReferatThunk,
    oppdaterStillingFraNavSoknadsstatusThunk,
    publiserReferatThunk,
    settAktivitetTilAvtaltThunk,
} from './aktivitet-actions';

interface AktivitetState {
    data: VeilarbAktivitet[] & { nesteStatus?: AktivitetStatus };
    status: Status;
    fhoLestStatus: Status;
    fhoBekreftStatus: Status;
    cvSvarStatus: Status;
}

const initialState: AktivitetState = {
    data: [],
    status: Status.NOT_STARTED,
    fhoLestStatus: Status.NOT_STARTED,
    fhoBekreftStatus: Status.NOT_STARTED,
    cvSvarStatus: Status.NOT_STARTED,
};

function nyStateMedOppdatertAktivitet(
    state: AktivitetState,
    aktivitet: VeilarbAktivitet,
    aktivitetData?: { nesteStatus: AktivitetStatus }
) {
    const aktivitetIndex = state.data.findIndex((a) => a.id === aktivitet.id);
    const nyState = [...state.data];
    nyState[aktivitetIndex] = { ...aktivitet, ...aktivitetData };
    return { ...state, data: nyState };
}

const aktivitetSlice = createSlice({
    name: 'aktivitet',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentAktiviteterThunk.fulfilled, (state, action) => {
            state.status = Status.OK;
            state.data = action.payload.aktiviteter;
        });
        builder.addCase(hentAktivitetThunk.fulfilled, (state, action) => {
            state.status = Status.OK;
            state.data = state.data.filter((aktivitet) => aktivitet.id !== action.payload.id).concat(action.payload);
        });
        builder.addCase(lagNyAktivitetThunk.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            state.status = Status.OK;
            state.data = [...state.data, action.payload];
        });
        builder.addCase(flyttAktivitetThunk.pending, (state, action) => {
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.RELOADING }, action.meta.arg.aktivitet, {
                nesteStatus: action.meta.arg.status,
            });
        });
        builder.addCase(flyttAktivitetThunk.rejected, (state, action) => {
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.ERROR }, action.meta.arg.aktivitet);
        });
        builder.addCase(markerForhaandsorienteringSomLestThunk.pending, (state) => {
            state.fhoLestStatus = Status.RELOADING;
        });
        builder.addCase(markerForhaandsorienteringSomLestThunk.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoLestStatus: Status.OK }, action.payload);
        });
        builder.addCase(markerForhaandsorienteringSomLestThunk.rejected, (state) => {
            state.fhoLestStatus = Status.ERROR;
        });
        builder.addCase(settAktivitetTilAvtaltThunk.pending, (state) => {
            state.fhoBekreftStatus = Status.RELOADING;
        });
        builder.addCase(settAktivitetTilAvtaltThunk.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoBekreftStatus: Status.OK }, action.payload);
        });
        builder.addCase(settAktivitetTilAvtaltThunk.rejected, (state) => {
            state.fhoBekreftStatus = Status.ERROR;
        });
        builder.addCase(oppdaterCVSvarThunk.pending, (state) => {
            state.cvSvarStatus = Status.PENDING;
        });
        builder.addCase(oppdaterCVSvarThunk.fulfilled, (state, action) => {
            return nyStateMedOppdatertAktivitet({ ...state, cvSvarStatus: Status.OK }, action.payload);
        });
        builder.addCase(oppdaterCVSvarThunk.rejected, (state) => {
            state.cvSvarStatus = Status.ERROR;
        });
        builder.addMatcher(
            isAnyOf(
                oppdaterAktivitetEtikettThunk.fulfilled,
                oppdaterAktivitetThunk.fulfilled,
                oppdaterStillingFraNavSoknadsstatusThunk.fulfilled,
                flyttAktivitetThunk.fulfilled,
                oppdaterReferatThunk.fulfilled,
                publiserReferatThunk.fulfilled
            ),
            (state, action) => {
                windowEvent(UpdateTypes.Aktivitet);
                return nyStateMedOppdatertAktivitet({ ...state, status: Status.OK }, action.payload);
            }
        );
        builder.addMatcher(
            isAnyOf(
                oppdaterAktivitetEtikettThunk.pending,
                oppdaterAktivitetThunk.pending,
                oppdaterStillingFraNavSoknadsstatusThunk.pending,
                lagNyAktivitetThunk.pending,
                oppdaterReferatThunk.pending,
                publiserReferatThunk.pending
            ),
            (state) => {
                state.status = Status.RELOADING;
            }
        );
        builder.addMatcher(
            isAnyOf(
                hentAktiviteterThunk.rejected,
                hentAktivitetThunk.rejected,
                oppdaterAktivitetEtikettThunk.rejected,
                oppdaterAktivitetThunk.rejected,
                oppdaterStillingFraNavSoknadsstatusThunk.rejected
            ),
            (state) => {
                state.status = Status.ERROR;
            }
        );
    },
});

export default aktivitetSlice.reducer;
