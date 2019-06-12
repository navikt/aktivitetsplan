import './polyfill'
import React from 'react';
import ReactModal from 'react-modal';
import App from './app';
import NAVSPA from './NAVSPA';
import * as ReactDOM from 'react-dom';
import DemoDashboard from './mocks/demoDashboard'
import { erEksternBruker } from "./mocks/sessionstorage";
import { eksternBrukerConfig, veilederConfig } from "./mocks/appconfig";

/* eslint-disable global-require */
if (!global.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

if (process.env.REACT_APP_MOCK === 'true') {
    const fnr = '/12345678910';
    const path = window.location.pathname;

    if (erEksternBruker()) {
        if(path.includes(fnr)) {
            window.history.replaceState({}, '', '/');
        }
        window.appconfig = eksternBrukerConfig;
    }
    else if(!erEksternBruker()) {
        if(!path.includes(fnr)) {
            window.history.replaceState({}, '', fnr);
        }
        window.appconfig = veilederConfig
    }

    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    require('./mocks'); // eslint-disable-line global-require

    ReactDOM.render(
        <DemoDashboard/>,
        document.getElementById('demo')
    );
}

function AppWrapper(props) {
    // Må settes etter at dokumentet er parset
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    ReactModal.setAppElement(id);

    return <App {...props} />;
}

NAVSPA.eksporter('aktivitetsplan', AppWrapper);
