import React, { PropTypes as PT } from 'react';
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { Field } from 'redux-form';

function Radio({ feltNavn, className, value, checked, onChange, ...resten }) {
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
                    onChange={(e) => {
                        props.input.onChange(value);
                        onChange(e);
                    }}
                />
            }
        />
    );
}

Radio.defaultProps = {
    className: '',
    onChange: () => {}
};

Radio.propTypes = {
    feltNavn: PT.string.isRequired,
    className: PT.string,
    value: PT.string.isRequired,
    checked: PT.bool.isRequired,
    input: PT.object, // eslint-disable-line
    onChange: PT.func
};

export default Radio;
