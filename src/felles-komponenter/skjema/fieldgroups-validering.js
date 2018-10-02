import React, { Component } from 'react';
import PT from 'prop-types';
import { change, touch } from 'redux-form';
import classNames from 'classnames';
import { CustomField } from 'react-redux-form-validation';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

class InnerInputComponent extends Component {
    componentWillReceiveProps(newProps) {
        // this validate the field, and show the red text at the bottom
        const { feltNavn, meta, dispatch, validate } = this.props;
        const validOld = validate();
        const validNew = newProps.validate();

        if (validNew !== validOld) {
            dispatch(touch(meta.form, feltNavn));
            dispatch(change(meta.form, feltNavn, validNew));
        }
    }

    render() {
        const { input, errorMessage } = this.props;
        return (
            <div>
                <input type="hidden" {...input} />
                <div
                    role="alert"
                    aria-live="assertive"
                    aria-relevant="all"
                    className="skjemaelement__feilmelding"
                >
                    <span>
                        {errorMessage}
                    </span>
                </div>
            </div>
        );
    }
}

const ConnectedInputComponent = connect()(InnerInputComponent);

InnerInputComponent.propTypes = {
    errorMessage: PT.string,
    feltNavn: PT.string.isRequired,
    dispatch: PT.func.isRequired,
    validate: PT.func.isRequired,
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
    input: PT.object, // eslint-disable-line react/forbid-prop-types
};

InnerInputComponent.defaultProps = {
    errorMessage: null,
    meta: undefined,
    input: undefined,
};

function FieldGroupsValidering(props) {
    const { feltNavn, errorMessageId, validate, children, intl } = props;

    const valid = validate();

    function errorMessage() {
        return intl.formatMessage({
            id: errorMessageId,
        });
    }

    return (
        <div
            className={classNames({
                'skjema--harFeil': !valid,
            })}
        >
            <div
                className={classNames({ skjema__feilomrade: !valid })}
                id={feltNavn}
                tabIndex={valid ? undefined : -1}
            >
                {children}

                <CustomField
                    name={feltNavn}
                    customComponent={
                        <ConnectedInputComponent
                            feltNavn={feltNavn}
                            validate={validate}
                        />
                    }
                    validate={() => (valid ? undefined : errorMessage())} // eslint-disable-line no-confusing-arrow
                />
            </div>
        </div>
    );
}

FieldGroupsValidering.propTypes = {
    feltNavn: PT.string.isRequired,
    errorMessageId: PT.string.isRequired,
    intl: intlShape.isRequired,
    validate: PT.func.isRequired,
    children: PT.node,
};

FieldGroupsValidering.defaultProps = {
    children: undefined,
};

export const FieldGroupsValideringPure = FieldGroupsValidering;

export default injectIntl(FieldGroupsValideringPure);
