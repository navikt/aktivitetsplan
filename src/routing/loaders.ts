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
        return defer({
            data: dispatch(initialPageLoadThunk(isVeileder)),
        });
    };

export const malLoader = (dispatch: Dispatch, isVeileder: boolean) => {
    return async () => dispatchAndDefer(dispatch, [hentMal(), hentMalListe()]);
};
