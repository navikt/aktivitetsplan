import React, { PropTypes as PT } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import { LabelledField, CustomField, validForm, rules } from 'react-redux-form-validation';
import { dateToISODate } from '../../utils';
import DatoFelt from './datovelger/dato-felt';
import Textarea from './textarea';
import './skjema.less';

// TODO Feil i rules, rettet i PR, overskriver imens. Bytt når ny versjon av react-redux-form-validation er klar
export function maxLength(max, error = 'max-length') {
    return (value) => (value && value.length > max ? error : undefined);
}

const TITTEL_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const ARBEIDSSTED_MAKS_LENGDE = 255;
const ARBEIDSGIVER_MAKS_LENGDE = 255;
const KONTAKTPERSON_MAKS_LENGDE = 255;

const pakrevdTittel = rules.minLength(0, 'Du må fylle ut overskriften');
const begrensetTittelLengde =
    maxLength(TITTEL_MAKS_LENGDE, `Overskriften kan ikke være lenger en ${TITTEL_MAKS_LENGDE} tegn`);
const pakrevdFraDato = rules.minLength(0, 'Du må fylle ut fra datoen');
const pakrevdTilDato = rules.minLength(0, 'Du må fylle ut fristen');
const begrensetLenkeLengde =
    maxLength(LENKE_MAKS_LENGDE, `Lenken kan ikke være lenger en ${LENKE_MAKS_LENGDE} tegn`);
const begrensetBeskrivelseLengde =
    maxLength(BESKRIVELSE_MAKS_LENGDE, `Besrkivelsen kan ikke være lenger en ${BESKRIVELSE_MAKS_LENGDE} tegn`);
const begrensetArbeidsstedLengde =
    maxLength(ARBEIDSSTED_MAKS_LENGDE, `Arbeidsstedtekst kan ikke være lenger en ${ARBEIDSSTED_MAKS_LENGDE} tegn`);
const begrensetArbeidsgiverLengde =
    maxLength(ARBEIDSGIVER_MAKS_LENGDE, `Arbeidsgivertekst kan ikke være lenger en ${ARBEIDSGIVER_MAKS_LENGDE} tegn`);
const begrensetKontaktpersonLengde =
    maxLength(KONTAKTPERSON_MAKS_LENGDE, `Kontaktpersontekst kan ikke være lenger en ${KONTAKTPERSON_MAKS_LENGDE} tegn`);

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
                <DatoFelt feltNavn="fraDato" labelId="stilling-aktivitet-form.fra-dato" />
                <DatoFelt feltNavn="tilDato" labelId="stilling-aktivitet-form.til-dato" />
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
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        lenke: [begrensetLenkeLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
        arbeidssted: [begrensetArbeidsstedLengde],
        arbeidsgiver: [begrensetArbeidsgiverLengde],
        kontaktperson: [begrensetKontaktpersonLengde]
    }
})(StillingAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: 'PLANLAGT',
            fraDato: dateToISODate(new Date()),
            ...aktivitet
        },
        etikett: selector(state, 'etikett')
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StillingAktivitetReduxForm);
