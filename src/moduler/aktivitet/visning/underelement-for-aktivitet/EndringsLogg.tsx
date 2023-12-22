import { Accordion } from '@navikt/ds-react';
import React, { useState } from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import VersjonerForAktivitet from '../versjoner/VersjonerForAktivitet';
import { logAccordionAapnet } from '../../../../amplitude/amplitude';

interface Props {
    aktivitet: VeilarbAktivitet;
}

const EndringsLogg = (props: Props) => {
    const { aktivitet } = props;

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
                <VersjonerForAktivitet aktivitet={aktivitet} />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
