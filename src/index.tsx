import './polyfill';

import NAVSPA from '@navikt/navspa';
import { setDefaultOptions } from 'date-fns';
import nn from 'date-fns/locale/nn';
import React from 'react';
import * as ReactDOM from 'react-dom';

import AppWebComponent from './AppWebComponent';
import { USE_HASH_ROUTER, USE_MOCK } from './constant';
import DemoBanner from './mocks/demo/DemoBanner';
import { erEksternBruker } from './mocks/demo/sessionstorage';
import { renderAsReactRoot } from './rootWrapper';

declare global {
    interface Window {
        NAVSPA: any;
    }
}

setDefaultOptions({ locale: nn });

export const mockfnr = '12345678910';

const exportToNavSpa = () => {
    NAVSPA.eksporter('aktivitetsplan', AppWebComponent);
    // Denne må lazy importeres fordi den laster inn all css selv inn under sin egen shadow-root
    import('./webcomponentWrapper').then(({ DabAktivitetsplan }) => {
        customElements.define('dab-aktivitetsplan', DabAktivitetsplan);
    });
};

const renderAsRootApp = (props?: { fnr?: string }) => {
    renderAsReactRoot(document.getElementById('mainapp') as HTMLElement, props);
};

const renderApp = (props?: { fnr?: string }) => {
    if (['development', 'dev-intern', 'prod-intern'].includes(import.meta.env.MODE)) {
        exportToNavSpa();
    } else {
        renderAsRootApp(props);
    }
};

const isTest = import.meta.env.MODE === 'test';
if (USE_MOCK) {
    const fnr = mockfnr;
    const pathnamePrefix = `${import.meta.env.BASE_URL}${USE_HASH_ROUTER ? '#/' : ''}`;

    if (erEksternBruker() && !isTest) {
        window.history.replaceState({}, '', pathnamePrefix);
    } else if (!erEksternBruker() && !isTest) {
        window.history.replaceState({}, '', pathnamePrefix + fnr);
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
