import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import Textarea from 'nav-frontend-skjema/src/textarea';
import { LabelledField, CustomField, validForm, rules } from 'react-redux-form-validation';
import DatoFelt from './datovelger/dato-felt';
import './skjema.less';

// TODO Feil i rules, rettet i PR, overskriver imens. Bytt når ny versjon av react-redux-form-validation er klar
export function maxLength(max, error = 'max-length') {
    return (value) => (value && value.length > max ? error : undefined);
}

const TITTEL_MAKS_LENGDE = 255;
const HENSIKT_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;

const pakrevdTittel = rules.minLength(0, 'Du må fylle ut overskriften');
const begrensetTittelLengde =
    maxLength(TITTEL_MAKS_LENGDE, `Overskriften kan ikke være lenger en ${TITTEL_MAKS_LENGDE} tegn`);
const pakrevdFraDato = rules.minLength(0, 'Du må fylle ut fra datoen');
const pakrevdTilDato = rules.minLength(0, 'Du må fylle ut fristen');
const begrensetHensiktLengde =
    maxLength(HENSIKT_MAKS_LENGDE, `Hensiktteksten kan ikke være lenger en ${HENSIKT_MAKS_LENGDE} tegn`);
const begrensetLenkeLengde =
    maxLength(LENKE_MAKS_LENGDE, `Lenken kan ikke være lenger en ${LENKE_MAKS_LENGDE} tegn`);
const begrensetBeskrivelseLengde =
    maxLength(BESKRIVELSE_MAKS_LENGDE, `Beskrivelsen kan ikke være lenger en ${BESKRIVELSE_MAKS_LENGDE} tegn`);


function EgenAktivitetForm(props) {
    return (
        <form onSubmit={props.handleSubmit} noValidate="noValidate" className="skjema-innlogget aktivitetskjema">
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
                className="skjemaelement"
                inputClass="skjemaelement__input input--fullbredde"
                labelClass="skjemaelement__label"
            ><FormattedMessage id="egen-aktivitet-form.label.overskrift" /></LabelledField>
            <div className="dato-container">
                <DatoFelt feltNavn="fraDato" labelId="egen-aktivitet-form.label.fra-dato" />
                <DatoFelt feltNavn="tilDato" labelId="egen-aktivitet-form.label.til-dato" />
            </div>
            <LabelledField
                name="lenke"
                type="text"
                className="skjemaelement"
                inputClass="skjemaelement__input input--fullbredde"
                labelClass="skjemaelement__label"
            ><FormattedMessage id="egen-aktivitet-form.label.lenke" /></LabelledField>
            <LabelledField
                name="hensikt"
                type="text"
                className="skjemaelement"
                inputClass="skjemaelement__input input--fullbredde"
                labelClass="skjemaelement__label"
            ><FormattedMessage id="egen-aktivitet-form.label.hensikt" /></LabelledField>
            <CustomField
                name="beskrivelse"
                customComponent={
                    <Textarea
                        id="besrkivelse-textarea"
                        className="skjemaelement__input input--fullbredde"
                        label={<FormattedMessage id="egen-aktivitet-form.label.beskrivelse" />}
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
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
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        lenke: [begrensetLenkeLengde],
        hensikt: [begrensetHensiktLengde],
        beskrivelse: [begrensetBeskrivelseLengde]
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
