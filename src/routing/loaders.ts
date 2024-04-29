import { Dispatch } from '../store';
import { defer, LoaderFunction } from 'react-router-dom';
import { hentMal } from '../moduler/mal/aktivitetsmal-slice';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { hentMalListe } from '../moduler/mal/malliste-slice';
import { initialPageLoadThunk } from './initialPageLoadThunk';

const dispatchAndDefer = (dispatch: Dispatch, actions: AsyncThunkAction<any, any, any>[]) => {
    const promisedData = Promise.all(actions.map((it) => dispatch(it)));
    return defer({ data: promisedData });
};

export const initialPageLoader =
    (dispatch: Dispatch, isVeileder: boolean): LoaderFunction =>
    async () => {
        const value = dispatch(initialPageLoadThunk(isVeileder));
        return defer({
            // data: value,
            oppfolging: value.then((it) => it.payload['oppfolging']),
            identitet: value.then((it) => it.payload['identitet']),
            veileder: value.then((it) => it.payload['veileder']),
            mal: value.then((it) => it.payload['mal']),
            eskaleringsvarsel: value.then((it) => it.payload['eskaleringsvarsel']),
            dialoger: value.then((it) => it.payload['dialoger']),
            aktiviteter: value.then((it) => it.payload['aktiviteter']),
            arenaAktiviteter: value.then((it) => it.payload['arenaAktiviteter']),
            lest: value.then((it) => it.payload['lest']),
        });
    };

export interface InitialPageLoadResult {
    oppfolging: Promise<any>;
    identitet: Promise<any>;
    veileder: Promise<any>;
    mal: Promise<any>;
    eskaleringsvarsel: Promise<any>;
    dialoger: Promise<any>;
    aktiviteter: Promise<any>;
    arenaAktiviteter: Promise<any>;
    lest: Promise<any>;
}

export const malLoader = (dispatch: Dispatch, isVeileder: boolean) => {
    return async () => dispatchAndDefer(dispatch, [hentMal(), hentMalListe()]);
};
