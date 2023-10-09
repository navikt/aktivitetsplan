import '@navikt/ds-css';

import './tailwind.css';
import './index.less';

import * as Sentry from '@sentry/react';
import React from 'react';

import App from './app';
import { hash } from './felles-komponenter/utils/hash';
import Provider from './Provider';
import { SentryRoutes } from './sentry';
import { createRoot } from 'react-dom/client';

export const renderAsReactRoot = (appElement: HTMLElement, props?: { fnr?: string }) => {
    const rootElement = createRoot(appElement || document.getElementById('root')!);
    Sentry.setUser({ id: hash(props?.fnr) });
    rootElement.render(
        <Provider fnr={props?.fnr}>
            <App Routes={SentryRoutes} key={'1'} />
        </Provider>,
    );
};
