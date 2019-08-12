/* eslint-disable no-unused-vars */
import React from 'react';
import PT from 'prop-types';
import { Textarea as NavTextArea } from 'nav-frontend-skjema';

function getTellerTekst(antallTegn, maxLength, visTellerFra) {
    const tegnIgjen = maxLength - antallTegn;
    const tegnForMange = antallTegn - maxLength;
    const tellerFra = visTellerFra || maxLength / 10;

    if (tegnForMange > 0) {
        return `Du har ${tegnForMange} tegn for mye`;
    }
    if (tegnIgjen <= tellerFra) {
        return `Du har ${tegnIgjen} tegn igjen`;
    }
    return null;
}

// pristine and initialValue isn't used, but we don't want to pass it to input
function Textarea({
    touched,
    error,
    input,
    pristine,
    initialValue,
    visTellerFra,
    ...rest
}) {
    const feil = error && touched ? { feilmelding: error } : undefined;
    const inputProps = { ...input, ...rest };

    return (
        <NavTextArea
            tellerTekst={(antallTegn, max) =>
                getTellerTekst(antallTegn, max, visTellerFra)}
            feil={feil}
            {...inputProps}
        />
    );
}

Textarea.propTypes = {
    initialValue: PT.string,
    pristine: PT.bool,
    touched: PT.bool.isRequired,
    error: PT.string,
    input: PT.object.isRequired,
    visTellerFra: PT.number,
    maxLength: PT.number.isRequired,
};

Textarea.defaultProps = {
    initialValue: undefined,
    pristine: undefined,
    error: undefined,
    visTellerFra: undefined,
};

export default Textarea;
