import '@navikt/ds-css';

import './tailwind.css';
import './index.less';

import { Provider as AkselModalMountProvider } from '@navikt/ds-react';
import * as Sentry from '@sentry/react';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';
import { hash } from './felles-komponenter/utils/hash';
import Provider from './Provider';
import { SentryRoutes } from './sentry';

export const renderAsReactRoot = (appElement: HTMLElement, props?: { fnr?: string }) => {
    const rootElement = document.getElementById('root') || undefined;
    Sentry.setUser({
        id: hash(props?.fnr),
    });
    ReactDOM.render(
        <AkselModalMountProvider rootElement={rootElement} appElement={appElement}>
            <Provider fnr={props?.fnr}>
                <App Routes={SentryRoutes} key={'1'} />
            </Provider>
        </AkselModalMountProvider>,
        appElement,
    );
};
