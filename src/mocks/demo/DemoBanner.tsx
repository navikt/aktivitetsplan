import { Heading, Modal, Provider as AkselProvider } from '@navikt/ds-react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import baseCss from '../../base.css?inline';
import lessCss from '../../index.less?inline';
import demoIkonCss from './DemoIkon.less?inline';

import DemoDashboard from './DemoDashboard';
import DemoIkon from './DemoIkon';

const DemoBannerInner = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <DemoIkon onClick={() => setOpen(true)} />
            <Modal
                closeOnBackdropClick={true}
                open={open}
                onClose={() => {
                    setOpen(false);
                    window.location.reload();
                }}
            >
                <Modal.Header closeButton={true}>
                    <Heading level="1" size="large">
                        Demoinnstillinger
                    </Heading>
                </Modal.Header>
                <DemoDashboard />
            </Modal>
        </div>
    );
};

const ELEMENT_TAG = 'demo-banner-wc';

class DemoBannerElement extends HTMLElement {
    connectedCallback() {
        const appRoot = document.createElement('div');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(appRoot);

        const styleElem = document.createElement('style');
        styleElem.innerHTML = baseCss + lessCss + demoIkonCss;
        shadowRoot.appendChild(styleElem);

        createRoot(appRoot).render(
            <AkselProvider rootElement={appRoot}>
                <DemoBannerInner />
            </AkselProvider>,
        );
    }
}

if (!customElements.get(ELEMENT_TAG)) {
    customElements.define(ELEMENT_TAG, DemoBannerElement);
}

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'demo-banner-wc': HTMLAttributes<HTMLElement>;
        }
    }
}

const DemoBanner = () => <demo-banner-wc />;

export default DemoBanner;
