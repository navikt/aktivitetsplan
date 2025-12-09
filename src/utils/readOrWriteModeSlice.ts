import {
    createListenerMiddleware,
    createSelector,
    createSlice,
    ListenerEffectAPI,
    PayloadAction,
    ThunkDispatch,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { velgPeriode } from '../moduler/filtrering/filter/valgt-periode-slice';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-slice';
import {
    selectErUnderOppfolging,
    selectReservasjonKRR,
    selectValgtPeriode,
} from '../moduler/oppfolging-status/oppfolging-selector';

export enum ReadWriteMode {
    READ = 'READ',
    WRITE = 'WRITE',
}

const readOrWriteModeSlice = createSlice({
    name: 'readOrWriteMode',
    initialState: {
        mode: ReadWriteMode.READ,
    },
    reducers: {
        setWriteMode(state, action: PayloadAction) {
            state.mode = ReadWriteMode.WRITE;
        },
        setReadMode(state, action: PayloadAction) {
            state.mode = ReadWriteMode.READ;
        },
    },
});

const selectReadWriteSlice = (state: RootState) => state.view.readOrWriteMode;

export const selectReadWriteMode = createSelector(selectReadWriteSlice, (subState) => {
    return subState.mode;
});

export const { setReadMode, setWriteMode } = readOrWriteModeSlice.actions;

/*
 * Middlewares
 * */
export const readWriteModeMiddleware = createListenerMiddleware();

const oppdaterSkriveLeseTilgang = (
    action: any,
    listenerApi: ListenerEffectAPI<RootState, ThunkDispatch<any, any, any>>,
) => {
    const state = listenerApi.getState();
    const valgtPeriode = selectValgtPeriode(state);
    const erUnderOppfolging = selectErUnderOppfolging(state);
    const reservertMotDigitalKommunikasjonIKrr = selectReservasjonKRR(state);

    if (!reservertMotDigitalKommunikasjonIKrr && erUnderOppfolging && valgtPeriode && !valgtPeriode.slutt) {
        listenerApi.dispatch(setWriteMode());
    } else {
        listenerApi.dispatch(setReadMode());
    }
};

// If user and not reserved in KRR, set write mode
readWriteModeMiddleware.startListening({
    actionCreator: hentOppfolging.fulfilled,
    effect: oppdaterSkriveLeseTilgang,
});

// If closed periode selected, set read mode
readWriteModeMiddleware.startListening({
    actionCreator: velgPeriode,
    effect: oppdaterSkriveLeseTilgang,
});

export default readOrWriteModeSlice.reducer;
