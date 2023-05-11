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
}

const initialState: AktivitetState = {
    data: [],
    status: Status.NOT_STARTED,
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
        builder.addCase(markerForhaandsorienteringSomLest.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state }, action.payload);
        });
        builder.addCase(settAktivitetTilAvtalt.fulfilled, (state, action) => {
            windowEvent(UpdateTypes.Aktivitet);
            return nyStateMedOppdatertAktivitet({ ...state }, action.payload);
        });
        builder.addMatcher(
            isAnyOf(
                oppdaterCVSvar.fulfilled,
                oppdaterAktivitetEtikett.fulfilled,
                oppdaterStillingFraNavSoknadsstatus.fulfilled
            ),
            (state, action) => {
                return nyStateMedOppdatertAktivitet({ ...state }, action.payload);
            }
        );
        builder.addMatcher(
            isAnyOf(flyttAktivitet.fulfilled, oppdaterReferat.fulfilled, publiserReferat.fulfilled),
            (state, action) => {
                windowEvent(UpdateTypes.Aktivitet);
                return nyStateMedOppdatertAktivitet({ ...state }, action.payload);
            }
        );
        builder.addMatcher(isAnyOf(hentAktiviteter.rejected, hentAktivitet.rejected), (state) => {
            state.status = Status.ERROR;
        });
    },
});

export default aktivitetSlice.reducer;
