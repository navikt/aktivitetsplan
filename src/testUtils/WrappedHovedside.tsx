import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { Location } from '@remix-run/router/history';
import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import { routingConfig } from '../routing/routerConfig';
import { ErVeilederContext, FnrOgEnhetContext, useErVeileder } from '../Provider';

/* Rendrer hele appen men med in-memory router og mulighet for å sette initial redux-state slik at
 * mesteparten av mock-data er på plass ved første render */
export const WrappedHovedside = ({
    store,
    fnr,
    enhetId,
}: {
    store: ToolkitStore;
    fnr?: string | undefined;
    enhetId?: string | undefined;
}) => {
    return (
        <FnrOgEnhetContext.Provider value={{ fnr, aktivEnhet: enhetId }}>
            <ErVeilederContext.Provider value={!!fnr}>
                <Provider store={store}>
                    <MemoryRouteProvider />
                </Provider>
            </ErVeilederContext.Provider>
        </FnrOgEnhetContext.Provider>
    );
};

const MemoryRouteProvider = () => {
    const dispatch = useAppDispatch();
    const erVeileder = useErVeileder();
    const router = createMemoryRouter(routingConfig(dispatch, erVeileder), {
        initialEntries: ['/'],
        initialIndex: 0,
    });
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
