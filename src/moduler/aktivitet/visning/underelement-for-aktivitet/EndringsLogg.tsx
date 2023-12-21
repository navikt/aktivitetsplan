import { Accordion } from '@navikt/ds-react';
import React from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import VersjonerForAktivitet from '../versjoner/VersjonerForAktivitet';
import { logAccordionAapnet } from '../../../../amplitude/amplitude';

interface Props {
    aktivitet: VeilarbAktivitet;
}

const EndringsLogg = (props: Props) => {
    const { aktivitet } = props;

    return (
        <Accordion.Item>
            <Accordion.Header onClick={() => logAccordionAapnet('Historikk')}>
                <div className="flex gap-4 items-center">Historikk</div>
            </Accordion.Header>
            <Accordion.Content>
                <VersjonerForAktivitet aktivitet={aktivitet} />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
