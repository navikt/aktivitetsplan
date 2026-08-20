import { Accordion, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';

import VersjonerForAktivitet from '../versjoner/VersjonerForAktivitet';
import { logAccordionAapnet } from '../../../../analytics/analytics';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';

const EndringsLogg = ({ aktivitetsType }: { aktivitetsType: VeilarbAktivitetType }) => {
    const [open, setOpen] = useState(false);
    function handleClick() {
        if (!open) {
            logAccordionAapnet('Historikk', aktivitetsType);
        }
        setOpen(!open);
    }

    return (
        <Accordion.Item>
            <Accordion.Header onClick={handleClick}>
                <Heading level="2" size="small" className="flex text-ax-text-neutral">
                    Historikk
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <VersjonerForAktivitet />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
