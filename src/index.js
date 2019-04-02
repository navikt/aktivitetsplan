import 'react-app-polyfill/ie11'
import React from 'react';
import ReactModal from 'react-modal';
import App from './app';
import {fnrFraUrl} from "./bootstrap/fnr-provider";
import NAVSPA from '../src/NAVSPA';

/* eslint-disable global-require */
if (!global.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

if (process.env.REACT_APP_MOCK === 'true') {

    // NOTE: This is bad, don't use it if you dont HAVE to
    window.appconfig = {
        CONTEXT_PATH: '',
        TILLAT_SET_AVTALT: true,
        VIS_SIDEBANNER: true,
        FNR_I_URL: true,
        VIS_MALER: true,
    };

    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    require('./mocks'); // eslint-disable-line global-require

    if (!fnrFraUrl() && window.appconfig.FNR_I_URL) {
        window.history.replaceState('12345678910', '', `/12345678910`);
    }
}

function AppWrapper(props) {
    // Må settes etter at dokumentet er parset
    ReactModal.setAppElement('#modal-a11y-wrapper');

    return <App {...props} />;
}

NAVSPA.eksporter('aktivitetsplan', AppWrapper);
