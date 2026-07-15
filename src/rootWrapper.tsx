import './base.css';
import './index.less';
import './apmInit';

import * as Sentry from '@sentry/react';
import React from 'react';

import App from './app';
import { hash } from './felles-komponenter/utils/hash';
import Provider from './Provider';
import { createRoot } from 'react-dom/client';
import { createRouterWithWrapper } from './routing/routerConfig';

const createRoutesForUser = createRouterWithWrapper();

export const renderAsReactRoot = (appElement: HTMLElement, props?: { fnr?: string }) => {
    const rootElement = createRoot(appElement || document.getElementById('root')!);
    Sentry.setUser({ id: hash(props?.fnr) });
    rootElement.render(
        <Provider fnr={props?.fnr}>
            <App createRoutesForUser={createRoutesForUser} key={'1'} />
        </Provider>,
    );
};
