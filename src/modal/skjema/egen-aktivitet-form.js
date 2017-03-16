import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-react-design/dist/typografi';
import DateField from '../../felles-komponenter/date-field';

const validerTittel = (value) => {
    if (value !== '') {
        return undefined;
    }
    return 'Fyll inn tittel';
};
function EgenAktivitetForm({ handleSubmit }) {
    return (
        <form onSubmit={handleSubmit} className="skjema-innlogget aktivitetskjema">
            <div className="aktivitetskjema__header">
                <Element tag="h1">
                    <FormattedMessage id="egen-aktivitet-form.header" />
                </Element>
                <Undertekst>
                    <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                </Undertekst>
            </div>
            <div className="nav-input">
                <label htmlFor="egen-aktivitet-overskrift">
                    <FormattedMessage id="egen-aktivitet-form.label.overskrift" />
                </label>
                <Field
                    name="tittel"
                    type="text"
                    className="input-fullbredde aktivitetskjema__tekstfelt"
                    id="egent-aktivitet-overskrift"
                    component="input"
                    required
                    autoFocus
                    validate={validerTittel}
                />
            </div>
            <div className="felt-vannrett aktivitetskjema__datofelt-wrapper">
                <div className="nav-input">
                    <DateField name="fraDato" label="fra dato" className="aktivitetskjema__datofelt" />
                </div>
                <div className="nav-input">
                    <DateField name="tilDato" label="til dato" className="aktivitetskjema__datofelt" />
                </div>
            </div>
            <div className="nav-input">
                <label htmlFor="egen-aktivitet-lenke">
                    <FormattedMessage id="egen-aktivitet-form.label.lenke" />
                </label>
                <Field
                    name="lenke" className="input-fullbredde aktivitetskjema__tekstfelt" type="text"
                    component="input" id="egen-aktivitet-lenke"
                />
            </div>
            <div className="nav-input">
                <label htmlFor="egen-aktivitet-hensikt">
                    <FormattedMessage id="egen-aktivitet-form.label.hensikt" />
                </label>
                <Field
                    name="hensikt" className="input-fullbredde aktivitetskjema__tekstfelt" type="text"
                    component="input" id="egen-aktivitet-hensikt"
                />
            </div>
            <div className="nav-input">
                <label htmlFor="egen-aktivitet-beskrivelse">
                    <FormattedMessage id="egen-aktivitet-form.label.beskrivelse" />
                </label>
                <Field
                    name="beskrivelse" className="input-fullbredde aktivitetskjema__tekstomrade" type="text"
                    component="textarea" id="egen-aktivitet-beskrivelse"
                />
            </div>
        </form>
    );
}

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func
};

const EgenAktivitetReduxForm = reduxForm({
    form: 'egen-aktivitet',
    onSubmit: () => null
})(EgenAktivitetForm);

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: 'PLANLAGT',
            ...aktivitet
        }
    };
};
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EgenAktivitetReduxForm);
