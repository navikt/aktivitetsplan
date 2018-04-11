import React from 'react';
import { render } from 'react-dom';
import { EKSEMPEL_FNR, CONTEXT_PATH } from './config';
import App from '../src/app';
import { fnrFraUrl } from '../src/bootstrap/fnr-provider';
import Modal from 'react-modal';

if (MOCK) {
    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    require('./mocks'); // eslint-disable-line global-require
}

if (!fnrFraUrl() && EKSEMPEL_FNR) {
    window.history.replaceState(
        EKSEMPEL_FNR,
        '',
        `${CONTEXT_PATH}/${EKSEMPEL_FNR}`
    );
}

Modal.setAppElement('#pagewrapper');

render(<App />, document.getElementById('mainapp'));
