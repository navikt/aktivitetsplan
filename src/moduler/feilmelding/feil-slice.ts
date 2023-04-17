import { createSlice, isAnyOf, isAsyncThunkAction, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

import { SerializedError } from '../../api/utils';
import {
    flyttAktivitet,
    lagNyAktivitet,
    markerForhaandsorienteringSomLest,
    oppdaterAktivitet,
    oppdaterAktivitetEtikett,
    oppdaterCVSvar,
    oppdaterReferat,
    oppdaterStillingFraNavSoknadsstatus,
    publiserReferat,
    settAktivitetTilAvtalt,
} from '../aktivitet/aktivitet-actions';

type ErrorSliceType = Record<string, SerializedError>;

const dismissableErrors = [
    flyttAktivitet.rejected.type,
    lagNyAktivitet.rejected.type,
    oppdaterAktivitet.rejected.type,
    oppdaterAktivitetEtikett.rejected.type,
    oppdaterStillingFraNavSoknadsstatus.rejected.type,
    settAktivitetTilAvtalt.rejected.type,
    oppdaterReferat.rejected.type,
    publiserReferat.rejected.type,
    oppdaterCVSvar.rejected.type,
    markerForhaandsorienteringSomLest.rejected.type,
];

const errorSlice = createSlice({
    name: 'feil',
    initialState: {} as ErrorSliceType,
    reducers: {
        fjernDismissableErrors: (state) => {
            dismissableErrors.forEach((type) => {
                delete state[type];
            });
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            (action: AnyAction) => isAsyncThunkAction(action) && isRejected(action),
            (state, action) => {
                state[action.type] = { ...action.error, type: action.type };
            }
        );
        builder.addMatcher(isAnyOf(isFulfilled, isPending), (state, action) => {
            const type = action.type.replace('pending', 'rejected').replace('fulfilled', 'rejected');
            delete state[type];
        });
    },
});

export const { fjernDismissableErrors } = errorSlice.actions;

export default errorSlice.reducer;
