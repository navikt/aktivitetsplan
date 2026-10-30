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

const FNR_ATTRIBUTE = 'data-fnr';
const AKTIV_ENHET_ATTRIBUTE = 'data-aktivenhet';

export class DabAktivitetsplan extends HTMLElement {
    setFnr?: (fnr: string) => void;
    setAktivEnhet?: (enhet: string) => void;
    root: Root | undefined;
    appRoot: HTMLDivElement | undefined;

    private getComponentProps() {
        return {
            fnr: this.getAttribute(FNR_ATTRIBUTE) ?? undefined,
            aktivEnhet: this.getAttribute(AKTIV_ENHET_ATTRIBUTE) ?? undefined,
        };
    }

    private getPreloadedState(fnr: string | undefined): RootState | undefined {
        if (!fnr) {
            return undefined;
        }
        settSessionStorage(LocalStorageElement.FNR, fnr);
        return getPreloadedStateFromSessionStorage(fnr);
    }

    private mountReactApp({
        appRoot,
        fnr,
        aktivEnhet,
        preloadedState,
    }: {
        appRoot: HTMLDivElement;
        fnr: string | undefined;
        aktivEnhet: string | undefined;
        preloadedState: RootState | undefined;
    }) {
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

    private getOrCreateAppRoot() {
        if (this.appRoot) {
            return this.appRoot;
        }

        const appRoot = document.createElement('div');
        appRoot.id = 'aktivitetsplan-root';
        const shadowRootNode = this.attachShadow({ mode: 'closed' });
        shadowRootNode.appendChild(appRoot);

        // Load styles under this shadowDom-node, not root element
        const styleElem = document.createElement('style');
        styleElem.innerHTML = baseCss + lessCss + modulesCss + pdfCssAnnotationCss + pdfCssTextCss;
        shadowRootNode.appendChild(styleElem);

        this.appRoot = appRoot;
        return appRoot;
    }

    disconnectedCallback() {
        try {
            saveReduxStateToSessionStorage();
        } catch (e) {
            console.warn(`Failed to save redux state to session storage when unmounting web-component`, e);
        }
        this.root?.unmount();
        this.root = undefined;
        this.setFnr = undefined;
        this.setAktivEnhet = undefined;
    }

    connectedCallback() {
        if (this.root) {
            return;
        }
        const appRoot = this.getOrCreateAppRoot();
        const { fnr, aktivEnhet } = this.getComponentProps();
        const preloadedState = this.getPreloadedState(fnr);
        slettGamleSamtalereferatKladder();
        this.mountReactApp({ appRoot, fnr, aktivEnhet, preloadedState });
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === FNR_ATTRIBUTE && this.setFnr) {
            settSessionStorage(LocalStorageElement.FNR, newValue);
            this.setFnr(newValue);
        }
        if (name === AKTIV_ENHET_ATTRIBUTE && this.setAktivEnhet) {
            this.setAktivEnhet(newValue);
        }
    }

    static get observedAttributes() {
        return [FNR_ATTRIBUTE, AKTIV_ENHET_ATTRIBUTE];
    }
}
