import React, { Component } from 'react';
import PT from 'prop-types';
import { change, touch } from 'redux-form';
import classNames from 'classnames';
import { CustomField } from 'react-redux-form-validation';
import { connect } from 'react-redux';
import moment from 'moment';
import { injectIntl, intlShape } from 'react-intl';

function isValidDate(dato) {
    return dato && moment(dato).isValid();
}

function validerPeriode(fradato, tildato) {
    if (isValidDate(fradato) && isValidDate(tildato)) {
        const momentTilDato = moment(tildato).startOf('day');
        const momentFraDato = moment(fradato).startOf('day');
        return momentTilDato.isSameOrAfter(momentFraDato);
    }
    return true;
}

class InnerInputComponent extends Component {
    componentWillReceiveProps(nextProps) {
        const { feltNavn, meta, dispatch, fraDato, tilDato } = this.props;
        const validNew = validerPeriode(nextProps.fraDato, nextProps.tilDato);
        const validOld = validerPeriode(fraDato, tilDato);

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
    fraDato: PT.object, // eslint-disable-line react/forbid-prop-types
    tilDato: PT.object, // eslint-disable-line react/forbid-prop-types
    feltNavn: PT.string.isRequired,
    dispatch: PT.func.isRequired,
    meta: PT.object, // eslint-disable-line react/forbid-prop-types
    input: PT.object, // eslint-disable-line react/forbid-prop-types
};

InnerInputComponent.defaultProps = {
    errorMessage: null,
    fraDato: undefined,
    tilDato: undefined,
    meta: undefined,
    input: undefined,
};

function PeriodeValidering(props) {
    const {
        fraDato,
        tilDato,
        feltNavn,
        errorMessageId,
        children,
        intl,
    } = props;

    const valid = validerPeriode(fraDato, tilDato);

    function errorMessage() {
        return intl.formatMessage({
            id: errorMessageId,
        });
    }

    return (
        <div
            className={classNames({
                skjema__periodevalidering: true,
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
                            fraDato={fraDato}
                            tilDato={tilDato}
                        />
                    }
                    validate={() => (valid ? undefined : errorMessage())} // eslint-disable-line no-confusing-arrow
                />
            </div>
        </div>
    );
}

PeriodeValidering.propTypes = {
    feltNavn: PT.string.isRequired,
    fraDato: PT.object, // eslint-disable-line react/forbid-prop-types
    tilDato: PT.object, // eslint-disable-line react/forbid-prop-types
    errorMessageId: PT.string.isRequired,
    intl: intlShape.isRequired,
    children: PT.node,
};

PeriodeValidering.defaultProps = {
    fraDato: undefined,
    tilDato: undefined,
    children: undefined,
};

export const PeriodeValideringPure = PeriodeValidering;

export default injectIntl(PeriodeValideringPure);
