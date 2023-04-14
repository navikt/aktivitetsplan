import { createSlice, isAsyncThunkAction, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { createSelector } from 'reselect';

import { SerializedError } from '../../api/utils';
import { RootState } from '../../store';
import { hentAktiviteter } from '../aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../aktivitet/arena-aktiviteter-slice';
import { hentDialoger } from '../dialog/dialog-slice';
import { hentIdentitet } from '../identitet/identitet-slice';
import { hentLest } from '../lest/lest-slice';
import { hentOppfolging } from '../oppfolging-status/oppfolging-slice';
import { hentNivaa4 } from '../tilgang/tilgang-slice';

type ErrorSliceType = Record<string, SerializedError>;

const errorSlice = createSlice({
    name: 'dialog',
    initialState: {} as ErrorSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            (action: AnyAction) => isAsyncThunkAction(action) && isRejected(action),
            (state, action) => {
                state[action.type] = { ...action.error, type: action.type };
            }
        );
        builder.addMatcher(
            (action: AnyAction) => isAsyncThunkAction(action) && isFulfilled(action),
            (state, action) => {
                delete state[action.type];
            }
        );
    },
});

const selectSelf = (state: RootState) => state.data.errors;
export const selectFeilSlice = selectSelf;
export const hovedsideFeil = [
    hentOppfolging.rejected.type,
    hentIdentitet.rejected.type,
    hentAktiviteter.rejected.type,
    hentArenaAktiviteter.rejected.type,
    hentLest.rejected.type,
    hentDialoger.rejected.type,
    hentNivaa4.rejected.type,
];
export const selectHovedsideFeil = createSelector(selectSelf, (state) => {
    return Object.entries(state)
        .filter(([type, _]) => hovedsideFeil.includes(type))
        .map(([_, val]) => val);
});
export default errorSlice.reducer;
