/* eslint-disable no-unused-vars */
import React from 'react';
import PT from 'prop-types';
import { Radio as NavRadio } from 'nav-frontend-skjema';

// pristine and initialValue isn't used, but we don't want to pass it to input
function Radio({
    value,
    touched,
    error,
    input,
    pristine,
    initialValue,
    ...rest
}) {
    const inputProps = { ...input, ...rest };
    return (
        <NavRadio
            {...inputProps}
            value={value}
            checked={value === input.value}
            id={`id--${value}`}
        />
    );
}

Radio.propTypes = {
    initialValue: PT.string,
    value: PT.string.isRequired,
    pristine: PT.bool,
    touched: PT.bool.isRequired,
    error: PT.string,
    input: PT.object.isRequired,
};

Radio.defaultProps = {
    initialValue: undefined,
    pristine: undefined,
    error: undefined,
};

export default Radio;
