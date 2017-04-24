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
            component={props =>
                <NavRadio
                    {...resten}
                    checked={checked}
                    value={value}
                    onChange={e => props.input.onChange(value) }
                />
            }
        />
    );
}

Radio.propTypes = {
    feltNavn: PT.string.isRequired,
    className: PT.string
};

export default Radio;
