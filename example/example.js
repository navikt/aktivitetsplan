import React from 'react';
import { render } from 'react-dom';
import { EKSEMPEL_FNR, FNR_I_URL } from './config';
import App from '../src/app';
import { fnrFraUrl } from '../src/bootstrap/fnr-provider';
import Modal from 'react-modal';

/* eslint-disable global-require */
if (!global.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

if (MOCK) {
    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    require('./mocks'); // eslint-disable-line global-require
}

if (!fnrFraUrl() && FNR_I_URL) {
    window.history.replaceState(EKSEMPEL_FNR, '', `/${EKSEMPEL_FNR}`);
}

Modal.setAppElement('#pagewrapper');

render(<App />, document.getElementById('mainapp'));
