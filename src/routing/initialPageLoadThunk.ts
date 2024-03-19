import { Action, AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-slice';
import { hentIdentitet } from '../moduler/identitet/identitet-slice';
import { hentNivaa4 } from '../moduler/tilgang/tilgang-slice';
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
import { selectNivaa4Status } from '../moduler/tilgang/tilgang-selector';
import { selectVeilederStatus } from '../moduler/veileder/veileder-selector';
import { selectEskaleringsvarselStatus } from '../moduler/varslinger/eskaleringsvarsel-selector';
import { Dispatch } from 'react';
import { selectMalStatus } from '../moduler/mal/aktivitetsmal-selector';
import { selectDialogStatus } from '../moduler/dialog/dialog-selector';
import { selectArenaAktivitetStatus } from '../moduler/aktivitet/arena-aktivitet-selector';
import { selectAktivitetStatus } from '../moduler/aktivitet/aktivitet-selector';

// Re-triggered when switching tabs in veilarbpersonflate, dont need to re-fetch data if recently fetched
export const initialPageLoadThunk = createAsyncThunk('initialPageLoad', async (fnr: string | undefined, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const state = getState() as RootState;
    return fetchIfNotStarted([
        { fetchAction: hentOppfolging, statusSelector: selectOppfolgingStatus },
        { fetchAction: hentIdentitet, statusSelector: selectIdentitetStatus },
        { fetchAction: hentNivaa4, statusSelector: selectNivaa4Status, veilederOnly: true },
        { fetchAction: hentVeilederInfo, statusSelector: selectVeilederStatus, veilederOnly: true },
        { fetchAction: hentMal, statusSelector: selectMalStatus },
        { fetchAction: hentEskaleringsvarsel, statusSelector: selectEskaleringsvarselStatus },
        { fetchAction: hentDialoger, statusSelector: selectDialogStatus },
        { fetchAction: hentAktiviteter, statusSelector: selectAktivitetStatus },
        { fetchAction: hentArenaAktiviteter, statusSelector: selectArenaAktivitetStatus },
    ])(state, dispatch, fnr);
});

const fetchIfNotStarted =
    (
        stateLoaders: {
            fetchAction: AsyncThunk<any, any, any>;
            statusSelector: (state: RootState) => Status;
            veilederOnly?: boolean | undefined;
        }[],
    ) =>
    (state: RootState, dispatch: Dispatch<AsyncThunk<any, any, any>>, fnr: string | undefined) => {
        return Promise.all(
            stateLoaders.map(({ statusSelector, fetchAction, veilederOnly }) => {
                const status = statusSelector(state);
                if (status === Status.NOT_STARTED && (!veilederOnly || fnr !== undefined)) dispatch(fetchAction());
            }),
        );
    };
