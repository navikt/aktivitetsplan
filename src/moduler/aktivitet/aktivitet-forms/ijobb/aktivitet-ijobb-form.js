import React from 'react';
import PT from 'prop-types';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { validForm } from 'react-redux-form-validation';
import { Input, Textarea } from 'nav-frontend-skjema';
import LagreAktivitet from '../lagre-aktivitet';
import { formNavn } from '../aktivitet-form-utils';
import { moment } from '../../../../utils';
import { getTellerTekst } from '../../../../felles-komponenter/skjema/textarea/textareav2';
import Datovelger from '../../../../felles-komponenter/skjema/datovelger/datovelger';
import {
    IJOBB_AKTIVITET_TYPE,
    JOBB_STATUS_DELTID,
    JOBB_STATUS_HELTID,
    STATUS_PLANLAGT,
} from '../../../../constant';
import PeriodeValidering from '../../../../felles-komponenter/skjema/datovelger/periode-validering';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import RadioGruppe from '../../../../felles-komponenter/skjema/input/radio-gruppe';
import {
    maksLengde,
    pakrevd,
} from '../../../../felles-komponenter/skjema/validering';
import AktivitetFormHeader from '../aktivitet-form-header';
import useFormstate from '../../../../utils/formstate/use-formstate';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';

const TITTEL_MAKS_LENGDE = 255;
const BESKRIVELSE_MAKS_LENGDE = 5000;
const ANSETTELSESFORHOLD_MAKS_LENGDE = 255;
const ARBEIDSTID_MAKS_LENGDE = 255;

function erAvtalt(verdi, props) {
    return !!props.avtalt;
}

const pakrevdFraDato = pakrevd(
    'ijobb-aktivitet-form.feilmelding.paakrevd-fradato'
).hvisIkke(erAvtalt);

const pakrevdJobbStatus = pakrevd(
    'ijobb-aktivitet-form.feilmelding.paakrevd-jobbStatus'
).hvisIkke(erAvtalt);

