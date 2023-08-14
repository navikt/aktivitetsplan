import { setDefaultOptions } from 'date-fns';
import nn from 'date-fns/locale/nn';
import React from 'react';
import * as ReactDOM from 'react-dom';

import { initAmplitude } from './amplitude/amplitude';
import { ER_INTERN_FLATE, USE_HASH_ROUTER, USE_MOCK } from './constant';
import DemoBanner from './mocks/demo/DemoBanner';
import { erEksternBruker } from './mocks/demo/localStorage';

setDefaultOptions({ locale: nn });

const exportToNavSpa = () => {
    // Denne må lazy importeres fordi den laster inn all css selv inn under sin egen shadow-root
    import('./webcomponentWrapper').then(({ DabAktivitetsplan }) => {
        customElements.define('dab-aktivitetsplan', DabAktivitetsplan);
    });
};

const renderAsRootApp = () => {
    import('./rootWrapper').then(({ renderAsReactRoot }) => {
        renderAsReactRoot(document.getElementById('mainapp') as HTMLElement);
    });
};

const renderApp = () => {
    if (ER_INTERN_FLATE) {
        exportToNavSpa();
    } else {
        renderAsRootApp();
    }
};

const isTest = import.meta.env.MODE === 'test';
if (USE_MOCK) {
    const pathnamePrefix = `${import.meta.env.BASE_URL}${USE_HASH_ROUTER ? '#/' : ''}`;

    if (erEksternBruker() && !isTest) {
        window.history.replaceState({}, '', pathnamePrefix);
    } else if (!erEksternBruker() && !isTest) {
        window.history.replaceState({}, '', pathnamePrefix);
    }

    import('./mocks')
        .then(({ default: startWorker }) => startWorker())
        .then(() => {
            ReactDOM.render(<DemoBanner />, document.getElementById('demo'));
            renderApp();
        });
} else {
    initAmplitude();
    renderApp();
}
