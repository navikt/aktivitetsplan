import { Radio, RadioGroup } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import PT from 'prop-types';
import React, { MutableRefObject } from 'react';

import { IJOBB_AKTIVITET_TYPE, JOBB_STATUS_DELTID, JOBB_STATUS_HELTID } from '../../../../constant';
import { IJobbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/PartialDateRangePicker';
import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/PeriodeValidering';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import * as AppPT from '../../../../proptypes';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import { validateBeskrivelse, validateFeltForLangt, validateFraDato } from '../validate';
import { validateJobbstatus, validateTittel } from './validate';

function erAvtalt(aktivitet: Partial<IJobbAktivitet>) {
    return aktivitet.avtalt;
}

interface Props {
    onSubmit: (values: Record<any, any>) => Promise<void>;
    aktivitet: IJobbAktivitet;
    isDirtyRef: MutableRefObject<boolean>;
}

function IJobbAktivitetForm(props: Props) {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const validator = useFormstate({
        tittel: (val, values, aktivitet: Partial<IJobbAktivitet>) => validateTittel(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet: Partial<IJobbAktivitet>) =>
            validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet: Partial<IJobbAktivitet>) => validerDato(val, undefined, aktivitet.fraDato),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
        ansettelsesforhold: (val, values, aktivitet: Partial<IJobbAktivitet>) =>
            validateFeltForLangt(erAvtalt(aktivitet), val),
        jobbStatus: (val, values, aktivitet: Partial<IJobbAktivitet>) => validateJobbstatus(erAvtalt(aktivitet), val),
        arbeidstid: (val, values, aktivitet: Partial<IJobbAktivitet>) => validateFeltForLangt(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet: Partial<IJobbAktivitet>) => validateBeskrivelse(erAvtalt(aktivitet), val),
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

    const state = validator(initalValues);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const onChangeStillingProsent = (value: typeof JOBB_STATUS_HELTID | typeof JOBB_STATUS_HELTID) => {
        state.setValue('jobbStatus', value);
    };

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <div className="aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Jobb jeg har nå" aktivitetsType={IJOBB_AKTIVITET_TYPE} />

                <Input disabled={avtalt} label="Stillingstittel *" {...state.fields.tittel} />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        {/*<DatoField*/}
                        {/*    disabled={avtalt}*/}
                        {/*    label="Fra dato *"*/}
                        {/*    senesteTom={maybeAktivitet.tilDato}*/}
                        {/*    required*/}
                        {/*    {...state.fields.fraDato}*/}
                        {/*/>*/}
                        {/*<DatoField label="Til dato" tidligsteFom={maybeAktivitet.fraDato} {...state.fields.tilDato} />*/}
                    </div>
                </PeriodeValidering>

                <RadioGroup
                    id="jobbStatus"
                    error={state.fields.jobbStatus.touched && state.fields.jobbStatus.error}
                    legend="Stillingsandel *"
                    onChange={onChangeStillingProsent}
                >
                    <Radio value={JOBB_STATUS_HELTID} disabled={avtalt}>
                        Heltid
                    </Radio>
                    <Radio value={JOBB_STATUS_DELTID} disabled={avtalt}>
                        Deltid
                    </Radio>
                </RadioGroup>

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
