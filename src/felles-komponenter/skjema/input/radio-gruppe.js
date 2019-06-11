/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { CustomField } from 'react-redux-form-validation';

function InnerInputComponent({ labelId, feltNavn, children, errorMessage }) {
    return (
        <div className={classNames({ 'skjema--harFeil': errorMessage })}>
            <div className={classNames({ skjema__feilomrade: errorMessage })}>
                <label className="skjemaelement__label" htmlFor={feltNavn}>
                    <FormattedMessage id={labelId} />
                </label>
                {children}
                <div
                    role="alert"
                    aria-live="assertive"
                    className="skjemaelement__feilmelding"
                >
                    {errorMessage}
                </div>
            </div>
        </div>
    );
}

InnerInputComponent.propTypes = {
    labelId: PT.string.isRequired,
    feltNavn: PT.string.isRequired,
    children: PT.node,
    errorMessage: PT.string,
};

InnerInputComponent.defaultProps = {
    children: undefined,
    errorMessage: null,
};

function RadioGruppe({ feltNavn, labelId, children }) {
    return (
        <CustomField
            name={feltNavn}
            customComponent={
                <InnerInputComponent labelId={labelId} feltNavn={feltNavn}>
                    {children}
                </InnerInputComponent>
            }
        />
    );
}

RadioGruppe.propTypes = {
    feltNavn: PT.string.isRequired,
    labelId: PT.string.isRequired,
    children: PT.node,
};

RadioGruppe.defaultProps = {
    children: undefined,
};

export default RadioGruppe;
