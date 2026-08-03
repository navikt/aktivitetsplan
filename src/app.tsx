import React from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Theme } from '@navikt/ds-react';

import { AKTIVITETSPLAN_ROOT_NODE_ID } from './constant';
import useAppDispatch from './felles-komponenter/hooks/useAppDispatch';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { useErVeileder, useFnrOgEnhetContext } from './Provider';
import { Dispatch } from './store/store';

export type AppTheme = 'light' | 'dark';

function App({
    createRoutesForUser,
    theme,
}: {
    createRoutesForUser: (
        dispatch: Dispatch,
        isVeileder: boolean,
        aktivEnhet: string | undefined,
    ) => ReturnType<typeof createBrowserRouter>;
    theme?: AppTheme;
}) {
    const erVeileder = useErVeileder();
    const dispatch = useAppDispatch();
    const { aktivEnhet } = useFnrOgEnhetContext();
    const activeTheme = theme ?? 'light';

    const routes = createRoutesForUser(dispatch, erVeileder, aktivEnhet);
    return (
        <Theme asChild theme={activeTheme}>
            <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
                <div className="aktivitetsplan-wrapper w-full">
                    <RouterProvider router={routes} />
                </div>
                <UpdateEventHandler />
            </div>
        </Theme>
    );
}

export default App;
