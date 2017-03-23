import React, { PropTypes as PT } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { LabelledField, validForm, rules } from 'react-redux-form-validation';

const pakrevd = () => rules.required.apply(this, arguments) && 'Dette er påkrevd';

function StillingAktivitetForm(props) {
    return (
        <div className="skjema-innlogget aktivitetskjema">
            <div className="aktivitetskjema__header">
                <Element tag="h1">
                    <FormattedMessage id="stilling-aktivitet-form.header" />
                </Element>
                <Undertekst>
                    <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                </Undertekst>
            </div>
            <form onSubmit={props.handleSubmit}>
                {props.errorSummary}
                <LabelledField name="tittel" type="text">
                    <FormattedMessage id="stilling-aktivitet-form.label.overskrift" />
                </LabelledField>


                <LabelledField name="lenke" type="text">
                    <FormattedMessage id="stilling-aktivitet-form.label.lenke" />
                </LabelledField>
                <LabelledField name="beskrivelse" type="text">
                    <FormattedMessage id="stilling-aktivitet-form.label.beskrivelse" />
                </LabelledField>
                <LabelledField name="arbeidssted" type="text">
                    <FormattedMessage id="stilling-aktivitet-form.label.arbeidssted" />
                </LabelledField>
                <LabelledField name="arbeidsgiver" type="text">
                    <FormattedMessage id="stilling-aktivitet-form.label.arbeidsgiver" />
                </LabelledField>
                <LabelledField name="kontaktperson" type="text">
                    <FormattedMessage id="stilling-aktivitet-form.label.kontaktperson" />
                </LabelledField>
            </form>
        </div>
    );
}

StillingAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired
};

const formNavn = 'stilling-aktivitet';
const StillingAktivitetReduxForm = validForm({
    form: formNavn,
    onSubmit: () => null,
    validate: {
        tittel: [pakrevd],
        fraDato: [pakrevd]
    }
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
