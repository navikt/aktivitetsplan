import '@navikt/ds-css';

import './tailwind.css';
import './index.less';

import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';

export const renderAsReactRoot = (rootElement: HTMLElement) => {
    ReactDOM.render(<App key={'1'} />, rootElement);
};
