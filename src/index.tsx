import 'moment-timezone';
import 'moment/dist/locale/nb';

import './polyfill';

import NAVSPA from '@navikt/navspa';
import { setDefaultOptions } from 'date-fns';
import nn from 'date-fns/locale/nn';
import moment from 'moment';
import React from 'react';
import * as ReactDOM from 'react-dom';

import AppWebComponent from './AppWebComponent';
import { eksternBrukerConfig, veilederConfig } from './mocks/appconfig';
import DemoBanner from './mocks/demo/demoBanner';
import { erEksternBruker } from './mocks/demo/sessionstorage';
import { renderAsReactRoot } from './rootWrapper';

declare global {
    interface Window {
        NAVSPA: any;
        Intl: any;
        appconfig: {
            CONTEXT_PATH: string;
            TILLAT_SET_AVTALT: boolean;
            VIS_MALER: boolean;
            TIMEOUTBOX: boolean;
        };
    }
}

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
});
setDefaultOptions({ locale: nn });

const usingHashRouting: boolean = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

const mockfnr = '12345678910';

const useMock = import.meta.env.DEV || usingHashRouting;

const rootElement = document.getElementById('mainapp') as HTMLElement;

const exportToNavSpa = () => {
    NAVSPA.eksporter('aktivitetsplan', AppWebComponent);
    window.NAVSPA['aktivitetsplan'](rootElement);
    import('./webcomponentWrapper').then(({ DabAktivitetsplan }) => {
        customElements.define('dab-aktivitetsplan', DabAktivitetsplan);
    });
};

const renderAsRootApp = (props?: { fnr?: string }) => {
    renderAsReactRoot(rootElement, props);
};

const renderApp = (props?: { fnr?: string }) => {
    if (window.NAVSPA) {
        exportToNavSpa();
    } else {
        renderAsRootApp(props);
    }
};

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
            const props = { fnr: erEksternBruker() ? undefined : mockfnr };
            renderApp(props);
        });
} else {
    renderApp();
}
