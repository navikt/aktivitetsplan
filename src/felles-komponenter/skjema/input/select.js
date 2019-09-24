/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import PT from 'prop-types';
import { Select as NavSelect } from 'nav-frontend-skjema';

// pristine and initialValue isn't used, but we don't want to pass it to input
function Select({ touched, error, input, pristine, initialValue, noBlankOption, children, ...rest }) {
    const feil = error && touched ? { feilmelding: error } : undefined;
    const inputProps = { ...input, ...rest };

    return (
        <NavSelect feil={feil} {...inputProps}>
            {!noBlankOption && <option />}
            {children}
        </NavSelect>
    );
}

Select.defaultProps = {
    initialValue: undefined,
    pristine: undefined,
    error: undefined,
    noBlankOption: false
};

Select.propTypes = {
    initialValue: PT.string,
    pristine: PT.bool,
    noBlankOption: PT.bool,
    children: PT.node.isRequired,
    touched: PT.bool.isRequired,
    error: PT.string,
    input: PT.object.isRequired
};

export default Select;
