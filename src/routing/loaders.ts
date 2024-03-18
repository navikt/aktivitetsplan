import { Dispatch } from '../store';
import { defer, LoaderFunction } from 'react-router-dom';
import { hentMal } from '../moduler/mal/aktivitetsmal-slice';
import { hentOppfolging } from '../moduler/oppfolging-status/oppfolging-slice';
import { hentAktiviteter } from '../moduler/aktivitet/aktivitet-actions';
import { hentDialoger } from '../moduler/dialog/dialog-slice';
import { hentIdentitet } from '../moduler/identitet/identitet-slice';
import { hentArenaAktiviteter } from '../moduler/aktivitet/arena-aktiviteter-slice';
import { hentNivaa4 } from '../moduler/tilgang/tilgang-slice';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { hentMalListe } from '../moduler/mal/malliste-slice';
import { hentEskaleringsvarsel } from '../moduler/varslinger/eskaleringsvarsel-slice';

const dispatchAndDefer = (dispatch: Dispatch, actions: AsyncThunkAction<any, any, any>[]) => {
    const promisedData = Promise.all(actions.map((it) => dispatch(it)));
    return defer({ data: promisedData });
};

export const initialPageLoader =
    (dispatch: Dispatch, fnr?: string): LoaderFunction =>
    async () => {
        const mal = dispatch(hentMal()).then((it) => it.payload);
        const oppfolging = dispatch(hentOppfolging()).then((it) => it.payload);
        const aktiviteter = dispatch(hentAktiviteter()).then((it) => it.payload);
        const dialoger = dispatch(hentDialoger()).then((it) => it.payload);
        const identitet = dispatch(hentIdentitet()).then((it) => it.payload);
        const arenaAktiviteter = dispatch(hentArenaAktiviteter()).then((it) => it.payload);
        const niva4 = fnr ? dispatch(hentNivaa4(fnr)).then((it) => it.payload) : Promise.resolve();
        const eskaleringsvarsel = dispatch(hentEskaleringsvarsel());
        return defer({
            hovedsideData: Promise.all([
                mal,
                oppfolging,
                aktiviteter,
                dialoger,
                identitet,
                arenaAktiviteter,
                niva4,
                eskaleringsvarsel,
            ]),
        });
    };

export const malLoader = (dispatch: Dispatch, fnr?: string) => {
    return async () => dispatchAndDefer(dispatch, [hentMal(), hentMalListe()]);
};
