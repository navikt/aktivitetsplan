import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Input, Textarea, Radio } from 'nav-frontend-skjema';
import useFormstate from '@nutgaard/use-formstate';
import LagreAktivitet from '../lagre-aktivitet';
import { moment } from '../../../../utils';
import getTellerTekst from '../../../../felles-komponenter/skjema/textarea/textareav2';
import {
    IJOBB_AKTIVITET_TYPE,
    JOBB_STATUS_DELTID,
    JOBB_STATUS_HELTID,
    STATUS_PLANLAGT,
} from '../../../../constant';
import AktivitetFormHeader from '../aktivitet-form-header';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import FieldGroup from '../../../../felles-komponenter/skjema/fieldgroups-valideringv2';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelgerv2';
import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';
import {
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateJobbstatus,
    validateTittel,
} from './validate';
import PeriodeValidering, {
    periodeErrors,
} from '../../../../felles-komponenter/skjema/datovelger/periode-valideringv2';

function feil(field) {
    if (!field.error || !field.touched) {
        return null;
    }

    return { feilmelding: field.error };
}

function IJobbAktivitetForm(props) {
    const { avtalt, currentFraDato, currentTilDato, onSubmit } = props;

    const validator = useFormstate({
        tittel: !avtalt && validateTittel,
        fraDato: value =>
            validateFraDato(value) || validerDato(value, currentTilDato, null),
        tilDato: value => validerDato(value, null, currentFraDato),
        ansettelsesforhold: validateFeltForLangt,
        jobbStatus: validateJobbstatus,
        arbeidstid: validateFeltForLangt,
        beskrivelse: validateBeskrivelse,
    });

    // TODO inital state
    const state = validator({
        tittel: '',
        fraDato: '',
        tilDato: '',
        jobbStatus: '',
        ansettelsesforhold: '',
        arbeidstid: '',
        beskrivelse: '',
    });

    const erAktivitetAvtalt = avtalt === true;

    const errors = {
        ...state.errors,
        ...periodeErrors(state.fields.fraDato, state.fields.tilDato),
    };

    return (
        <form
            autoComplete="off"
            onSubmit={state.onSubmit(values => {
                return onSubmit({ status: STATUS_PLANLAGT, ...values });
            })}
        >
            <div className="aktivitetskjema">
                <FormErrorSummary hidden={state.submittoken} errors={errors} />

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
                    fraDato={state.fields.fraDato}
                    tilDato={state.fields.tilDato}
                >
                    <div className="dato-container">
                        <DatoField
                            {...state.fields.fraDato}
                            disabled={erAktivitetAvtalt}
                            label="Fra dato *"
                            senesteTom={currentTilDato}
                        />
                        <DatoField
                            {...state.fields.tilDato}
                            label="Til dato"
                            tidligsteFom={currentFraDato}
                        />
                    </div>
                </PeriodeValidering>

                <FieldGroup
                    name="jobbStatus"
                    feil={feil(state.fields.jobbStatus)}
                >
                    <legend className="skjemaelement__label">
                        Stillingsandel *
                    </legend>
                    <Radio
                        {...state.fields.jobbStatus.input}
                        label="Heltid"
                        value={JOBB_STATUS_HELTID}
                        id={`id--${JOBB_STATUS_HELTID}`}
                        disabled={erAktivitetAvtalt}
                    />
                    <Radio
                        {...state.fields.jobbStatus.input}
                        label="Deltid"
                        value={JOBB_STATUS_DELTID}
                        id={`id--${JOBB_STATUS_DELTID}`}
                        disabled={erAktivitetAvtalt}
                    />
                </FieldGroup>

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
                    maxLength={5000}
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
    onSubmit: PT.func.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    avtalt: PT.bool,
};

IJobbAktivitetForm.defaultProps = {
    currentFraDato: undefined,
    currentTilDato: undefined,
    avtalt: false,
};

// eslint-disable-next-line no-confusing-arrow
const getDateFromField = field =>
    field == null ? null : moment(field).toDate();

const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_PLANLAGT,
            ...aktivitet,
        },
        currentFraDato: getDateFromField(null),
        currentTilDato: getDateFromField(null),
        avtalt: aktivitet && aktivitet.avtalt,
    };
};

export default connect(mapStateToProps)(IJobbAktivitetForm);
