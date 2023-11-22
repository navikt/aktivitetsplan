import { setDefaultOptions } from 'date-fns';
import nn from 'date-fns/locale/nn';
import React from 'react';

import { initAmplitude } from './amplitude/amplitude';
import { ER_INTERN_FLATE, USE_MOCK } from './constant';
import { mockfnr } from './mocks/utils';
import { createRoot } from 'react-dom/client';

setDefaultOptions({ locale: nn });

const exportAsWebcomponent = () => {
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
        exportAsWebcomponent();
    } else {
        renderAsRootApp();
    }
};

if (USE_MOCK) {
    const webComponentTag = document.createElement('dab-aktivitetsplan');
    webComponentTag.setAttribute('data-fnr', mockfnr);
    document.getElementById('root')?.appendChild(webComponentTag);
    Promise.all([import('./mocks'), import('./mocks/demo/DemoBanner')]).then(
        ([{ default: startWorker }, { default: DemoBanner }]) => {
            startWorker();
            const demoRoot = createRoot(document.getElementById('demo'));
            demoRoot.render(<DemoBanner />);
            renderApp();
        },
    );
} else {
    initAmplitude();
    renderApp();
}
