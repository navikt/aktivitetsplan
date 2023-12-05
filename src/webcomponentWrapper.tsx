import dsStyles from '@navikt/ds-css/dist/index.css?inline';
import React from 'react';

import App from './app';
import lessCss from './index.less?inline';
import { LocalStorageElement, settSessionStorage } from './mocks/demo/localStorage';
import modulesCss from './moduler/aktivitet/aktivitet-kort/Aktivitetskort.module.less?inline';
import Provider from './Provider';
import tailwindCss from './tailwind.css?inline';
import { createRoot, Root } from 'react-dom/client';
import {
    clearReduxCache,
    getPreloadedStateFromSessionStorage,
    RootState,
    saveReduxStateToSessionStorage,
} from './store';
import { createRouterWithWrapper } from './routing/routingConfig';

// Clear redux-cache from session storage on page load to make sure new data is fetched
// Cache is only supposed to be used when "jumping" between apps in veilarbpersonflate
clearReduxCache();

export class DabAktivitetsplan extends HTMLElement {
    setFnr?: (fnr: string) => void;
    root: Root | undefined;

    disconnectedCallback() {
        saveReduxStateToSessionStorage();
        this.root?.unmount();
    }

    connectedCallback() {
        // This will be app entry point, need to be outside modal-mount node
        const appRoot = document.createElement('div');
        appRoot.id = 'aktivitetsplan-root';
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(appRoot);

        // Load styles under this shadowDom-node, not root element
        const styleElem = document.createElement('style');
        styleElem.innerHTML = dsStyles + tailwindCss + lessCss + modulesCss;
        shadowRoot.appendChild(styleElem);

        const fnr = this.getAttribute('data-fnr') ?? undefined;
        let preloadedState: RootState | undefined = undefined;
        if (fnr) {
            settSessionStorage(LocalStorageElement.FNR, fnr);
            preloadedState = getPreloadedStateFromSessionStorage(fnr);
        }
        this.root = createRoot(appRoot);
        this.root.render(
            <Provider
                preloadedState={preloadedState}
                key={fnr}
                fnr={fnr}
                setFnrRef={(setFnr) => (this.setFnr = setFnr)}
            >
                <App createRoutesForUser={createRouterWithWrapper()} key={'1'} />
            </Provider>,
        );
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-fnr' && this.setFnr) {
            settSessionStorage(LocalStorageElement.FNR, newValue);
            this.setFnr(newValue);
        }
    }
    static get observedAttributes() {
        return ['data-fnr'];
    }
}
