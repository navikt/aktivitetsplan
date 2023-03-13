import '@navikt/ds-css';

import './tailwind.css';
import './index.less';

import { Modal } from '@navikt/ds-react';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';

export const renderAsReactRoot = (rootElement: HTMLElement) => {
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    Modal.setAppElement(id);
    ReactDOM.render(<App key={'1'} />, rootElement);
};
