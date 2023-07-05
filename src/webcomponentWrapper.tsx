import dsStyles from '@navikt/ds-css/dist/index.css?inline';
import { Modal, Provider as ModalProvider } from '@navikt/ds-react';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Routes } from 'react-router-dom';

import App from './app';
import { AktivitetsplanEvents } from './felles-komponenter/hooks/useEventListner';
import lessCss from './index.less?inline';
import modulesCss from './moduler/aktivitet/aktivitet-kort/Aktivitetskort.module.less?inline';
import Provider from './Provider';
import { aktivitetRoute } from './routes/routes';
import tailwindCss from './tailwind.css?inline';

// Hvis bruker står i dialog og navigarer til en spesifikk aktivitet uten at aktivitetsplanen er
// mountet må dette fanges opp
let initalRouteAktivitetsId: string | undefined = undefined;
window.addEventListener(
    AktivitetsplanEvents.visAktivitetsplan,
    (event) => {
        const aktivitetId = event.detail as string | undefined;
        if (!aktivitetId) return;
        initalRouteAktivitetsId = aktivitetId;
    },
    { once: true }
);

export class DabAktivitetsplan extends HTMLElement {
    setFnr?: (fnr: string) => void;
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
        const initialRoute = !initalRouteAktivitetsId ? undefined : aktivitetRoute(initalRouteAktivitetsId, fnr);

        ReactDOM.render(
            <ModalProvider appElement={appRoot} rootElement={shadowDomFirstChild}>
                <Provider key={fnr} fnr={fnr} setFnrRef={(setFnr) => (this.setFnr = setFnr)}>
                    <App initialRoute={initialRoute} Routes={Routes} key={'1'} />
                </Provider>
            </ModalProvider>,
            appRoot
        );

        // Mount modal under correct root-node
        Modal.setAppElement(appRoot);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-fnr' && this.setFnr) {
            this.setFnr(newValue);
        }
    }
    static get observedAttributes() {
        return ['data-fnr'];
    }
}
