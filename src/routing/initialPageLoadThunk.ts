import { AsyncThunk, AsyncThunkAction, createAsyncThunk } from '@reduxjs/toolkit';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-slice';
import { hentIdentitet } from '../moduler/identitet/identitet-slice';
import { hentVeilederInfo } from '../moduler/veileder/veileder-slice';
import { hentMal } from '../moduler/mal/aktivitetsmal-slice';
import { hentDialoger } from '../moduler/dialog/dialog-slice';
import { hentAktiviteter } from '../moduler/aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../moduler/aktivitet/arena-aktiviteter-slice';
import { selectOppfolgingStatus } from '../moduler/oppfolging-status/oppfolging-selector';
import { RootState } from '../store';
import { Status } from '../createGenericSlice';
import { selectIdentitetStatus } from '../moduler/identitet/identitet-selector';
import { selectVeilederStatus } from '../moduler/veileder/veileder-selector';
import { Dispatch } from 'react';
import { selectMalStatus } from '../moduler/mal/aktivitetsmal-selector';
import { selectArenaAktivitetStatus } from '../moduler/aktivitet/arena-aktivitet-selector';
import { selectAktivitetStatus } from '../moduler/aktivitet/aktivitet-selector';
import { hentLest } from '../moduler/lest/lest-slice';
import { selectLestStatus } from '../moduler/lest/lest-selector';

const createFetchIfNotStartedThunk = (sliceLoader: CacheableSliceLoader) => {
    return createAsyncThunk('initialPageLoad/' + sliceLoader.key, async (isVeileder: boolean, thunkApi) => {
        const { getState, dispatch } = thunkApi;
        return fetchIfNotStarted(sliceLoader)(getState() as RootState, dispatch, isVeileder);
    });
};

// Re-triggered when switching tabs in veilarbpersonflate, dont need to re-fetch data if recently fetched
export const initialPageLoadThunks = {
    oppfolging: createFetchIfNotStartedThunk({
        fetchAction: hentOppfolging,
        statusSelector: selectOppfolgingStatus,
        key: 'oppfolging',
    }),
    identitet: createFetchIfNotStartedThunk({
        fetchAction: hentIdentitet,
        statusSelector: selectIdentitetStatus,
        key: 'identitet',
    }),
    veileder: createFetchIfNotStartedThunk({
        fetchAction: hentVeilederInfo,
        statusSelector: selectVeilederStatus,
        veilederOnly: true,
        key: 'veileder',
    }),
    mal: createFetchIfNotStartedThunk({ fetchAction: hentMal, statusSelector: selectMalStatus, key: 'mal' }),
    aktiviteter: createFetchIfNotStartedThunk({
        fetchAction: hentAktiviteter,
        statusSelector: selectAktivitetStatus,
        key: 'aktiviteter',
    }),
    arenaAktiviteter: createFetchIfNotStartedThunk({
        fetchAction: hentArenaAktiviteter,
        statusSelector: selectArenaAktivitetStatus,
        key: 'arenaAktiviteter',
    }),
    lest: createFetchIfNotStartedThunk({ fetchAction: hentLest, statusSelector: selectLestStatus, key: 'lest' }),
    dialoger: hentDialoger,
} as const;

interface CacheableSliceLoader {
    fetchAction: AsyncThunk<any, void, any>;
    statusSelector: (state: RootState) => Status;
    key: string;
    veilederOnly?: boolean;
}

export const fetchIfNotStarted =
    ({ statusSelector, fetchAction, veilederOnly }: CacheableSliceLoader) =>
    (state: RootState, dispatch: Dispatch<AsyncThunkAction<any, any, any>>, isVeileder: boolean) => {
        const status = statusSelector(state);
        if (status === Status.NOT_STARTED && (!veilederOnly || isVeileder)) {
            return dispatch(fetchAction());
        }
        return Promise.resolve(null);
    };
