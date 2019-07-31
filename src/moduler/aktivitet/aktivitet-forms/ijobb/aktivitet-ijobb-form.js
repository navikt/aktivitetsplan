import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import * as AppPT from '../../../../proptypes';
import LagreAktivitet from '../lagre-aktivitet';
import {
    IJOBB_AKTIVITET_TYPE,
    JOBB_STATUS_DELTID,
    JOBB_STATUS_HELTID,
    STATUS_PLANLAGT,
} from '../../../../constant';
import AktivitetFormHeader from '../aktivitet-form-header';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import FieldGroup from '../../../../felles-komponenter/skjema/field-group/fieldgroups-valideringv2';
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
} from '../../../../felles-komponenter/skjema/field-group/periode-valideringv2';
import Input from '../../../../felles-komponenter/skjema/input-v2/input';
import Radio from '../../../../felles-komponenter/skjema/input-v2/radio';
import Textarea from '../../../../felles-komponenter/skjema/input-v2/textarea';

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
        ...maybeAktivitet,
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
                    {...state.fields.tittel}
                />

                <PeriodeValidering
                    fraDato={state.fields.fraDato}
                    tilDato={state.fields.tilDato}
                >
                    <div className="dato-container">
                        <DatoField
                            disabled={erAktivitetAvtalt}
                            label="Fra dato *"
                            senesteTom={maybeAktivitet.tilDato}
                            {...state.fields.fraDato}
                        />
                        <DatoField
                            label="Til dato"
                            tidligsteFom={maybeAktivitet.fraDato}
                            {...state.fields.tilDato}
                        />
                    </div>
                </PeriodeValidering>

                <FieldGroup name="jobbStatus" field={state.fields.jobbStatus}>
                    <legend className="skjemaelement__label">
                        Stillingsandel *
                    </legend>
                    <Radio
                        label="Heltid"
                        value={JOBB_STATUS_HELTID}
                        disabled={erAktivitetAvtalt}
                        {...state.fields.jobbStatus}
                    />
                    <Radio
                        label="Deltid"
                        value={JOBB_STATUS_DELTID}
                        disabled={erAktivitetAvtalt}
                        {...state.fields.jobbStatus}
                    />
                </FieldGroup>

                <Input
                    disabled={erAktivitetAvtalt}
                    label="Arbeidsgiver"
                    {...state.fields.ansettelsesforhold}
                />
                <Input
                    disabled={erAktivitetAvtalt}
                    label="Ansettelsesforhold (fast, midlertidig, vikariat)"
                    {...state.fields.arbeidstid}
                />
                <Textarea
                    disabled={erAktivitetAvtalt}
                    label="Kort beskrivelse av arbeidstid (dag, kveld, helg, stillingsprosent) og arbeidsoppgaver"
                    maxLength={5000}
                    {...state.fields.beskrivelse}
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
