import { setDefaultOptions } from 'date-fns';
import nn from 'date-fns/locale/nn';
import React from 'react';

import { initAmplitude } from './analytics/umami';
import { ER_INTERN_FLATE, USE_MOCK } from './constant';
import { mockAktivEnhet, mockfnr } from './mocks/utils';
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
    webComponentTag.setAttribute('data-aktivEnhet', mockAktivEnhet);
    document.getElementById('mainapp')?.appendChild(webComponentTag);
    Promise.all([import('./mocks'), import('./mocks/demo/DemoBanner')]).then(
        ([{ default: startWorker }, { default: DemoBanner }]) => {
            startWorker().then(() => {
                const demoRoot = createRoot(document.getElementById('demo'));
                demoRoot.render(<DemoBanner />);
                renderApp();
            });
        },
    );
} else {
    initAmplitude();
    renderApp();
}
