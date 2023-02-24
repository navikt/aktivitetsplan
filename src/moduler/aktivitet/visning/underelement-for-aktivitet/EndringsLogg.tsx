import { Accordion } from '@navikt/ds-react';
import React from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';

interface Props {
    hidden?: boolean;
    aktivitet: VeilarbAktivitet;
}

export default function EndringsLogg(props: Props) {
    const { aktivitet } = props;

    return (
        <Accordion>
            <Accordion.Item>
                <Accordion.Header>Historikk</Accordion.Header>
                <Accordion.Content>
                    <VersjonerForAktivitet
                        visible={true}
                        aktivitet={aktivitet}
                        className="underelementer-aktivitet__historikkvisning"
                    />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
}
