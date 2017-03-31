import React, { PropTypes as PT } from 'react';
import { Input as NavInput } from 'nav-frontend-skjema';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';

function InnerInputComponent({ input, labelId, bredde }) {
    return (
        <NavInput label={<FormattedMessage id={labelId} />} bredde={bredde} {...input} />
    );
}

InnerInputComponent.propTypes = {
    labelId: PT.string.isRequired,
    bredde: PT.string,
    input: PT.object // eslint-disable-line react/forbid-prop-types
};

function Input({ feltNavn, ...rest }) {
    return (
        <CustomField name={feltNavn} customComponent={<InnerInputComponent {...rest} />} />
    );
}

Input.propTypes = {
    feltNavn: PT.string.isRequired
};

export default Input;
