import {
    createSlice,
    isAnyOf,
    isAsyncThunkAction,
    isFulfilled,
    isPending,
    isRejected,
    PayloadAction,
} from '@reduxjs/toolkit';
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
import { oppdaterMal } from '../mal/aktivitetsmal-slice';

type FeilState = {
    serializedError: Record<string, SerializedError>;
    feilEier: string | undefined;
};

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
    oppdaterMal.rejected.type,
];

const errorSlice = createSlice({
    name: 'feil',
    initialState: {
        serializedError: {},
        feilEier: undefined,
    } as FeilState,
    reducers: {
        setErPåAnnenBrukersResssurs: (state, payload: PayloadAction<string>) => {
            console.log('Setter feil');
        },
        fjernDismissableErrors: (state) => {
            dismissableErrors.forEach((type) => {
                delete state.serializedError[type];
            });
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            (action: AnyAction) => isAsyncThunkAction(action) && isRejected(action),
            (state, action) => {
                state.serializedError[action.type] = { ...action.error, type: action.type };
            },
        );
        builder.addMatcher(isAnyOf(isFulfilled, isPending), (state, action) => {
            const type = action.type.replace('pending', 'rejected').replace('fulfilled', 'rejected');
            delete state.serializedError[type];
        });
    },
});

export const { fjernDismissableErrors, setErPåAnnenBrukersResssurs } = errorSlice.actions;
export default errorSlice.reducer;
