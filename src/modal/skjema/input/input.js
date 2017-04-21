import React, { PropTypes as PT } from 'react';
import { Input as NavInput } from 'nav-frontend-skjema';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';

function InnerInputComponent({ input, labelId, errorMessage, ...rest }) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;
    const inputProps = { ...input, ...rest };
    return (
        <NavInput label={<FormattedMessage id={labelId} />} feil={feil} {...inputProps} />
    );
}

InnerInputComponent.propTypes = {
    labelId: PT.string.isRequired,
    bredde: PT.string,
    errorMessage: PT.arrayOf(PT.string),
    input: PT.object // eslint-disable-line react/forbid-prop-types
};

function Input({ feltNavn, ...rest }) {
    return (
        <CustomField
            name={feltNavn}
            errorClass="skjemaelement--harFeil"
            customComponent={<InnerInputComponent {...rest} />}
        />
    );
}

Input.propTypes = {
    feltNavn: PT.string.isRequired
};

export default Input;
