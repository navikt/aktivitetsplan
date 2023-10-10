import dsStyles from '@navikt/ds-css/dist/index.css?inline';
import React from 'react';
import { Routes } from 'react-router-dom';

import App from './app';
import lessCss from './index.less?inline';
import { LocalStorageElement, settLocalStorage } from './mocks/demo/localStorage';
import modulesCss from './moduler/aktivitet/aktivitet-kort/Aktivitetskort.module.less?inline';
import Provider from './Provider';
import tailwindCss from './tailwind.css?inline';
import { createRoot, Root } from 'react-dom/client';
import { saveReduxStateToSessionStorage } from './store';

export class DabAktivitetsplan extends HTMLElement {
    setFnr?: (fnr: string) => void;
    root: Root | undefined;

    disconnectedCallback() {
        saveReduxStateToSessionStorage();
        this.root?.unmount();
    }

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
        if (fnr) {
            settLocalStorage(LocalStorageElement.FNR, fnr);
        }
        this.root = createRoot(appRoot);
        this.root.render(
            <Provider key={fnr} fnr={fnr} setFnrRef={(setFnr) => (this.setFnr = setFnr)}>
                <App Routes={Routes} key={'1'} />
            </Provider>,
        );
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-fnr' && this.setFnr) {
            settLocalStorage(LocalStorageElement.FNR, newValue);
            this.setFnr(newValue);
        }
    }
    static get observedAttributes() {
        return ['data-fnr'];
    }
}
