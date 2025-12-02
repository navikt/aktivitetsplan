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
    selectHarSkriveTilgang,
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
    listenerApi: ListenerEffectAPI<unknown, ThunkDispatch<any, any, any>>,
) => {
    const state = listenerApi.getState() as RootState;
    const valgtPeriode = selectValgtPeriode(state);
    const harSkriveTilgang = selectHarSkriveTilgang(state);
    const erUnderOppfolging = selectErUnderOppfolging(state);
    const reservertMotDigitalKommunikasjonIKrr = selectReservasjonKRR(state);

    console.info(`[Middleware ${action.type}] - hentOppfolging`, valgtPeriode?.id);

    if (
        !reservertMotDigitalKommunikasjonIKrr &&
        harSkriveTilgang &&
        erUnderOppfolging &&
        valgtPeriode &&
        !valgtPeriode.slutt
    ) {
        console.log('[hentOppfolging] Setter write mode');
        listenerApi.dispatch(setWriteMode());
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
