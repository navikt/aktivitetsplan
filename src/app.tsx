import React, { useEffect } from 'react';
import { BrowserRouter, createBrowserRouter, HashRouter, RouterProvider, useLocation } from 'react-router-dom';

import { AKTIVITETSPLAN_ROOT_NODE_ID, ER_INTERN_FLATE, ER_PROD } from './constant';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';
import Timeoutbox from './felles-komponenter/timeoutbox/Timeoutbox';
import { fjernDismissableErrors } from './moduler/feilmelding/feil-slice';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { HiddenIf } from './utils/utils';
import { useFnr } from './Provider';
import { Dispatch } from './store';

const Router = ({ children }: { children: React.ReactNode }) => {
    if (import.meta.env.VITE_USE_HASH_ROUTER === 'true') {
        return <HashRouter>{children}</HashRouter>;
    }
    return <BrowserRouter>{children}</BrowserRouter>;
};

const ErrorCleanerOnRouteChange = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fjernDismissableErrors());
    }, [location]);
    return null;
};

function App({
    createRoutesForUser,
}: {
    createRoutesForUser: (dispatch: Dispatch, fnr?: string) => ReturnType<typeof createBrowserRouter>;
}) {
    const fnr = useFnr();
    const dispatch = useAppDispatch();
    const routes = createRoutesForUser(dispatch, fnr);
    return (
        <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
            <div className="aktivitetsplan-wrapper w-full">
                <RouterProvider router={routes} />
                <HiddenIf hidden={ER_INTERN_FLATE}>
                    <Timeoutbox />
                </HiddenIf>
            </div>
            <UpdateEventHandler />
        </div>
    );
}

export default App;
