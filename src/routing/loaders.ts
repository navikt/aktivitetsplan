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
    (dispatch: Dispatch, fnr?: string): LoaderFunction =>
    async () => {
        return defer({
            data: dispatch(initialPageLoadThunk(fnr)),
        });
    };

export const malLoader = (dispatch: Dispatch, fnr?: string) => {
    return async () => dispatchAndDefer(dispatch, [hentMal(), hentMalListe()]);
};
