import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import * as PT from '../../../proptypes';
import { formaterDatoKortManed, dagerTil } from '../../../utils';

function getClassName(frist) {
    if (frist < 0) return 'aktivitetskort__frist__utgaat';
    if (frist < 14) return 'aktivitetskort__frist';

    return ''
}

function getTekst(frist, tilDato) {
    if (frist === 0) return 'Søknadsfristen går ut i dag';
    if (frist === 1) return 'Søknadsfristen går ut i morgen';
    if (frist > 14) return `Søknadsfrist: ${formaterDatoKortManed(tilDato)}`;
    if (frist < 0) return 'Søknadsfristen har gått ut';

    return `Søknadsfristen går ut om ${frist} dager`;
}

function Soknadfrist({ aktivitet }) {
    const { tilDato, etikett } = aktivitet;

    if (etikett || !tilDato){
        return null;
    }

    const frist = dagerTil(tilDato);
    return <Normaltekst className={getClassName(frist)}>{getTekst(frist, tilDato)}</Normaltekst>;
}

Soknadfrist.propTypes = {
    aktivitet: PT.aktivitet.isRequired
};

export default Soknadfrist;
