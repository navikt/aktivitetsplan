import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Accordion } from '@navikt/ds-react';
import React from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import VersjonerForAktivitet from '../versjoner/VersjonerForAktivitet';

interface Props {
    aktivitet: VeilarbAktivitet;
}

const EndringsLogg = (props: Props) => {
    const { aktivitet } = props;

    return (
        <Accordion.Item className="first:border-t-2 first:border-border-divider">
            <Accordion.Header>
                <div className="flex gap-4 items-center">
                    <ClockDashedIcon aria-hidden fontSize="1.5rem" />
                    Historikk
                </div>
            </Accordion.Header>
            <Accordion.Content>
                <VersjonerForAktivitet aktivitet={aktivitet} />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
