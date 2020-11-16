import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../types';

interface Props {
    aktivitet: Aktivitet;
}

export default function Arbeidsgiver({ aktivitet }: Props) {
    const { arbeidsgiver } = aktivitet;

    if (!arbeidsgiver) {
        return null;
    }

    return <Normaltekst>{arbeidsgiver}</Normaltekst>;
}
