import dsStyles from '@navikt/ds-css/dist/index.css?inline';
import { Modal, Provider } from '@navikt/ds-react';
import React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';
import lessCss from './index.less?inline';
import modulesCss from './moduler/aktivitet/aktivitet-kort/Aktivitetskort.module.less?inline';
import tailwindCss from './tailwind.css?inline';

export class DabAktivitetsplan extends HTMLElement {
    connectedCallback() {
        // Cant mount on shadowRoot, create a extra div for mounting modal
        const shadowDomFirstChild = document.createElement('div');
        // This will be app entry point, need to be outside modal-mount node
        const appRoot = document.createElement('div');
        appRoot.id = 'aktivitetsplan-root';
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(shadowDomFirstChild);
        shadowDomFirstChild.appendChild(appRoot);

        // Load styles under this shadowDom-node, not root element
        const styleElem = document.createElement('style');
        styleElem.innerHTML = dsStyles + tailwindCss + lessCss + modulesCss;
        shadowRoot.appendChild(styleElem);

        const fnr = this.getAttribute('data-fnr') ?? undefined;

        ReactDOM.render(
            <Provider appElement={appRoot} rootElement={shadowDomFirstChild}>
                <App key={'1'} fnr={fnr} />
            </Provider>,
            appRoot
        );

        // Mount modal under correct root-node
        Modal.setAppElement(appRoot);
    }
}
