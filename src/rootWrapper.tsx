import '@navikt/ds-css';

import './tailwind.css';
import './index.less';
import './sentry';

import { Provider as AkselModalMountProvider, Modal } from '@navikt/ds-react';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';
import Provider from './Provider';
import { SentryRoutes } from './sentry';

export const renderAsReactRoot = (appElement: HTMLElement, props?: { fnr?: string }) => {
    const rootElement = document.getElementById('root') || undefined;
    Modal.setAppElement(appElement);
    ReactDOM.render(
        <AkselModalMountProvider rootElement={rootElement} appElement={appElement}>
            <Provider fnr={props?.fnr}>
                <App Routes={SentryRoutes} key={'1'} />
            </Provider>
        </AkselModalMountProvider>,
        appElement
    );
};
