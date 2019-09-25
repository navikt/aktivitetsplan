import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import * as PT from '../../../proptypes';
import { formaterDatoKortManed, HiddenIf, dagerTil } from '../../../utils';

function Soknadfrist({ aktivitet }) {
    const { tilDato, etikett } = aktivitet;
    const getClassName = frist => (frist > 14 ? '' : 'aktivitetskort__frist');

    function getTekst(frist) {
        if (frist === 0) return 'Søknadsfristen går ut i dag';
        if (frist === 1) return 'Søknadsfristen går ut i morgen';
        if (frist > 14) return `Søknadsfrist: ${formaterDatoKortManed(tilDato)}`;
        if (frist < 0) return 'Søknadsfristen har gått ut';

        return `Søknadsfristen går ut om ${frist} dager`;
    }

    function getJsx() {
        const frist = dagerTil(tilDato);
        return <Normaltekst className={getClassName(frist)}>{getTekst(frist)}</Normaltekst>;
    }

    return <HiddenIf hidden={etikett || !tilDato}>{getJsx()}</HiddenIf>;
}

Soknadfrist.propTypes = {
    aktivitet: PT.aktivitet.isRequired
};

export default Soknadfrist;
