import React from 'react';
import { Provider as AkselProvider } from '@navikt/ds-react';

import App from './app';
import baseCss from './base.css?inline';
import lessCss from './index.less?inline';
import { LocalStorageElement, settSessionStorage } from './mocks/demo/localStorage';
import modulesCss from './moduler/aktivitet/aktivitet-kort/Aktivitetskort.module.less?inline';
import Provider from './Provider';
import pdfCssAnnotationCss from 'react-pdf/dist/Page/AnnotationLayer.css?inline';
import pdfCssTextCss from 'react-pdf/dist/Page/TextLayer.css?inline';
import { createRoot, Root } from 'react-dom/client';
import { createRouterWithWrapper } from './routing/routerConfig';
import { slettGamleSamtalereferatKladder } from './moduler/aktivitet/aktivitet-forms/samtalereferat/useSamtalereferatKladd';
import type { RootState } from './store/rootReducer';
import {
    clearReduxCache,
    getPreloadedStateFromSessionStorage,
    saveReduxStateToSessionStorage,
} from './store/sessionStorageStoreCache';

// Clear redux-cache from session storage on page load to make sure new data is fetched
// Cache is only supposed to be used when "jumping" between apps in veilarbpersonflate
clearReduxCache();

export class DabAktivitetsplan extends HTMLElement {
    setFnr?: (fnr: string) => void;
    setAktivEnhet?: (enhet: string) => void;
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
        styleElem.innerHTML = baseCss + lessCss + modulesCss + pdfCssAnnotationCss + pdfCssTextCss;
        shadowRoot.appendChild(styleElem);

        const fnr = this.getAttribute('data-fnr') ?? undefined;
        const aktivEnhet = this.getAttribute('data-aktivEnhet') ?? undefined;
        let preloadedState: RootState | undefined = undefined;
        if (fnr) {
            settSessionStorage(LocalStorageElement.FNR, fnr);
            preloadedState = getPreloadedStateFromSessionStorage(fnr);
        }
        slettGamleSamtalereferatKladder();
        this.root = createRoot(appRoot);
        this.root.render(
            <AkselProvider rootElement={appRoot}>
                <Provider
                    preloadedState={preloadedState}
                    key={fnr}
                    fnr={fnr}
                    setFnrRef={(setFnr) => (this.setFnr = setFnr)}
                    setAktivEnhetRef={(setEnhet) => (this.setAktivEnhet = setEnhet)}
                    aktivEnhet={aktivEnhet}
                >
                    <App createRoutesForUser={createRouterWithWrapper()} key={'1'} />
                </Provider>
            </AkselProvider>,
        );
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-fnr' && this.setFnr) {
            settSessionStorage(LocalStorageElement.FNR, newValue);
            this.setFnr(newValue);
        }
        if (name === 'data-aktivEnhet' && this.setAktivEnhet) {
            settSessionStorage(LocalStorageElement.FNR, newValue);
            this.setAktivEnhet(newValue);
        }
    }

    static get observedAttributes() {
        return ['data-fnr', 'data-aktivEnhet'];
    }
}
