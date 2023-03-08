import { Accordion } from '@navikt/ds-react';
import React from 'react';

import { AlleAktiviteter, isArenaAktivitet } from '../../../../datatypes/aktivitetTypes';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';

interface Props {
    aktivitet: AlleAktiviteter;
}

const EndringsLogg = (props: Props) => {
    const { aktivitet } = props;

    if (isArenaAktivitet(aktivitet)) {
        return null;
    }

    return (
        <Accordion.Item className="first:border-t-2 first:border-border-divider">
            <Accordion.Header>Historikk</Accordion.Header>
            <Accordion.Content>
                <VersjonerForAktivitet visible={true} aktivitet={aktivitet} />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
