import React from 'react';
import PT from 'prop-types';
import { submit } from 'redux-form';
import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';

function InnerCheckboxComponent({
    input,
    meta,
    labelId,
    errorMessage,
    submitOnChange,
}) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;

    function onChange(...args) {
        if (submitOnChange) {
            setTimeout(() => meta.dispatch(submit(meta.form)), 0);
        }
        return input.onChange && input.onChange.apply(this, args);
    }

    return (
        <NavCheckbox
            label={<FormattedMessage id={labelId} />}
            feil={feil}
            checked={input.value}
            {...input}
            onChange={onChange}
        />
    );
}

InnerCheckboxComponent.propTypes = {
    labelId: PT.string.isRequired,
    errorMessage: PT.arrayOf(
        PT.oneOfType([PT.string, PT.instanceOf(FormattedMessage)])
    ),
    submitOnChange: PT.bool,

    input: PT.object, // eslint-disable-line react/forbid-prop-types
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
};

InnerCheckboxComponent.defaultProps = {
    errorMessage: undefined,
    submitOnChange: false,

    // Vil alltid bli overskrevet av CustomField
    input: {},
    meta: {},
};

function Checkbox({ feltNavn, className, ...rest }) {
    return (
        <CustomField
            name={feltNavn}
            className={className}
            errorClass="skjemaelement--harFeil"
            customComponent={<InnerCheckboxComponent {...rest} />}
        />
    );
}

Checkbox.propTypes = {
    feltNavn: PT.string.isRequired,
    className: PT.string,
};

Checkbox.defaultProps = {
    className: undefined,
};

export default Checkbox;
