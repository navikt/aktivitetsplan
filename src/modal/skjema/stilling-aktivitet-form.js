import React, { PropTypes as PT } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import { LabelledField, CustomField, validForm } from 'react-redux-form-validation';
import Datovelger from './datovelger/datovelger';
import Textarea from './textarea';
import './skjema.less';


const fraDatoComponent = () => (
    <Datovelger
        disabled
        label={<FormattedMessage id="stilling-aktivitet-form.fra-dato" />}
        skjemanavn="stilling-aktivitet"
    />
);
const tilDatoComponent = () => (
    <Datovelger
        label={<FormattedMessage id="stilling-aktivitet-form.til-dato" />}
        skjemanavn="stilling-aktivitet"
    />
);

function minLength(min, error = 'min-length') {
    return (value) => (value && value.length >= min ? undefined : error);
}

const pakrevdTittel = minLength(0, 'Du må fylle ut overskriften');
const pakrevdFraDato = minLength(0, 'Du må fylle ut fra datoen');
const pakrevdTilDato = minLength(0, 'Du må fylle ut fristen');

function StillingAktivitetForm(props) {
    return (
        <form onSubmit={props.handleSubmit} className="skjema-innlogget aktivitetskjema">
            {props.errorSummary}
            <div className="aktivitetskjema__header">
                <Innholdstittel>
                    <FormattedMessage id="stilling-aktivitet-form.header" />
                </Innholdstittel>
                <Undertekst>
                    <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                </Undertekst>
            </div>

            <LabelledField
                name="tittel"
                type="text"
                className="skjema__input aktivitetskjema__tekstfelt"
                inputClass="input--fullbredde"
                labelClass="skjema__label"
            >
                <FormattedMessage id="stilling-aktivitet-form.label.overskrift" />
            </LabelledField>
            <div className="dato-container">
                <CustomField name="fraDato" customComponent={fraDatoComponent()} />
                <CustomField name="tilDato" customComponent={tilDatoComponent()} />
            </div>
            <LabelledField
                name="lenke"
                type="text"
                className="skjema__input aktivitetskjema__tekstfelt"
                inputClass="input--fullbredde"
                labelClass="skjema__label"
            >
                <FormattedMessage id="stilling-aktivitet-form.label.lenke" />
            </LabelledField>
            <CustomField
                name="beskrivelse"
                customComponent={
                    <Textarea
                        id="besrkivelse-textarea"
                        className="skjema__input input--fullbredde aktivitetskjema__tekstomrade"
                        label={<FormattedMessage id="stilling-aktivitet-form.label.beskrivelse" />}
                    />}
            />
            <LabelledField
                name="arbeidssted"
                type="text"
                className="skjema__input aktivitetskjema__tekstfelt"
                inputClass="input--fullbredde"
                labelClass="skjema__label"
            >
                <FormattedMessage id="stilling-aktivitet-form.label.arbeidssted" />
            </LabelledField>
            <LabelledField
                name="arbeidsgiver"
                type="text"
                className="skjema__input aktivitetskjema__tekstfelt"
                inputClass="input--fullbredde"
                labelClass="skjema__label"
            >
                <FormattedMessage id="stilling-aktivitet-form.label.arbeidsgiver" />
            </LabelledField>
            <LabelledField
                name="kontaktperson"
                type="text"
                className="skjema__input aktivitetskjema__tekstfelt"
                inputClass="input--fullbredde"
                labelClass="skjema__label"
            >
                <FormattedMessage id="stilling-aktivitet-form.label.kontaktperson" />
            </LabelledField>
        </form>
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
        tittel: [pakrevdTittel],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato]
    }
})(StillingAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: 'PLANLAGT',
            fraDato: moment().format('DD.MM.YYYY'), // eslint-disable-line no-undef
            ...aktivitet
        },
        etikett: selector(state, 'etikett')
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StillingAktivitetReduxForm);
