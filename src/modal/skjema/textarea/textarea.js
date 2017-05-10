import React from 'react';
import PT from 'prop-types'
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';
import { Textarea as NavFrontendTextarea } from 'nav-frontend-skjema';

function getTellerTekst(antallTegn, maxLength, visTellerFra) {
    const tegnIgjen = maxLength - antallTegn;
    const tegnForMange = antallTegn - maxLength;

    if (tegnForMange > 0) {
        return <FormattedMessage id="tekstfelt.antalltegn.for-mange" values={{ antall: `${tegnForMange}` }} />;
    } else if (visTellerFra === 0 || visTellerFra >= tegnIgjen) {
        return <FormattedMessage id="tekstfelt.antalltegn.flere-igjen" values={{ antall: `${tegnIgjen}` }} />;
    }
    return <span>&nbsp;</span>;
}

// eslint-disable-next-line no-unused-vars
function InnerTextAreaComponent({ input, labelId, maxLength, errorMessage, visTellerFra, meta, ...rest }) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;
    const inputValues = { ...input, value: undefined, defaultValue: input.value };
    return (
        <NavFrontendTextarea
            textareaClass="skjemaelement__input input--fullbredde"
            label={labelId && <FormattedMessage id={labelId} />}
            maxLength={maxLength}
            feil={feil}
            tellerTekst={(antallTegn) => getTellerTekst(antallTegn, maxLength, visTellerFra)}
            {...rest}
            {...inputValues}
        />
    );
}
InnerTextAreaComponent.propTypes = {
    labelId: PT.string.isRequired,
    maxLength: PT.number.isRequired,
    errorMessage: PT.arrayOf(PT.oneOfType([PT.string, PT.node])),
    visTellerFra: PT.number,
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
    input: PT.object // eslint-disable-line react/forbid-prop-types
};

InnerTextAreaComponent.defaultProps = {
    errorMessage: undefined,
    meta: undefined,
    input: undefined,
    visTellerFra: undefined
};

function Textarea({ feltNavn, ...rest }) {
    return (
        <CustomField
            name={feltNavn}
            customComponent={<InnerTextAreaComponent {...rest} />}
        />
    );
}

Textarea.propTypes = {
    feltNavn: PT.string,
    visTellerFra: PT.number
};

Textarea.defaultProps = {
    feltNavn: undefined,
    visTellerFra: 0
};

export default Textarea;

