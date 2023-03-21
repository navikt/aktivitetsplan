import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import { StillingAktivitet } from '../../../datatypes/internAktivitetTypes';

interface Props {
    aktivitet: StillingAktivitet;
}

export default function Arbeidsgiver({ aktivitet }: Props) {
    const { arbeidsgiver } = aktivitet;

    if (!arbeidsgiver) {
        return null;
    }

    return <BodyShort>{arbeidsgiver}</BodyShort>;
}
