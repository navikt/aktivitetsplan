import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AKTIVITETSPLAN_ROOT_NODE_ID, ER_INTERN_FLATE } from './constant';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';
import Timeoutbox from './felles-komponenter/timeoutbox/Timeoutbox';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { HiddenIf } from './utils/utils';
import { useFnr } from './Provider';
import { Dispatch } from './store';

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
