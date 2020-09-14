import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import * as AppPT from '../../../proptypes';

export default function Arbeidsgiver({ aktivitet }) {
    const { arbeidsgiver } = aktivitet;

    if (!arbeidsgiver) {
        return null;
    }

    return <Normaltekst>{arbeidsgiver}</Normaltekst>;
}

Arbeidsgiver.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};
