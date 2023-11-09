import '@navikt/ds-css';

import './tailwind.css';
import './index.less';

import * as Sentry from '@sentry/react';
import React from 'react';

import App from './app';
import { hash } from './felles-komponenter/utils/hash';
import Provider from './Provider';
import { sentryCreateBrowserRouter } from './sentry';
import { createRoot } from 'react-dom/client';
import { createRouter } from './routingConfig';

const BrowserRoutes = createRouter(sentryCreateBrowserRouter);

export const renderAsReactRoot = (appElement: HTMLElement, props?: { fnr?: string }) => {
    const rootElement = createRoot(appElement || document.getElementById('root')!);
    Sentry.setUser({ id: hash(props?.fnr) });
    rootElement.render(
        <Provider fnr={props?.fnr}>
            <App Routes={BrowserRoutes} key={'1'} />
        </Provider>,
    );
};
