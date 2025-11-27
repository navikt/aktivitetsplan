import { Accordion } from '@navikt/ds-react';
import React, { useState } from 'react';

import VersjonerForAktivitet from '../versjoner/VersjonerForAktivitet';
import { logAccordionAapnet } from '../../../../analytics/analytics';

const EndringsLogg = () => {
    const [open, setOpen] = useState(false);
    function handleClick() {
        if (!open) {
            logAccordionAapnet('Historikk');
        }
        setOpen(!open);
    }

    return (
        <Accordion.Item>
            <Accordion.Header onClick={handleClick}>
                <div className="flex gap-4 items-center">Historikk</div>
            </Accordion.Header>
            <Accordion.Content>
                <VersjonerForAktivitet />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
