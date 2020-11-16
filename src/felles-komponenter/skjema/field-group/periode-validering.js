import moment from 'moment';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import PT from 'prop-types';
import React from 'react';

import { erGyldigISODato } from '../../../utils';

export function validerPeriode(fradato, tildato) {
    if (erGyldigISODato(fradato) && erGyldigISODato(tildato)) {
        const momentTilDato = moment(tildato).startOf('day');
        const momentFraDato = moment(fradato).startOf('day');
        return momentTilDato.isSameOrAfter(momentFraDato);
    }
    return true;
}

export function validerPeriodeFelt(fraDato, tilDato) {
    const isValidPeriode = !validerPeriode(fraDato, tilDato);
    return isValidPeriode ? 'Fra dato kan ikke være etter til dato' : null;
}

function PeriodeValidering(props) {
    const { valideringFelt, children } = props;

    return (
        <SkjemaGruppe feilmeldingId="periode-feil" id={valideringFelt.input.name} feil={valideringFelt.error}>
            {children}
        </SkjemaGruppe>
    );
}

PeriodeValidering.propTypes = {
    valideringFelt: PT.shape({
        name: PT.string,
        error: PT.string,
        input: PT.shape({
            name: PT.string,
        }).isRequired,
    }).isRequired,
    children: PT.node,
};

PeriodeValidering.defaultProps = {
    children: undefined,
};

export default PeriodeValidering;
