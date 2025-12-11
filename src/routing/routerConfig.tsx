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
import { aktivitetsVisningLoader, initialPageLoader, malLoader } from './loaders';
import LeggTilNyttAktivitetsKort from '../moduler/aktivitet/ny-aktivitet/LeggTilNyttAktivitetsKort';
import NyAktivitetForm from '../moduler/aktivitet/ny-aktivitet/NyAktivitetForm';
import AktivitetvisningContainer from '../moduler/aktivitet/visning/AktivitetvisningContainer';
import EndreAktivitet from '../moduler/aktivitet/rediger/EndreAktivitet';
import AvbrytAktivitet from '../moduler/aktivitet/avslutt/AvbrytAktivitet';
import FullforAktivitet from '../moduler/aktivitet/avslutt/FullforAktivitet';
import InformasjonModal from '../moduler/informasjon/informasjon-modal';
import AktivitetsplanPrint, { aktivitetsplanPrintLoader } from '../moduler/utskrift/AktivitetsplanPrint';
import Mal from '../moduler/mal/mal';
import { arkivLoader, JournalforingPage } from '../moduler/journalforing/JournalforingPage';
import { BasePage } from '../BasePage';
import { useErVeileder } from '../Provider';

const baseName = 'aktivitetsplan';

const RedirectToAktivitetWithoutFnr = () => {
    const params = useParams();
    const erVeileder = useErVeileder();
    return <Navigate replace to={`${erVeileder ? '/' + baseName : ''}/aktivitet/vis/` + params.id} />;
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
    (dispatch: Dispatch, isVeileder: boolean, aktivEnhet: string): ReturnType<typeof createBrowserRouter> => {
        if (import.meta.env.VITE_USE_HASH_ROUTER === 'true') {
            return createHashRouter(routingConfig(dispatch, isVeileder, aktivEnhet));
        }
        return wrapper
            ? wrapper(routingConfig(dispatch, isVeileder, aktivEnhet))
            : createBrowserRouter(routingConfig(dispatch, isVeileder, aktivEnhet));
    };

export const routingConfig: (dispatch: Dispatch, isVeileder: boolean, aktivEnhet: string) => RouteObject[] = (
    dispatch,
    isVeileder,
    aktivEnhet,
) => [
    {
        path: isVeileder ? `/${baseName}` : '/',
        element: <BasePage />, // Dont reload essential data on every page navigation
        loader: initialPageLoader(dispatch, isVeileder),
        id: 'root',
        children: [
            {
                path: '',
                element: <Hovedside />,
                children: [
                    { path: 'mal', loader: malLoader(dispatch), element: <Mal /> },
                    { path: 'informasjon', element: <InformasjonModal /> },
                    {
                        path: 'aktivitet',
                        children: [
                            { path: 'ny', element: <LeggTilNyttAktivitetsKort /> },
                            { path: 'ny/*', element: <NyAktivitetForm /> },
                            {
                                id: 'aktivitetsVisning',
                                path: 'vis/:id',
                                element: <AktivitetvisningContainer />,
                                loader: aktivitetsVisningLoader(dispatch),
                            },
                            { path: 'endre/:id', element: <EndreAktivitet /> },
                            { path: 'avbryt/:id', element: <AvbrytAktivitet /> },
                            { path: 'fullfor/:id', element: <FullforAktivitet /> },
                        ],
                    },
                ],
            },
            {
                path: 'utskrift/:oppfolgingsperiodeId',
                loader: aktivitetsplanPrintLoader(dispatch, isVeileder),
                element: <AktivitetsplanPrint />
            },
            {
                path: 'journalforing/:oppfolgingsperiodeId',
                loader: arkivLoader(dispatch, aktivEnhet),
                element: <JournalforingPage />,
            },
            { path: ':fnr/aktivitet/vis/:id', element: <RedirectToAktivitetWithoutFnr /> },
            { path: 'aktivitet/vis/:id', element: <RedirectToAktivitetWithoutFnr /> },
            { path: '*', element: <Navigate replace to={isVeileder ? `/${baseName}` : '/'} /> },
        ],
    },
    { path: 'aktivitet/vis/:id', element: <RedirectToAktivitetWithoutFnr /> },
    { path: '*', element: <Navigate replace to={isVeileder ? `/${baseName}` : '/'} /> },
];
