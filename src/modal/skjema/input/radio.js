import React, { PropTypes as PT } from 'react';
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { Field } from 'redux-form';

function Radio({ feltNavn, className, value, checked, ...resten }) {
    return (
        <Field
            name={feltNavn}
            className={className}
            type="radio"
            value={value}
            component={(props) =>
                <NavRadio
                    {...resten}
                    checked={checked}
                    value={value}
                    onChange={() => props.input.onChange(value)}
                />
            }
        />
    );
}

Radio.defaultProps = {
    className: ''
};

Radio.propTypes = {
    feltNavn: PT.string.isRequired,
    className: PT.string,
    value: PT.string.isRequired,
    checked: PT.bool.isRequired,
    input: PT.object // eslint-disable-line
};

export default Radio;
