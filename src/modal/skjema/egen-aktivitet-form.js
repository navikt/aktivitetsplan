import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import { LabelledField, CustomField, validForm } from 'react-redux-form-validation';
import Datovelger from './datovelger/datovelger';
import Textarea from './textarea';
import './skjema.less';

const fraDatoComponent = () => (
    <Datovelger
        disabled
        label={<FormattedMessage id="egen-aktivitet-form.fra-dato" />}
        skjemanavn="egen-aktivitet"
    />
);
const tilDatoComponent = () => (
    <Datovelger
        label={<FormattedMessage id="egen-aktivitet-form.til-dato" />}
        skjemanavn="egen-aktivitet"
    />
);

function minLength(min, error = 'min-length') {
    return (value) => (value && value.length >= min ? undefined : error);
}

const pakrevdTittel = minLength(0, 'Du må fylle ut overskriften');
const pakrevdFraDato = minLength(0, 'Du må fylle ut fra datoen');
const pakrevdTilDato = minLength(0, 'Du må fylle ut fristen');

function EgenAktivitetForm(props) {
    return (
        <form className="aktivitetskjema" onSubmit={props.handleSubmit} noValidate="noValidate">
            {props.errorSummary}
            <div className="aktivitetskjema__header">
                <Innholdstittel>
                    <FormattedMessage id="egen-aktivitet-form.header" />
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
            ><FormattedMessage id="egen-aktivitet-form.label.overskrift" /></LabelledField>
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
            ><FormattedMessage id="egen-aktivitet-form.label.lenke" /></LabelledField>
            <LabelledField
                name="hensikt"
                type="text"
                className="skjema__input aktivitetskjema__tekstfelt"
                inputClass="input--fullbredde"
                labelClass="skjema__label"
            ><FormattedMessage id="egen-aktivitet-form.label.hensikt" /></LabelledField>
            <CustomField
                name="beskrivelse"
                customComponent={
                    <Textarea
                        id="besrkivelse-textarea"
                        className="skjema__input input--fullbredde aktivitetskjema__tekstomrade"
                        label={<FormattedMessage id="egen-aktivitet-form.label.beskrivelse" />}
                    />}
            />
        </form>
    );
}

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired
};

const EgenAktivitetReduxForm = validForm({
    form: 'egen-aktivitet',
    onSubmit: () => {
    },
    validate: {
        tittel: [pakrevdTittel],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato]
    }
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
