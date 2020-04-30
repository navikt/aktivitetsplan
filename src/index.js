import './polyfill';
import React from 'react';
import ReactModal from 'react-modal';
import * as ReactDOM from 'react-dom';
import App from './app';
import NAVSPA from './NAVSPA';
import { erEksternBruker } from './mocks/demo/sessionstorage';
import { eksternBrukerConfig, veilederConfig } from './mocks/appconfig';
import DemoBanner from './mocks/demo/demoBanner';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/nb';

/* eslint-disable global-require */
if (!global.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
});

if (process.env.REACT_APP_MOCK === 'true') {
    const fnr = '/12345678910';
    const path = window.location.pathname;

    if (erEksternBruker()) {
        if (path.includes(fnr)) {
            window.history.replaceState({}, '', '/');
        }
        window.appconfig = eksternBrukerConfig;
    } else if (!erEksternBruker()) {
        if (!path.includes(fnr)) {
            window.history.replaceState({}, '', fnr);
        }
        window.appconfig = veilederConfig;
    }

    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    require('./mocks'); // eslint-disable-line global-require

    ReactDOM.render(<DemoBanner />, document.getElementById('demo'));
}

function AppWrapper(props) {
    // Må settes etter at dokumentet er parset
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    ReactModal.setAppElement(id);

    return <App {...props} />;
}

NAVSPA.eksporter('aktivitetsplan', AppWrapper);
