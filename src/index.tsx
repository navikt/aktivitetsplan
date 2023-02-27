import 'moment-timezone';
import 'moment/locale/nb';

import './polyfill';

import { Modal } from '@navikt/ds-react';
import NAVSPA from '@navikt/navspa';
import moment from 'moment';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';
import { eksternBrukerConfig, veilederConfig } from './mocks/appconfig';
import DemoBanner from './mocks/demo/demoBanner';
import { erEksternBruker } from './mocks/demo/sessionstorage';

/* eslint-disable global-require */
// if (!global.Intl) {
if (!window.Intl) {
    require('intl');
    require('intl/locale-data/jsonp/nb.js');
}

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
});

const usingHashRouting = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

console.log(import.meta.env);

export const mockfnr = '12345678910';

if (import.meta.env.DEV === true) {
    const fnr = mockfnr;
    // const pathnamePrefix = `${import.meta.env.BASE_URL}/${usingHashRouting ? '#/' : ''}`;
    const pathnamePrefix = '/';
    console.log(pathnamePrefix);

    if (erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix);
        window.appconfig = eksternBrukerConfig;
    } else if (!erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix + fnr);
        window.appconfig = veilederConfig;
    }

    console.log('=========================='); // eslint-disable-line no-console
    console.log('======== MED MOCK ========'); // eslint-disable-line no-console
    console.log('=========================='); // eslint-disable-line no-console

    import('./mocks').then(() => ReactDOM.render(<DemoBanner />, document.getElementById('demo')));
    // require('./mocks'); // eslint-disable-line global-require
}

function AppWrapper(props: any) {
    console.log('asdasd');
    if (import.meta.env.DEV === true) {
        console.log('asdasoidjasidjsaiodjasiodj');
        props = { ...props, fnr: erEksternBruker() ? undefined : mockfnr };
    }

    // Må settes etter at dokumentet er parset
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    Modal.setAppElement(id);

    return <App {...props} />;
}

function render() {
    if (window.NAVSPA) {
        console.log(window);
        return window.NAVSPA['aktivitetsplan'](document.getElementById('mainapp'));
    }
}
NAVSPA.eksporter('aktivitetsplan', AppWrapper);

render();
