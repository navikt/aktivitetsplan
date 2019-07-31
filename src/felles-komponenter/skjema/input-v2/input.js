/* eslint-disable no-unused-vars */
import React from 'react';
import PT from 'prop-types';
import { Input as NavInput } from 'nav-frontend-skjema';

// pristine and initialValue isn't used, but we don't want to pass it to input
function Input({ touched, error, input, pristine, initialValue, ...rest }) {
    const feil = error && touched ? { feilmelding: error } : undefined;
    const inputProps = { ...input, ...rest };
    return <NavInput feil={feil} {...inputProps} />;
}

Input.propTypes = {
    initialValue: PT.string,
    pristine: PT.bool,
    touched: PT.bool.isRequired,
    error: PT.string,
    input: PT.object.isRequired,
};

Input.defaultProps = {
    initialValue: undefined,
    pristine: undefined,
    error: undefined,
};

export default Input;
