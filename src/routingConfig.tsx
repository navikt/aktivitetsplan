import React, { useEffect } from 'react';
import {
    createBrowserRouter,
    createHashRouter,
    defer,
    json,
    LoaderFunction,
    Navigate,
    Outlet,
    RouteObject,
    useLocation,
    useParams,
} from 'react-router-dom';
import AktivitetsplanPrint from './moduler/utskrift/AktivitetsplanPrint';
import Hovedside from './hovedside/Hovedside';
import Aktivitetsmal from './moduler/mal/mal';
import InformasjonModal from './moduler/informasjon/informasjon-modal';
import LeggTilForm from './moduler/aktivitet/ny-aktivitet/LeggTilForm';
import NyAktivitetForm from './moduler/aktivitet/ny-aktivitet/NyAktivitetForm';
import FullforAktivitet from './moduler/aktivitet/avslutt/FullforAktivitet';
import AvbrytAktivitet from './moduler/aktivitet/avslutt/AvbrytAktivitet';
import EndreAktivitet from './moduler/aktivitet/rediger/EndreAktivitet';
import AktivitetvisningContainer from './moduler/aktivitet/visning/AktivitetvisningContainer';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';
import { fjernDismissableErrors } from './moduler/feilmelding/feil-slice';
import { hentDialoger } from './moduler/dialog/dialog-slice';
import { Dispatch } from './store';
import { hentMal } from './moduler/mal/aktivitetsmal-slice';
import { hentOppfolging } from './moduler/oppfolging-status/oppfolging-slice';
import { hentAktiviteter } from './moduler/aktivitet/aktivitet-actions';
import { hentIdentitet } from './moduler/identitet/identitet-slice';
import { hentArenaAktiviteter } from './moduler/aktivitet/arena-aktiviteter-slice';

const RedirectToAktivitetWithoutFnr = () => {
    const params = useParams();
    return <Navigate replace to={`/aktivitet/vis/` + params.id} />;
};

export const ErrorCleanerOnRouteChange = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fjernDismissableErrors());
    }, [location]);
    return <Outlet />;
};

// Sentry need to wrap createBrowserRouter to understand routes
export const createRouterWithWrapper =
    (wrapper?: typeof createBrowserRouter) =>
    (dispatch: Dispatch, fnr?: string): ReturnType<typeof createBrowserRouter> => {
        if (import.meta.env.VITE_USE_HASH_ROUTER === 'true') {
            return createHashRouter(routingConfig(dispatch, fnr));
        }
        return wrapper ? wrapper(routingConfig(dispatch, fnr)) : createBrowserRouter(routingConfig(dispatch, fnr));
    };

const initialPageLoader =
    (dispatch: Dispatch, fnr?: string): LoaderFunction =>
    async () => {
        const mal = dispatch(hentMal()).then((it) => it.payload);
        const oppfolging = dispatch(hentOppfolging()).then((it) => it.payload);
        const aktiviteter = dispatch(hentAktiviteter()).then((it) => it.payload);
        const dialoger = dispatch(hentDialoger()).then((it) => it.payload);
        const identitet = dispatch(hentIdentitet()).then((it) => it.payload);
        const arenaAktiviteter = dispatch(hentArenaAktiviteter()).then((it) => it.payload);
        return defer({ data: Promise.all([mal, oppfolging, aktiviteter, dialoger, identitet, arenaAktiviteter]) });
    };

const routingConfig: (dispatch: Dispatch, fnr?: string) => RouteObject[] = (dispatch, fnr) => [
    {
        path: '/',
        element: <Hovedside />,
        loader: initialPageLoader(dispatch, fnr),
        children: [
            { path: 'mal', element: <Aktivitetsmal /> },
            { path: 'informasjon', element: <InformasjonModal /> },
            {
                path: 'aktivitet',
                children: [
                    { path: 'ny', element: <LeggTilForm /> },
                    { path: 'ny/*', element: <NyAktivitetForm /> },
                    { path: 'vis/:id', element: <AktivitetvisningContainer /> },
                    { path: 'endre/:id', element: <EndreAktivitet /> },
                    { path: 'avbryt/:id', element: <AvbrytAktivitet /> },
                    { path: 'fullfor/:id', element: <FullforAktivitet /> },
                ],
            },
        ],
    },
    { path: 'utskrift', loader: initialPageLoader(dispatch, fnr), element: <AktivitetsplanPrint /> },
    { path: ':fnr/aktivitet/vis/:id', element: <RedirectToAktivitetWithoutFnr /> },
    { path: '*', element: <Navigate replace to={`/`} /> },
];
