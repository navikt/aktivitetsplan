import useFormstate from '@nutgaard/use-formstate';
import { RadioGruppe, SkjemaGruppe } from 'nav-frontend-skjema';
import PT from 'prop-types';
import React from 'react';

import { IJOBB_AKTIVITET_TYPE, JOBB_STATUS_DELTID, JOBB_STATUS_HELTID } from '../../../../constant';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/periode-validering';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import * as AppPT from '../../../../proptypes';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import {
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateJobbstatus,
    validateTittel,
} from './validate';

function erAvtalt(aktivitet) {
    return aktivitet.avtalt === true;
}

function IJobbAktivitetForm(props) {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const validator = useFormstate({
        tittel: (val, values, aktivitet) => validateTittel(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validerDato(val, null, aktivitet.fraDato),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
        ansettelsesforhold: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        jobbStatus: (val, values, aktivitet) => validateJobbstatus(erAvtalt(aktivitet), val),
        arbeidstid: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
    });

    const maybeAktivitet = aktivitet || {};
    const avtalt = maybeAktivitet.avtalt === true;

    const initalValues = {
        tittel: maybeAktivitet.tittel || '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        periodeValidering: '',
        jobbStatus: maybeAktivitet.jobbStatus || '',
        ansettelsesforhold: maybeAktivitet.ansettelsesforhold || '',
        arbeidstid: maybeAktivitet.arbeidstid || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
    };

    const state = validator(initalValues, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <SkjemaGruppe className="aktivitetskjema" tag="div">
                <AktivitetFormHeader tittel="Jobb jeg har nå" aktivitetsType={IJOBB_AKTIVITET_TYPE} />

                <Input disabled={avtalt} label="Stillingstittel *" {...state.fields.tittel} />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        <DatoField
                            disabled={avtalt}
                            label="Fra dato *"
                            senesteTom={maybeAktivitet.tilDato}
                            required
                            {...state.fields.fraDato}
                        />
                        <DatoField label="Til dato" tidligsteFom={maybeAktivitet.fraDato} {...state.fields.tilDato} />
                    </div>
                </PeriodeValidering>

                <RadioGruppe
                    id="jobbStatus"
                    feil={state.fields.jobbStatus.touched && state.fields.jobbStatus.error}
                    legend="Stillingsandel *"
                >
                    <Radio label="Heltid" value={JOBB_STATUS_HELTID} disabled={avtalt} {...state.fields.jobbStatus} />
                    <Radio label="Deltid" value={JOBB_STATUS_DELTID} disabled={avtalt} {...state.fields.jobbStatus} />
                </RadioGruppe>

                <Input disabled={avtalt} label="Arbeidsgiver" {...state.fields.ansettelsesforhold} />
                <Input
                    disabled={avtalt}
                    label="Ansettelsesforhold (fast, midlertidig, vikariat)"
                    {...state.fields.arbeidstid}
                />
                <Textarea
                    disabled={avtalt}
                    label="Kort beskrivelse av arbeidstid (dag, kveld, helg, stillingsprosent) og arbeidsoppgaver"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
                <FormErrorSummary submittoken={state.submittoken} errors={state.errors} />
            </SkjemaGruppe>
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
