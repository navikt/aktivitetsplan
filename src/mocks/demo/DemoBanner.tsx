import { Heading, Modal } from '@navikt/ds-react';
import React, { useState } from 'react';

// CSS is imported twice when in demo mode to support switching between web-components and normal render
import '@navikt/ds-css';
import '../../tailwind.css';
import '../../index.less';
// Importerer her for å unngå stygt error i konsollen,
// Denne css-en er bare brukt i veielder-flaten og må importeres på en spesiell måte i web-components
// som gjør at react-pdf ikke skjønner at det funker
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import DemoDashboard from './DemoDashboard';
import DemoIkon from './DemoIkon';

const DemoBanner = () => {
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

export default DemoBanner;
