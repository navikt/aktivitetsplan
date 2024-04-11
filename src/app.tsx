import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AKTIVITETSPLAN_ROOT_NODE_ID, ER_INTERN_FLATE } from './constant';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';
import Timeoutbox from './felles-komponenter/timeoutbox/Timeoutbox';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { HiddenIf } from './utils/utils';
import { useAktivEnhet, useErVeileder } from './Provider';
import { Dispatch } from './store';
import { selectAktivEnhet } from './moduler/aktivEnhet/aktivenhet-slice';

function App({
    createRoutesForUser,
}: {
    createRoutesForUser: (dispatch: Dispatch, isVeileder: boolean) => ReturnType<typeof createBrowserRouter>;
}) {
    const erVeileder = useErVeileder();
    const aktivEnhet = useAktivEnhet();
    const dispatch = useAppDispatch();
    dispatch(selectAktivEnhet(aktivEnhet));
    const routes = createRoutesForUser(dispatch, erVeileder);
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
