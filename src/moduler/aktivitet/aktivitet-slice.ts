import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { Status } from '../../createGenericSlice';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../datatypes/internAktivitetTypes';
import { UpdateTypes, windowEvent } from '../../utils/UpdateHandler';
import {
    flyttAktivitet,
    hentAktivitet,
    hentAktiviteter,
    lagNyAktivitet,
    markerForhaandsorienteringSomLest,
    oppdaterAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterCVSvar,
    oppdaterReferat,
    oppdaterStillingFraNavSoknadsstatus,
    publiserReferat,
    settAktivitetTilAvtalt,
} from './aktivitet-actions';

export interface AktivitetState {
    data: VeilarbAktivitet[];
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
        builder.addCase(hentAktiviteter.fulfilled, (state, action) => {
            state.status = Status.OK;
            state.data = action.payload.aktiviteter;
        });
        builder.addCase(hentAktivitet.fulfilled, (state, action) => {
            state.status = Status.OK;
            state.data = state.data.filter((aktivitet) => aktivitet.id !== action.payload.id).concat(action.payload);
        });
        builder.addCase(lagNyAktivitet.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            state.status = Status.OK;
            state.data = [...state.data, action.payload];
        });
        builder.addCase(flyttAktivitet.pending, (state, action) => {
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.RELOADING }, action.meta.arg.aktivitet, {
                nesteStatus: action.meta.arg.status,
            });
        });
        builder.addCase(flyttAktivitet.rejected, (state, action) => {
            return nyStateMedOppdatertAktivitet({ ...state, status: Status.ERROR }, action.meta.arg.aktivitet);
        });
        builder.addCase(markerForhaandsorienteringSomLest.pending, (state) => {
            state.fhoLestStatus = Status.RELOADING;
        });
        builder.addCase(markerForhaandsorienteringSomLest.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoLestStatus: Status.OK }, action.payload);
        });
        builder.addCase(markerForhaandsorienteringSomLest.rejected, (state) => {
            state.fhoLestStatus = Status.ERROR;
        });
        builder.addCase(settAktivitetTilAvtalt.pending, (state) => {
            state.fhoBekreftStatus = Status.RELOADING;
        });
        builder.addCase(settAktivitetTilAvtalt.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state, fhoBekreftStatus: Status.OK }, action.payload);
        });
        builder.addCase(settAktivitetTilAvtalt.rejected, (state) => {
            state.fhoBekreftStatus = Status.ERROR;
        });
        builder.addCase(oppdaterCVSvar.pending, (state) => {
            state.cvSvarStatus = Status.PENDING;
        });
        builder.addCase(oppdaterCVSvar.fulfilled, (state, action) => {
            return nyStateMedOppdatertAktivitet({ ...state, cvSvarStatus: Status.OK }, action.payload);
        });
        builder.addCase(oppdaterCVSvar.rejected, (state) => {
            state.cvSvarStatus = Status.ERROR;
        });
        builder.addMatcher(
            isAnyOf(
                oppdaterAktivitetEtikett.fulfilled,
                oppdaterAktivitet.fulfilled,
                oppdaterStillingFraNavSoknadsstatus.fulfilled,
                flyttAktivitet.fulfilled,
                oppdaterReferat.fulfilled,
                publiserReferat.fulfilled
            ),
            (state, action) => {
                windowEvent(UpdateTypes.Aktivitet);
                return nyStateMedOppdatertAktivitet({ ...state, status: Status.OK }, action.payload);
            }
        );
        builder.addMatcher(
            isAnyOf(
                oppdaterAktivitetEtikett.pending,
                oppdaterAktivitet.pending,
                oppdaterStillingFraNavSoknadsstatus.pending,
                lagNyAktivitet.pending,
                oppdaterReferat.pending,
                publiserReferat.pending
            ),
            (state) => {
                state.status = Status.RELOADING;
            }
        );
        builder.addMatcher(
            isAnyOf(
                hentAktiviteter.rejected,
                hentAktivitet.rejected,
                oppdaterAktivitetEtikett.rejected,
                oppdaterAktivitet.rejected,
                oppdaterStillingFraNavSoknadsstatus.rejected
            ),
            (state) => {
                state.status = Status.ERROR;
            }
        );
    },
});

export default aktivitetSlice.reducer;
