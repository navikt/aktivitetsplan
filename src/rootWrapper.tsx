import '@navikt/ds-css';

import './tailwind.css';
import './index.less';

import { Provider as AkselModalMountProvider, Modal } from '@navikt/ds-react';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';

export const renderAsReactRoot = (appElement: HTMLElement, props?: { fnr?: string }) => {
    const rootElement = document.getElementById('root') || undefined;
    Modal.setAppElement(appElement);
    ReactDOM.render(
        <AkselModalMountProvider rootElement={rootElement} appElement={appElement}>
            <App key={'1'} fnr={props?.fnr} />
        </AkselModalMountProvider>,
        appElement
    );
};
