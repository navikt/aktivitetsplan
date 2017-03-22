import React, { Component, PropTypes as PT } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import DateField from '../../felles-komponenter/date-field';

// Skriv om til stateless når ting har stabiliert seg litt mer
// eslint-disable-next-line react/prefer-stateless-function
class StillingAktivitetForm extends Component {
// TODO: Flytt aktivitetskjema__header til eget komponent
    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit} className="skjema-innlogget aktivitetskjema">
                <div className="aktivitetskjema__header">
                    <Element tag="h1">
                        <FormattedMessage id="stilling-aktivitet-form.header" />
                    </Element>
                    <Undertekst>
                        <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                    </Undertekst>
                </div>
                <div className="nav-input">
                    <label htmlFor="stilling-aktivitet-tittel">
                        <FormattedMessage id="stilling-aktivitet-form.label.overskrift" />
                    </label>
                    <Field
                        name="tittel" type="text"
                        className="input-fullbredde aktivitetskjema__tekstfelt"
                        component="input"
                        required
                        autoFocus
                        id="stilling-aktivitet-tittel"
                    />
                </div>
                <div className="felt-vannrett aktivitetskjema__datofelt-wrapper">
                    <div className="nav-input">
                        <DateField name="fraDato" label="fra dato" className="aktivitetskjema__datofelt" disabled />
                    </div>
                    <div className="nav-input">
                        <DateField name="tilDato" label="til dato" className="aktivitetskjema__datofelt" required />
                    </div>
                </div>
                <div className="nav-input">
                    <label htmlFor="stilling-aktivitet-lenke">
                        <FormattedMessage id="stilling-aktivitet-form.label.lenke" />
                    </label>
                    <Field
                        name="lenke"
                        className="input-fullbredde aktivitetskjema__tekstfelt"
                        type="text"
                        component="input"
                        id="stilling-aktivitet-lenke"
                    />
                </div>
                <div className="nav-input">
                    <label htmlFor="stilling-aktivitet-beskrivelse">
                        <FormattedMessage id="stilling-aktivitet-form.label.beskrivelse" />
                    </label>
                    <Field
                        name="beskrivelse"
                        className="input-fullbredde aktivitetskjema__tekstomrade"
                        type="text"
                        component="textarea"
                        id="stilling-aktivitet-beskrivelse"
                    />
                </div>
                <div className="nav-input">
                    <label htmlFor="stilling-aktivitet-arbeidssted">
                        <FormattedMessage id="stilling-aktivitet-form.label.arbeidssted" />
                    </label>
                    <Field
                        name="arbeidssted"
                        className="input-fullbredde aktivitetskjema__tekstfelt"
                        type="text"
                        component="input"
                        id="stilling-aktivitet-arbeidssted"
                    />
                </div>
                <div className="nav-input">
                    <label htmlFor="stilling-aktivitet-arbeidsgiver">
                        <FormattedMessage id="stilling-aktivitet-form.label.arbeidsgiver" />
                    </label>
                    <Field
                        name="arbeidsgiver"
                        className="input-fullbredde aktivitetskjema__tekstfelt"
                        type="text"
                        component="input"
                        id="stilling-aktivitet-arbeidsgiver"
                    />
                </div>
                <div className="nav-input">
                    <label htmlFor="stilling-aktivitet-kontaktperson">
                        <FormattedMessage id="stilling-aktivitet-form.label.kontaktperson" />
                    </label>
                    <Field
                        name="kontaktperson"
                        className="input-fullbredde aktivitetskjema__tekstfelt"
                        type="text"
                        component="input"
                        id="stilling-aktivitet-kontaktperson"
                    />
                </div>
            </form>
        );
    }
}

StillingAktivitetForm.propTypes = {
    // fra redux-form
    handleSubmit: PT.func.isRequired,
    change: PT.func.isRequired // eslint-disable-line react/no-unused-prop-types
};

const formNavn = 'stilling-aktivitet';
const StillingAktivitetReduxForm = reduxForm({
    form: formNavn,
    onSubmit: () => null
})(StillingAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: 'PLANLAGT',
            fraDato: moment().format(), // eslint-disable-line no-undef
            ...aktivitet
        },
        etikett: selector(state, 'etikett')
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StillingAktivitetReduxForm);
