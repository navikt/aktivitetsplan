import { Radio, RadioGroup } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import { Formstate } from '@nutgaard/use-formstate/dist/types/domain';
import PT from 'prop-types';
import React, { MutableRefObject } from 'react';

import { IJOBB_AKTIVITET_TYPE, JOBB_STATUS_DELTID, JOBB_STATUS_HELTID } from '../../../../constant';
import { IJobbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
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
    aktivitet?: IJobbAktivitet;
    isDirtyRef: MutableRefObject<boolean>;
}

type IJobbAktivitetFormValues = {
    tittel: string;
    fraDato: string;
    tilDato: string;
    periodeValidering: string;
    ansettelsesforhold: string;
    jobbStatus: string;
    arbeidstid: string;
    beskrivelse: string;
};

function IJobbAktivitetForm(props: Props) {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const validator: (
        initialValues: IJobbAktivitetFormValues,
        props: Partial<IJobbAktivitet>
    ) => Formstate<IJobbAktivitetFormValues> = useFormstate<IJobbAktivitetFormValues, Partial<IJobbAktivitet>>({
        tittel: (val, values, aktivitet) => validateTittel(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validerDato(val, undefined, aktivitet.fraDato),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
        ansettelsesforhold: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        jobbStatus: (val, values, aktivitet) => validateJobbstatus(erAvtalt(aktivitet), val),
        arbeidstid: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
    });

    const avtalt = aktivitet?.avtalt === true;

    const initalValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: aktivitet?.fraDato || '',
        tilDato: aktivitet?.tilDato || '',
        periodeValidering: '',
        jobbStatus: aktivitet?.jobbStatus || '',
        ansettelsesforhold: aktivitet?.ansettelsesforhold || '',
        arbeidstid: aktivitet?.arbeidstid || '',
        beskrivelse: aktivitet?.beskrivelse || '',
    };

    const state = validator(initalValues, aktivitet || {});

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
                <Input disabled={avtalt} label="Stillingstittel (obligatorisk)" {...state.fields.tittel} />
                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        <MaybeAvtaltDateRangePicker
                            formState={state}
                            aktivitet={aktivitet}
                            initialFromDate={initalValues.fraDato ? new Date(initalValues.fraDato) : undefined}
                        />
                    </div>
                </PeriodeValidering>
                <RadioGroup
                    value={state.fields.jobbStatus.input.value}
                    id="jobbStatus"
                    error={state.fields.jobbStatus.touched && state.fields.jobbStatus.error}
                    legend="Stillingsandel (obligatorisk)"
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
                    {...state.fields.beskrivelse}
                />
                {state.submittoken ? <FormErrorSummary errors={state.errors} /> : null}
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
