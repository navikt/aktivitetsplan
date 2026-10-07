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

type Theme = 'dark' | 'light';

const readTheme = (element: Element | null): Theme | undefined => {
    if (!element) return undefined;

    const dataTheme = element.getAttribute('data-theme');
    if (dataTheme === 'dark' || dataTheme === 'light') return dataTheme;
    if (element.classList.contains('dark')) return 'dark';
    if (element.classList.contains('light')) return 'light';
    return undefined;
};

const resolveHostTheme = (hostElement: HTMLElement): Theme | undefined => {
    const akselThemeRoot = hostElement.closest('.aksel-theme, [data-theme="dark"], [data-theme="light"]');
    const akselTheme = readTheme(akselThemeRoot);
    if (akselTheme) return akselTheme;

    const themed = hostElement.closest('.dark, .light');
    return readTheme(themed) ?? readTheme(document.body) ?? readTheme(document.documentElement);
};

export class DabAktivitetsplan extends HTMLElement {
    setFnr?: (fnr: string) => void;
    setAktivEnhet?: (enhet: string) => void;
    root: Root | undefined;
    appRoot?: HTMLDivElement;
    themeObserver?: MutationObserver;
    theme?: Theme;

    private syncTheme = () => {
        if (!this.appRoot) return;
        const nextTheme = resolveHostTheme(this);
        if (nextTheme === this.theme) return;

        this.theme = nextTheme;
        this.appRoot.classList.remove('dark', 'light');
        this.appRoot.removeAttribute('data-theme');
        if (nextTheme) {
            this.appRoot.classList.add('aksel-theme');
            this.appRoot.classList.add(nextTheme);
            this.appRoot.setAttribute('data-theme', nextTheme);
        }
    };

    disconnectedCallback() {
        this.themeObserver?.disconnect();
        saveReduxStateToSessionStorage();
        this.root?.unmount();
    }

    connectedCallback() {
        // This will be app entry point, need to be outside modal-mount node
        const appRoot = document.createElement('div');
        appRoot.id = 'aktivitetsplan-root';
        appRoot.classList.add('aksel-theme');
        appRoot.setAttribute('data-color', 'accent');
        this.appRoot = appRoot;
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
        this.syncTheme();

        // Følg med når hosten toggler tema (typisk klasse/attributt-endring høyt i treet)
        this.themeObserver = new MutationObserver(this.syncTheme);
        this.themeObserver.observe(document.documentElement, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class', 'data-theme'],
        });

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
