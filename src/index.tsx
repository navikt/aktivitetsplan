import { setDefaultOptions } from 'date-fns';
import nn from 'date-fns/locale/nn';
import React from 'react';
import * as ReactDOM from 'react-dom';

import { initAmplitude } from './amplitude/amplitude';
import { ER_INTERN_FLATE, USE_MOCK } from './constant';
import DemoBanner from './mocks/demo/DemoBanner';
import {mockfnr} from "./mocks/utils";

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
