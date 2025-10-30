import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AKTIVITETSPLAN_ROOT_NODE_ID } from './constant';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { useErVeileder, useFnrOgEnhetContext } from './Provider';
import { Dispatch } from './store';
import { loadUmami } from './analytics/umami.client';

function App({
                 createRoutesForUser,
             }: {
    createRoutesForUser: (
        dispatch: Dispatch,
        isVeileder: boolean,
        aktivEnhet: string | undefined,
    ) => ReturnType<typeof createBrowserRouter>;
}) {
    const erVeileder = useErVeileder();
    const dispatch = useAppDispatch();
    const { aktivEnhet } = useFnrOgEnhetContext();
    const routes = createRoutesForUser(dispatch, erVeileder, aktivEnhet);

    useEffect(() => {
        loadUmami().catch((e) => {
            console.warn("Kunne ikke laste Umami-scriptet:", e);
        });
    }, []);

    return (
        <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
            <div className="aktivitetsplan-wrapper w-full">
                <RouterProvider router={routes} />
            </div>
            <UpdateEventHandler />
        </div>
    );
}

export default App;
