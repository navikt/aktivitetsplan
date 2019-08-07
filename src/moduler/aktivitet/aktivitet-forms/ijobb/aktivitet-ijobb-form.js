import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import * as AppPT from '../../../../proptypes';
import LagreAktivitet from '../lagre-aktivitet';
import {
    IJOBB_AKTIVITET_TYPE,
    JOBB_STATUS_DELTID,
    JOBB_STATUS_HELTID,
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
    const { onSubmit, aktivitet, isDirtyRef } = props;
    const maybeAktivitet = aktivitet || {};
    const erAvtalt = maybeAktivitet.avtalt === true;

    const validator = useFormstate({
        tittel: val => erAvtalt || validateTittel(val),
        fraDato: val =>
            erAvtalt ||
            validateFraDato(val) ||
            validerDato(val, maybeAktivitet.tilDato, null),
        tilDato: val => validerDato(val, null, maybeAktivitet.fraDato),
        ansettelsesforhold: val => erAvtalt || validateFeltForLangt(val),
        jobbStatus: val => erAvtalt || validateJobbstatus(val),
        arbeidstid: val => erAvtalt || validateFeltForLangt(val),
        beskrivelse: val => erAvtalt || validateBeskrivelse(val),
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

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const errors = {
        ...state.errors,
        ...periodeErrors(state.fields.fraDato, state.fields.tilDato),
    };

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)}>
            <div className="aktivitetskjema">
                <FormErrorSummary hidden={state.submittoken} errors={errors} />

                <AktivitetFormHeader
                    tittelId="ijobb-aktivitet-form.header"
                    pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                    ingressType={IJOBB_AKTIVITET_TYPE}
                />

                <Input
                    disabled={erAvtalt}
                    label="Stillingstittel *"
                    {...state.fields.tittel}
                />

                <PeriodeValidering
                    fraDato={state.fields.fraDato}
                    tilDato={state.fields.tilDato}
                >
                    <div className="dato-container">
                        <DatoField
                            disabled={erAvtalt}
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
                        disabled={erAvtalt}
                        {...state.fields.jobbStatus}
                    />
                    <Radio
                        label="Deltid"
                        value={JOBB_STATUS_DELTID}
                        disabled={erAvtalt}
                        {...state.fields.jobbStatus}
                    />
                </FieldGroup>

                <Input
                    disabled={erAvtalt}
                    label="Arbeidsgiver"
                    {...state.fields.ansettelsesforhold}
                />
                <Input
                    disabled={erAvtalt}
                    label="Ansettelsesforhold (fast, midlertidig, vikariat)"
                    {...state.fields.arbeidstid}
                />
                <Textarea
                    disabled={erAvtalt}
                    label="Kort beskrivelse av arbeidstid (dag, kveld, helg, stillingsprosent) og arbeidsoppgaver"
                    maxLength={5000}
                    visTellerFra={500}
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
    isDirtyRef: PT.shape({ current: PT.bool }),
};

IJobbAktivitetForm.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: undefined,
};

export default IJobbAktivitetForm;
