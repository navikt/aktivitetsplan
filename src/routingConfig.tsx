import React, { useEffect } from 'react';
import {
    createBrowserRouter,
    createHashRouter,
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
import { Router } from '@sentry/react/types/types';

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

export const createRouter = (wrapper?: (routes: RouteObject[]) => Router) => {
    if (import.meta.env.VITE_USE_HASH_ROUTER === 'true') {
        return createHashRouter(routingConfig);
    }
    return wrapper ? wrapper(routingConfig) : createBrowserRouter(routingConfig);
};

const routingConfig: RouteObject[] = [
    {
        path: '/',
        element: <Hovedside />,
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
    { path: 'utskrift', element: <AktivitetsplanPrint /> },
    { path: ':fnr/aktivitet/vis/:id', element: <RedirectToAktivitetWithoutFnr /> },
    { path: '*', element: <Navigate replace to={`/`} /> },
];
