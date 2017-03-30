import React, { PropTypes as PT } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import Textarea from 'nav-frontend-skjema/src/textarea';
import { Hovedknapp } from 'nav-frontend-knapper';
import { LabelledField, CustomField, validForm, rules } from 'react-redux-form-validation';
import { dateToISODate } from '../../utils';
import DatoFelt from './datovelger/dato-felt';
import './skjema.less';


const TITTEL_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const ARBEIDSSTED_MAKS_LENGDE = 255;
const ARBEIDSGIVER_MAKS_LENGDE = 255;
const KONTAKTPERSON_MAKS_LENGDE = 255;

const pakrevdTittel = rules.minLength(0, 'Du må fylle ut overskriften');
const begrensetTittelLengde =
    rules.maxLength(TITTEL_MAKS_LENGDE, `Overskriften kan ikke være lenger en ${TITTEL_MAKS_LENGDE} tegn`);
const pakrevdFraDato = rules.minLength(0, 'Du må fylle ut fra datoen');
const pakrevdTilDato = rules.minLength(0, 'Du må fylle ut fristen');
const begrensetLenkeLengde =
    rules.maxLength(LENKE_MAKS_LENGDE, `Lenken kan ikke være lenger en ${LENKE_MAKS_LENGDE} tegn`);
const begrensetBeskrivelseLengde =
    rules.maxLength(BESKRIVELSE_MAKS_LENGDE, `Besrkivelsen kan ikke være lenger en ${BESKRIVELSE_MAKS_LENGDE} tegn`);
const begrensetArbeidsstedLengde =
    rules.maxLength(ARBEIDSSTED_MAKS_LENGDE, `Arbeidsstedtekst kan ikke være lenger en ${ARBEIDSSTED_MAKS_LENGDE} tegn`);
const begrensetArbeidsgiverLengde =
    rules.maxLength(ARBEIDSGIVER_MAKS_LENGDE, `Arbeidsgivertekst kan ikke være lenger en ${ARBEIDSGIVER_MAKS_LENGDE} tegn`);
const begrensetKontaktpersonLengde =
    rules.maxLength(KONTAKTPERSON_MAKS_LENGDE, `Kontaktpersontekst kan ikke være lenger en ${KONTAKTPERSON_MAKS_LENGDE} tegn`);

function StillingAktivitetForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <div className="skjema-innlogget aktivitetskjema">
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
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                >
                    <FormattedMessage id="stilling-aktivitet-form.label.overskrift" />
                </LabelledField>
                <div className="dato-container">
                    <DatoFelt feltNavn="fraDato" labelId="stilling-aktivitet-form.label.fra-dato" />
                    <DatoFelt feltNavn="tilDato" labelId="stilling-aktivitet-form.label.til-dato" />
                </div>
                <LabelledField
                    name="lenke"
                    type="text"
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                >
                    <FormattedMessage id="stilling-aktivitet-form.label.lenke" />
                </LabelledField>
                <CustomField
                    name="beskrivelse"
                    customComponent={
                        <Textarea
                            id="besrkivelse-textarea"
                            className="skjemaelement__input input--fullbredde"
                            label={<FormattedMessage id="stilling-aktivitet-form.label.beskrivelse" />}
                            maxLength={BESKRIVELSE_MAKS_LENGDE}
                        />}
                />
                <LabelledField
                    name="arbeidssted"
                    type="text"
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                >
                    <FormattedMessage id="stilling-aktivitet-form.label.arbeidssted" />
                </LabelledField>
                <LabelledField
                    name="arbeidsgiver"
                    type="text"
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                >
                    <FormattedMessage id="stilling-aktivitet-form.label.arbeidsgiver" />
                </LabelledField>
                <LabelledField
                    name="kontaktperson"
                    type="text"
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                >
                    <FormattedMessage id="stilling-aktivitet-form.label.kontaktperson" />
                </LabelledField>
            </div>
            <div className="aktivitetskjema__lagre-knapp">
                <Hovedknapp><FormattedMessage id="egen-aktivitet-form.lagre" /></Hovedknapp>
            </div>
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
