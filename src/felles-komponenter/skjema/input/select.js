import React from 'react';
import PT from 'prop-types';
import { Select as NavSelect } from 'nav-frontend-skjema';
import { CustomField } from 'react-redux-form-validation';
import { FormattedMessage } from 'react-intl';

function InnerInputComponent({
    input,
    labelId,
    children,
    errorMessage,
    meta, // eslint-disable-line no-unused-vars
    ...rest
}) {
    const feil = errorMessage ? { feilmelding: errorMessage[0] } : undefined;
    const inputProps = {
        ...input,
        ...rest,
    };
    return (
        <NavSelect
            label={<FormattedMessage id={labelId} />}
            feil={feil}
            {...inputProps}
        >
            <option />
            {children}
        </NavSelect>
    );
}

InnerInputComponent.defaultProps = {
    input: undefined,
    errorMessage: undefined,
    meta: undefined,
};

InnerInputComponent.propTypes = {
    labelId: PT.string.isRequired,
    children: PT.node.isRequired,
    input: PT.object, // eslint-disable-line react/forbid-prop-types
    errorMessage: PT.object, // eslint-disable-line react/forbid-prop-types
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
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
