/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PT from 'prop-types';
import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';

// pristine isn't used, but we don't want to pass it to input
function Checkbox({ touched, error, input, pristine, initialValue, ...rest }) {
    const inputProps = { ...input, ...rest };
    const [toggel, setToggel] = useState(initialValue === 'true');

    const toggelOnChange = event => {
        const newValue = toggel ? 'false' : 'true';
        const customEvent = {
            target: { name: event.target.name, value: newValue },
        };
        input.onChange(customEvent);
        setToggel(!toggel);
    };

    const feil = error && touched ? { feilmelding: error } : undefined;
    return (
        <NavCheckbox
            {...inputProps}
            checked={input.value === 'true'}
            feil={feil}
            onChange={toggelOnChange}
        />
    );
}

Checkbox.propTypes = {
    initialValue: PT.string,
    pristine: PT.bool,
    touched: PT.bool.isRequired,
    error: PT.string,
    input: PT.object.isRequired,
};

Checkbox.defaultProps = {
    initialValue: undefined,
    pristine: undefined,
    error: undefined,
};

export default Checkbox;
