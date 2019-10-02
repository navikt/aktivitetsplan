import React from 'react';
import PT from 'prop-types';
import { erGyldigISODato, moment } from '../../../utils';
import FieldGroup from './fieldgroups-validering';

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

    const field = {
        touched: !!valideringFelt.error,
        error: valideringFelt.error
    };

    return (
        <FieldGroup name={valideringFelt.input.name} field={field}>
            {children}
        </FieldGroup>
    );
}

PeriodeValidering.propTypes = {
    valideringFelt: PT.shape({
        name: PT.string,
        error: PT.string,
        input: PT.shape({
            name: PT.string
        }).isRequired
    }).isRequired,
    children: PT.node
};

PeriodeValidering.defaultProps = {
    children: undefined
};

export default PeriodeValidering;
