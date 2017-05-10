import React from 'react';
import PT from 'prop-types'
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { Field } from 'redux-form';

function Radio({ feltNavn, className, value, checked, onChange, ...props }) {
    return (
        <Field
            name={feltNavn}
            className={className}
            type="radio"
            value={value}
            component={(compProp) =>
                <NavRadio
                    {...props}
                    checked={checked}
                    value={value}
                    onChange={(e) => {
                        compProp.input.onChange(value);
                        onChange(e);
                    }}
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
    input: PT.object, // eslint-disable-line
    onChange: PT.func.isRequired
};

export default Radio;
