/* eslint-disable prefer-rest-params */
import React from 'react';
import PT from 'prop-types';
import { Select as NavSelect } from 'nav-frontend-skjema';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';

function InnerInputComponent({
    input,
    labelId,
    children,
    noBlankOption,
    blankOptionParameters,
    errorMessage,
    meta, // eslint-disable-line no-unused-vars
    ...rest
}) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;
    const inputProps = {
        ...input,
        ...rest,
        onChange() {
            if (rest.onChange) {
                rest.onChange.apply(this, arguments);
            }
            return input.onChange.apply(this, arguments);
        },
    };

    return (
        <NavSelect
            label={<FormattedMessage id={labelId} />}
            feil={feil}
            {...inputProps}
        >
            {!noBlankOption && <option {...blankOptionParameters} />}
            {children}
        </NavSelect>
    );
}

InnerInputComponent.defaultProps = {
    input: undefined,
    errorMessage: undefined,
    meta: undefined,
    noBlankOption: false,
    blankOptionParameters: {},
};

InnerInputComponent.propTypes = {
    labelId: PT.string.isRequired,
    children: PT.node.isRequired,
    input: PT.object, // eslint-disable-line react/forbid-prop-types
    errorMessage: PT.arrayOf(
        PT.oneOfType([PT.string, PT.instanceOf(FormattedMessage)])
    ),
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
    noBlankOption: PT.bool,
    blankOptionParameters: PT.object,
};

function Select({ id, feltNavn, className, ...rest }) {
    return (
        <CustomField
            name={feltNavn}
            errorClass="skjemaelement--harFeil"
            className={className}
            id={id}
            customComponent={<InnerInputComponent {...rest} />}
        />
    );
}

Select.defaultProps = {
    className: '',
    id: undefined,
};

Select.propTypes = {
    feltNavn: PT.string.isRequired,
    id: PT.string,
    className: PT.string,
};

export default Select;
