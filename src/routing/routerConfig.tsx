import {
    createBrowserRouter,
    createHashRouter,
    Navigate,
    Outlet,
    RouteObject,
    useLocation,
    useParams,
} from 'react-router-dom';
import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import React, { useEffect } from 'react';
import { fjernDismissableErrors } from '../moduler/feilmelding/feil-slice';
import { Dispatch } from '../store';
import Hovedside from '../hovedside/Hovedside';
import { initialPageLoader, malLoader } from './loaders';
import LeggTilForm from '../moduler/aktivitet/ny-aktivitet/LeggTilForm';
import NyAktivitetForm from '../moduler/aktivitet/ny-aktivitet/NyAktivitetForm';
import AktivitetvisningContainer from '../moduler/aktivitet/visning/AktivitetvisningContainer';
import EndreAktivitet from '../moduler/aktivitet/rediger/EndreAktivitet';
import AvbrytAktivitet from '../moduler/aktivitet/avslutt/AvbrytAktivitet';
import FullforAktivitet from '../moduler/aktivitet/avslutt/FullforAktivitet';
import InformasjonModal from '../moduler/informasjon/informasjon-modal';
import AktivitetsplanPrint from '../moduler/utskrift/AktivitetsplanPrint';
import Mal from '../moduler/mal/mal';
import { JournalforingPage } from '../moduler/journalforing/JournalforingPage';

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

const routingConfig: (dispatch: Dispatch, fnr?: string) => RouteObject[] = (dispatch, fnr) => [
    {
        path: '/',
        element: <Hovedside />,
        loader: initialPageLoader(dispatch, fnr),
        children: [
            { path: 'mal', loader: malLoader(dispatch, fnr), element: <Mal /> },
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
    { path: 'journalforing', loader: initialPageLoader(dispatch, fnr), element: <JournalforingPage /> },
    { path: ':fnr/aktivitet/vis/:id', element: <RedirectToAktivitetWithoutFnr /> },
    { path: '*', element: <Navigate replace to={`/`} /> },
];
