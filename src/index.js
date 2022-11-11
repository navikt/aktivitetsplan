import 'moment-timezone';
import 'moment/locale/nb';

import './polyfill';

import NAVSPA from '@navikt/navspa';
import moment from 'moment';
import React from 'react';
import * as ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import App from './app';
import {eksternBrukerConfig, veilederConfig} from './mocks/appconfig';
import DemoBanner from './mocks/demo/demoBanner';
import {erEksternBruker} from './mocks/demo/sessionstorage';
import {stripBasename} from "history/PathUtils";

/* eslint-disable global-require */
if (!global.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
});

export const mockfnr = "12345678910";
if (process.env.REACT_APP_MOCK === 'true') {
    const path = window.location.pathname;
    const fnr = mockfnr;
    console.log({path});
    console.log(`${window.location.href}`);

    if (erEksternBruker()) {
        if (process.env.REACT_APP_USE_HASH_ROUTER) {
            window.history.replaceState({}, '', `${process.env.PUBLIC_URL}/#/`);
        } else {
            window.history.replaceState({}, '', `${process.env.PUBLIC_URL}/`);
        }
        window.appconfig = eksternBrukerConfig;
    } else if (!erEksternBruker()) {
        if (!path.includes(fnr) && process.env.REACT_APP_USE_HASH_ROUTER) {
            const hashstuff = path.split('#').reduce((a, b) => b);
            window.history.replaceState({}, '', `${process.env.PUBLIC_URL}/#/${fnr}`);
        }
        if (!path.includes(fnr) && !process.env.REACT_APP_USE_HASH_ROUTER) {
            window.history.replaceState({}, '', `${process.env.PUBLIC_URL}/${fnr}/`);
        }
        window.appconfig = veilederConfig;
    }

    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console
    require('./mocks'); // eslint-disable-line global-require

    ReactDOM.render(<DemoBanner/>, document.getElementById('demo'));
}

function AppWrapper(props) {
    if (process.env.REACT_APP_MOCK === "true") {
        props = {...props, fnr: erEksternBruker() ? undefined : mockfnr}
    }

    // Må settes etter at dokumentet er parset
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    ReactModal.setAppElement(id);

    return <App {...props} />;
}

NAVSPA.eksporter('aktivitetsplan', AppWrapper);
