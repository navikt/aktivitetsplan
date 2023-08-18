import { Modal } from '@navikt/ds-react';
import React, { useState } from 'react';

import DemoDashboard from './DemoDashboard';
import DemoIkon from './DemoIkon';

const DemoBanner = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <DemoIkon onClick={() => setOpen(true)} />
            <Modal open={open} onClose={() => setOpen(false)}>
                <DemoDashboard />
            </Modal>
        </div>
    );
};

export default DemoBanner;
