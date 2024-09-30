import { Dispatch } from '../store';
import { defer, LoaderFunction, useRouteLoaderData } from 'react-router-dom';
import { hentMal } from '../moduler/mal/aktivitetsmal-slice';
import { hentMalListe } from '../moduler/mal/malliste-slice';
import { initialPageLoadThunks } from './initialPageLoadThunk';
import { hentAktivitet } from '../moduler/aktivitet/aktivitet-actions';
import { erArenaId, hentArenaAktiviteter } from '../moduler/aktivitet/arena-aktiviteter-slice';

export const initialPageLoader =
    (dispatch: Dispatch, isVeileder: boolean): LoaderFunction =>
    async () => {
        const thunks = initialPageLoadThunks;
        return defer({
            oppfolging: dispatch(thunks.oppfolging(isVeileder)),
            identitet: dispatch(thunks.identitet(isVeileder)),
            veileder: dispatch(thunks.veileder(isVeileder)),
            mal: dispatch(thunks.mal(isVeileder)),
            dialoger: dispatch(thunks.dialoger()),
            aktiviteter: dispatch(thunks.aktiviteter(isVeileder)),
            arenaAktiviteter: dispatch(thunks.arenaAktiviteter(isVeileder)),
            lest: dispatch(thunks.lest(isVeileder)),
            innsynsrett: dispatch(thunks.innsynsrett()),
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

export const malLoader = (dispatch: Dispatch) => {
    return () =>
        defer({
            data: Promise.all([dispatch(hentMal()), dispatch(hentMalListe())]),
        });
};

export const aktivitetsVisningLoader =
    (dispatch: Dispatch): LoaderFunction =>
    ({ params }) => {
        if (!params.id) return {};
        const arenaId = erArenaId(params.id);
        return defer({
            aktivitet: arenaId ? dispatch(hentArenaAktiviteter()) : dispatch(hentAktivitet(params.id)),
        });
    };

export const useAktivitetsVisningLoaderData = () =>
    useRouteLoaderData('aktivitetsVisning') as { aktivitet: Promise<any> };
