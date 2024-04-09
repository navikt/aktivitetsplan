import { AsyncThunk, AsyncThunkAction, createAsyncThunk } from '@reduxjs/toolkit';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-slice';
import { hentIdentitet } from '../moduler/identitet/identitet-slice';
import { hentVeilederInfo } from '../moduler/veileder/veileder-slice';
import { hentEskaleringsvarsel } from '../moduler/varslinger/eskaleringsvarsel-slice';
import { hentMal } from '../moduler/mal/aktivitetsmal-slice';
import { hentDialoger } from '../moduler/dialog/dialog-slice';
import { hentAktiviteter } from '../moduler/aktivitet/aktivitet-actions';
import { hentArenaAktiviteter } from '../moduler/aktivitet/arena-aktiviteter-slice';
import { selectOppfolgingStatus } from '../moduler/oppfolging-status/oppfolging-selector';
import { RootState } from '../store';
import { Status } from '../createGenericSlice';
import { selectIdentitetStatus } from '../moduler/identitet/identitet-selector';
import { selectVeilederStatus } from '../moduler/veileder/veileder-selector';
import { selectEskaleringsvarselStatus } from '../moduler/varslinger/eskaleringsvarsel-selector';
import { Dispatch } from 'react';
import { selectMalStatus } from '../moduler/mal/aktivitetsmal-selector';
import { selectDialogStatus } from '../moduler/dialog/dialog-selector';
import { selectArenaAktivitetStatus } from '../moduler/aktivitet/arena-aktivitet-selector';
import { selectAktivitetStatus } from '../moduler/aktivitet/aktivitet-selector';
import { hentLest } from '../moduler/lest/lest-slice';
import { selectLestStatus } from '../moduler/lest/lest-selector';

// Re-triggered when switching tabs in veilarbpersonflate, dont need to re-fetch data if recently fetched
export const initialPageLoadThunk = createAsyncThunk('initialPageLoad', async (isVeileder: boolean, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const state = getState() as RootState;
    dispatch(hentDialoger);
    return {
        ...fetchIfNotStartedAll([
            { fetchAction: hentOppfolging, statusSelector: selectOppfolgingStatus, key: 'oppfolging' },
            { fetchAction: hentIdentitet, statusSelector: selectIdentitetStatus, key: 'identitet' },
            {
                fetchAction: hentVeilederInfo,
                statusSelector: selectVeilederStatus,
                veilederOnly: true,
                key: 'veileder',
            },
            { fetchAction: hentMal, statusSelector: selectMalStatus, key: 'mal' },
            {
                fetchAction: hentEskaleringsvarsel,
                statusSelector: selectEskaleringsvarselStatus,
                key: 'eskaleringsvarsel',
            },
            { fetchAction: hentAktiviteter, statusSelector: selectAktivitetStatus, key: 'aktiviteter' },
            { fetchAction: hentArenaAktiviteter, statusSelector: selectArenaAktivitetStatus, key: 'arenaAktiviteter' },
            { fetchAction: hentLest, statusSelector: selectLestStatus, key: 'lest' },
        ])(state, dispatch, isVeileder),
        dialoger: dispatch(hentDialoger), // Alltid hent dialoger ved page-load
    };
});

interface CacheableSliceLoader {
    fetchAction: AsyncThunk<any, any, any>;
    statusSelector: (state: RootState) => Status;
    key: string;
    veilederOnly?: boolean;
}

const fetchIfNotStartedAll =
    (stateLoaders: CacheableSliceLoader[]) =>
    (state: RootState, dispatch: Dispatch<AsyncThunkAction<any, any, any>>, isVeileder: boolean) => {
        return stateLoaders.reduce((acc, { statusSelector, fetchAction, veilederOnly, key }) => {
            const status = statusSelector(state);
            if (status === Status.NOT_STARTED && (!veilederOnly || isVeileder)) {
                return { ...acc, [key]: dispatch(fetchAction()) };
            }
            return { ...acc, [key]: Promise.resolve(null) };
        }, {});
    };
