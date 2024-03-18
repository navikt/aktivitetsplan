import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Provider } from 'react-redux';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { Location } from '@remix-run/router/history';
import useAppDispatch from '../felles-komponenter/hooks/useAppDispatch';
import { routingConfig } from '../routing/routerConfig';
import { useFnr } from '../Provider';

/* Rendrer hele appen men med in-memory router og mulighet for å sette initial redux-state slik at
 * mesteparten av mock-data er på plass ved første render */
export const WrappedHovedside = ({ store }: { store: ToolkitStore }) => {
    return (
        <Provider store={store}>
            <MemoryRouteProvider />
        </Provider>
    );
};

const MemoryRouteProvider = () => {
    const dispatch = useAppDispatch();
    const fnr = useFnr();
    const router = createMemoryRouter(routingConfig(dispatch, fnr), { initialEntries: ['/'], initialIndex: 0 });
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
