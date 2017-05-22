import React from 'react';
import PT from 'prop-types';
import { Input as NavInput } from 'nav-frontend-skjema';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line no-unused-vars
function InnerInputComponent({ input, labelId, errorMessage, meta, ...rest }) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;
    const inputProps = { ...input, ...rest };
    return (
        <NavInput label={<FormattedMessage id={labelId} />} feil={feil} {...inputProps} />
    );
}

InnerInputComponent.propTypes = {
    labelId: PT.string.isRequired,
    bredde: PT.string,
    errorMessage: PT.arrayOf(PT.node),
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
    input: PT.object // eslint-disable-line react/forbid-prop-types
};

InnerInputComponent.defaultProps = {
    bredde: undefined,
    errorMessage: undefined,
    meta: undefined,
    input: undefined
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
