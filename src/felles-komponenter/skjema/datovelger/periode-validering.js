import React from 'react';
import PT from 'prop-types';
import { moment } from './../../../utils';
import FieldGroupsValidering from '../fieldgroups-validering';

function isValidDate(dato) {
    return dato && moment(dato).isValid();
}

function validerPeriode(fradato, tildato) {
    if (isValidDate(fradato) && isValidDate(tildato)) {
        const momentTilDato = moment(tildato).startOf('day');
        const momentFraDato = moment(fradato).startOf('day');
        return momentTilDato.isSameOrAfter(momentFraDato);
    }
    return true;
}

function PeriodeValidering(props) {
    const { fraDato, tilDato, feltNavn, errorMessageId, children } = props;

    return (
        <FieldGroupsValidering
            feltNavn={feltNavn}
            children={children} // eslint-disable-line react/no-children-prop
            errorMessageId={errorMessageId}
            validate={() => validerPeriode(fraDato, tilDato)}
        />
    );
}

PeriodeValidering.propTypes = {
    feltNavn: PT.string.isRequired,
    fraDato: PT.object, // eslint-disable-line react/forbid-prop-types
    tilDato: PT.object, // eslint-disable-line react/forbid-prop-types
    errorMessageId: PT.string.isRequired,
    children: PT.node,
};

PeriodeValidering.defaultProps = {
    fraDato: undefined,
    tilDato: undefined,
    children: undefined,
};

export default PeriodeValidering;