const begrensetAnsettelsesforholdLengde = maksLengde(
    'ijobb-aktivitet-form.feilmelding.ansettelsesforhold-lengde',
    ANSETTELSESFORHOLD_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetArbeidstidLengde = maksLengde(
    'ijobb-aktivitet-form.feilmelding.arbeidstid-lengde',
    ARBEIDSTID_MAKS_LENGDE
).hvisIkke(erAvtalt);

const begrensetBeskrivelseLengde = maksLengde(
    'ijobb-aktivitet-form.feilmelding.beskrivelse-lengde',
    BESKRIVELSE_MAKS_LENGDE
).hvisIkke(erAvtalt);

function validateTittel(value) {
    if (value.trim().length <= 0) {
        return 'Du må fylle ut stillingstittel';
    } if (value.length > TITTEL_MAKS_LENGDE) {
        return `Du må korte ned teksten til ${TITTEL_MAKS_LENGDE} tegn`;
    }

    return null;
}

function validateAnsettelsesforhold(value) {
    if (value.length > ANSETTELSESFORHOLD_MAKS_LENGDE) {
        return `Du må korte ned teksten til ${ANSETTELSESFORHOLD_MAKS_LENGDE} tegn`;
    }
    return null;
}

function validateBeskrivelse(value) {
    if (value.length > BESKRIVELSE_MAKS_LENGDE) {
        return `Du må korte ned teksten til ${BESKRIVELSE_MAKS_LENGDE} tegn`;
    }
    return null;
}

const validator = useFormstate({
    tittel: validateTittel,
    ansettelsesforhold: validateAnsettelsesforhold,
    arbeidstid: validateAnsettelsesforhold,
    beskrivelse: validateBeskrivelse,
});

function feil(field) {
    if (!field.error || !field.touched) {
        return null;
    }

    return { feilmelding: field.error };
}

function IJobbAktivitetForm(props) {
    const state = validator({
        tittel: '',
        ansettelsesforhold: '',
        arbeidstid: '',
        beskrivelse: '',
    });

    const { avtalt, currentFraDato, currentTilDato } = props;

    const erAktivitetAvtalt = avtalt === true;
    return (
        <form
            onSubmit={state.onSubmit(() => {
                console.log('submitting');
                return Promise.resolve();
            })}
            autoComplete="off"
        >
            <div className="aktivitetskjema">
                <FormErrorSummary
                    hidden={state.submittoken}
                    errors={state.errors}
                />

                <AktivitetFormHeader
                    tittelId="ijobb-aktivitet-form.header"
                    pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                    ingressType={IJOBB_AKTIVITET_TYPE}
                />

                <Input
                    disabled={erAktivitetAvtalt}
                    label="Stillingstittel *"
                    {...state.fields.tittel.input}
                    feil={feil(state.fields.tittel)}
                />

                <PeriodeValidering
                    feltNavn="periodeValidering"
                    fraDato={currentFraDato}
                    tilDato={currentTilDato}
                    errorMessageId="datepicker.feilmelding.ijobb.fradato-etter-frist"
                >
                    <div className="dato-container">
                        <Datovelger
                            feltNavn="fraDato"
                            disabled={erAktivitetAvtalt}
                            labelId="ijobb-aktivitet-form.label.fra-dato"
                            senesteTom={currentTilDato}
                        />
                        <Datovelger
                            feltNavn="tilDato"
                            labelId="ijobb-aktivitet-form.label.til-dato"
                            tidligsteFom={currentFraDato}
                        />
                    </div>
                </PeriodeValidering>

                <RadioGruppe
                    feltNavn="jobbStatus"
                    labelId="ijobb-aktivitet-form.label.jobbStatus"
                >
                    <Radio
                        feltNavn="jobbStatus"
                        label={
                            <FormattedMessage id="aktivitetdetaljer.jobbStatus-HELTID" />
                        }
                        value={JOBB_STATUS_HELTID}
                        id={`id--${JOBB_STATUS_HELTID}`}
                        disabled={erAktivitetAvtalt}
                    />
                    <Radio
                        feltNavn="jobbStatus"
                        label={
                            <FormattedMessage id="aktivitetdetaljer.jobbStatus-DELTID" />
                        }
                        value={JOBB_STATUS_DELTID}
                        id={`id--${JOBB_STATUS_DELTID}`}
                        disabled={erAktivitetAvtalt}
                    />
                </RadioGruppe>

                <Input
                    disabled={erAktivitetAvtalt}
                    label="Arbeidsgiver"
                    {...state.fields.ansettelsesforhold.input}
                    feil={feil(state.fields.ansettelsesforhold)}
                />
                <Input
                    disabled={erAktivitetAvtalt}
                    label="Ansettelsesforhold (fast, midlertidig, vikariat)"
                    {...state.fields.arbeidstid.input}
                    feil={feil(state.fields.arbeidstid)}
                />
                <Textarea
                    disabled={erAktivitetAvtalt}
                    label="Kort beskrivelse av arbeidstid (dag, kveld, helg, stillingsprosent) og arbeidsoppgaver"
                    maxLength={BESKRIVELSE_MAKS_LENGDE}
                    tellerTekst={(antallTegn, max) =>
                        getTellerTekst(antallTegn, max, 500)}
                    {...state.fields.beskrivelse.input}
                    feil={feil(state.fields.beskrivelse)}
                />
            </div>
            <LagreAktivitet />
        </form>
    );
}

IJobbAktivitetForm.propTypes = {
    handleSubmit: PT.func.isRequired,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    isDirty: PT.bool.isRequired,
    avtalt: PT.bool,
};

IJobbAktivitetForm.defaultProps = {
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
};

const StillingAktivitetReduxForm = validForm({
    form: formNavn,
    validate: {
        fraDato: [pakrevdFraDato],
        jobbStatus: [pakrevdJobbStatus],
        ansettelsesforhold: [begrensetAnsettelsesforholdLengde],
        arbeidstid: [begrensetArbeidstidLengde],
        beskrivelse: [begrensetBeskrivelseLengde],
        periodeValidering: [],
    },
})(IJobbAktivitetForm);

// eslint-disable-next-line no-confusing-arrow
const getDateFromField = field =>
    field == null ? null : moment(field).toDate();

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(formNavn);
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            ...aktivitet,
        },
        isDirty: isDirty(formNavn)(state),
        currentFraDato: getDateFromField(selector(state, 'fraDato')),
        currentTilDato: getDateFromField(selector(state, 'tilDato')),
        avtalt: aktivitet && aktivitet.avtalt,
    };
};

export default connect(mapStateToProps)(StillingAktivitetReduxForm);
