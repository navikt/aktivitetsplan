import dsStyles from '@navikt/ds-css/dist/index.css?inline';
import { Modal } from '@navikt/ds-react';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';
import lessCss from './index.less?inline';
import modulesCss from './moduler/aktivitet/aktivitet-kort/Aktivitetskort.module.less?inline';
import tailwindCss from './tailwind.css?inline';

export class DabAktivitetsplan extends HTMLElement {
    connectedCallback() {
        const mountPoint = document.createElement('div');
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(mountPoint);

        // Load styles under this shadowDom-node, not root element
        const styleElem = document.createElement('style');
        styleElem.innerHTML = lessCss + tailwindCss + dsStyles + modulesCss;
        const linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.href = '@navikt/ds-css';
        shadowRoot.appendChild(styleElem);

        const fnr = this.getAttribute('data-fnr') ?? undefined;

        ReactDOM.render(<App key={'1'} fnr={fnr} />, mountPoint);

        // Mount modal under correct root-node
        Modal.setAppElement(mountPoint);
    }
}
