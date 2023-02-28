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

declare const window: {
    NAVSPA: any;
    Intl: any;
    history: History;
    appconfig: {
        CONTEXT_PATH: string;
        TILLAT_SET_AVTALT: boolean;
        VIS_MALER: boolean;
        TIMEOUTBOX: boolean;
    };
};

/* eslint-disable global-require */
// if (!global.Intl) {
// TODO fix
if (!window.Intl) {
    import('intl');
    import('intl/locale-data/jsonp/nb.js');
}

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
});

const usingHashRouting: boolean = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

const mockfnr = '12345678910';

const useMock = import.meta.env.DEV || usingHashRouting;

if (useMock) {
    const fnr = mockfnr;
    const pathnamePrefix = `${import.meta.env.BASE_URL}${usingHashRouting ? '#/' : ''}`;
    if (erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix);
        window.appconfig = eksternBrukerConfig;
    } else if (!erEksternBruker()) {
        window.history.replaceState({}, '', pathnamePrefix + fnr);
        window.appconfig = veilederConfig;
    }

    import('./mocks')
        .then(({ default: startWorker }) => startWorker())
        .then(() => {
            ReactDOM.render(<DemoBanner />, document.getElementById('demo'));
            render();
        });
}

function AppWrapper(props: any) {
    if (import.meta.env.DEV) {
        props = { ...props, fnr: erEksternBruker() ? undefined : mockfnr };
    }

    // Må settes etter at dokumentet er parset
    const id = document.getElementById('pagewrapper') ? '#pagewrapper' : '#modal-a11y-wrapper';
    Modal.setAppElement(id);

    return <App {...props} />;
}

function render() {
    if (window.NAVSPA) {
        return window.NAVSPA['aktivitetsplan'](document.getElementById('mainapp'));
    }
}
NAVSPA.eksporter('aktivitetsplan', AppWrapper);
