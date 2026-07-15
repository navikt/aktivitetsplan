import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router';
import React, { RefObject, useMemo } from 'react';
import { Location } from '@remix-run/router/history';
import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import { routingConfig } from '../routing/routerConfig';
import { ErVeilederContext, FnrOgEnhetContext, useErVeileder } from '../Provider';

type MemoryRouter = ReturnType<typeof createMemoryRouter>;

/* Rendrer hele appen men med in-memory router og mulighet for å sette initial redux-state slik at
 * mesteparten av mock-data er på plass ved første render */
export const WrappedHovedside = ({
    store,
    fnr,
    enhetId,
    routerRef,
}: {
    store: ToolkitStore;
    fnr?: string | undefined;
    enhetId?: string | undefined;
    /** Optional ref to access the router instance for route assertions in tests */
    routerRef?: RefObject<MemoryRouter | undefined>;
}) => {
    return (
        <FnrOgEnhetContext.Provider value={{ fnr, aktivEnhet: enhetId }}>
            <ErVeilederContext.Provider value={!!fnr}>
                <Provider store={store}>
                    <MemoryRouteProvider routerRef={routerRef} />
                </Provider>
            </ErVeilederContext.Provider>
        </FnrOgEnhetContext.Provider>
    );
};

const MemoryRouteProvider = ({ routerRef }: { routerRef?: RefObject<MemoryRouter | undefined> }) => {
    const dispatch = useAppDispatch();
    const erVeileder = useErVeileder();
    // Stable router instance — recreating it on every render would reset navigation state
    const router = useMemo(
        () =>
            createMemoryRouter(routingConfig(dispatch, erVeileder, '2121'), {
                initialEntries: ['/'],
                initialIndex: 0,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    if (routerRef) {
        routerRef.current = router;
    }
    return <RouterProvider router={router} />;
};

type Entry = string | Partial<Location>;

export const WrappedComponent = ({
    store,
    children,
    initialEntries,
}: {
    store: ToolkitStore;
    children: React.ReactNode;
    initialEntries: Entry[];
}) => {
    return (
        <Provider store={store}>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </Provider>
    );
};
