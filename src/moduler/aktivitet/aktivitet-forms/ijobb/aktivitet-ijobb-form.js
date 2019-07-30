import React from 'react';
import PT from 'prop-types';
import { Input, Textarea, Radio } from 'nav-frontend-skjema';
import useFormstate from '@nutgaard/use-formstate';
import * as AppPT from '../../../../proptypes';
import LagreAktivitet from '../lagre-aktivitet';
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
    const { onSubmit, aktivitet } = props;
    const maybeAktivitet = aktivitet || {};

    const validator = useFormstate({
        tittel: validateTittel,
        fraDato: value =>
            validateFraDato(value) ||
            validerDato(value, maybeAktivitet.tilDato, null),
        tilDato: value => validerDato(value, null, maybeAktivitet.fraDato),
        ansettelsesforhold: validateFeltForLangt,
        jobbStatus: validateJobbstatus,
        arbeidstid: validateFeltForLangt,
        beskrivelse: validateBeskrivelse,
    });

    const state = validator({
        tittel: maybeAktivitet.tittel || '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        jobbStatus: maybeAktivitet.jobbStatus || '',
        ansettelsesforhold: maybeAktivitet.ansettelsesforhold || '',
        arbeidstid: maybeAktivitet.arbeidstid || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
    });

    const erAktivitetAvtalt = maybeAktivitet.avtalt === true;

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
                            senesteTom={maybeAktivitet.tilDato}
                        />
                        <DatoField
                            {...state.fields.tilDato}
                            label="Til dato"
                            tidligsteFom={maybeAktivitet.fraDato}
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
                        checked={
                            JOBB_STATUS_HELTID ===
                            state.fields.jobbStatus.input.value
                        }
                        id={`id--${JOBB_STATUS_HELTID}`}
                        disabled={erAktivitetAvtalt}
                    />
                    <Radio
                        {...state.fields.jobbStatus.input}
                        label="Deltid"
                        value={JOBB_STATUS_DELTID}
                        checked={
                            JOBB_STATUS_DELTID ===
                            state.fields.jobbStatus.input.value
                        }
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
    aktivitet: AppPT.aktivitet,
};

IJobbAktivitetForm.defaultProps = {
    aktivitet: undefined,
};

export default IJobbAktivitetForm;
