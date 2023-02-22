import useFormstate from '@nutgaard/use-formstate';
import { Formstate } from '@nutgaard/use-formstate/dist/types/domain';
import PT from 'prop-types';
import React, { MutableRefObject } from 'react';

import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import { StillingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/PeriodeValidering';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import * as AppPT from '../../../../proptypes';
import { todayIsoString } from '../../../../utils/dateUtils';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import { validateBeskrivelse, validateFeltForLangt, validateFraDato, validateLenke } from '../validate';
import { validateTittel } from './validate';

function erAvtalt(aktivitet: Partial<StillingAktivitet>) {
    return aktivitet?.avtalt || false;
}

interface Props {
    onSubmit: (values: StillingAktivitetFormValues) => Promise<void>;
    isDirtyRef: MutableRefObject<boolean>;
    aktivitet?: StillingAktivitet;
}

type StillingAktivitetFormValues = {
    tittel: string;
    fraDato: string;
    tilDato: string;
    beskrivelse: string;
    arbeidssted: string;
    arbeidsgiver: string;
    kontaktperson: string;
    lenke: string;
    periodeValidering: string;
};

function StillingAktivitetForm(props: Props) {
    const { onSubmit, isDirtyRef, aktivitet } = props;

    const validator: (
        initialValues: StillingAktivitetFormValues,
        props: Partial<StillingAktivitetFormValues>
    ) => Formstate<StillingAktivitetFormValues> = useFormstate<StillingAktivitetFormValues, Partial<StillingAktivitet>>(
        {
            tittel: (val, values, aktivitet) => validateTittel(erAvtalt(aktivitet), val),
            fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
            tilDato: (val, values, aktivitet) => validerDato(val, undefined, aktivitet.fraDato),
            beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
            arbeidssted: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
            arbeidsgiver: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
            kontaktperson: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
            lenke: (val, values, aktivitet) => validateLenke(erAvtalt(aktivitet), val),
            periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
        }
    );

    const avtalt = aktivitet?.avtalt === true;

    const initalValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: aktivitet?.fraDato || todayIsoString(),
        tilDato: aktivitet?.tilDato || '',
        beskrivelse: aktivitet?.beskrivelse || '',
        arbeidssted: aktivitet?.arbeidssted || '',
        arbeidsgiver: aktivitet?.arbeidsgiver || '',
        kontaktperson: aktivitet?.kontaktperson || '',
        lenke: aktivitet?.lenke || '',
        periodeValidering: '',
    };

    const state = validator(initalValues, aktivitet || {});

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <div className="aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="En jobb jeg vil søke på" aktivitetsType={STILLING_AKTIVITET_TYPE} />

                <Input disabled={avtalt} label="Stillingstittel *" {...state.fields.tittel} required />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        <MaybeAvtaltDateRangePicker
                            formState={state}
                            aktivitet={aktivitet}
                            initialFromDate={aktivitet?.tilDato ? new Date(aktivitet.tilDato) : undefined}
                        />
                    </div>
                </PeriodeValidering>
                <Input disabled={avtalt} label="Arbeidsgiver" {...state.fields.arbeidsgiver} />
                <Input disabled={avtalt} label="Kontaktperson hos arbeidsgiver" {...state.fields.kontaktperson} />
                <Input disabled={avtalt} label="Arbeidssted" {...state.fields.arbeidssted} />
                <Textarea
                    disabled={avtalt}
                    label="Kort beskrivelse av stillingen"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
                <Input disabled={avtalt} label="Lenke til stillingsannonse" {...state.fields.lenke} />
                <FormErrorSummary submittoken={state.submittoken} errors={state.errors} />
            </div>
            <LagreAktivitet />
        </form>
    );
}

StillingAktivitetForm.propTypes = {
    onSubmit: PT.func.isRequired,
    aktivitet: AppPT.aktivitet,
    isDirtyRef: PT.shape({ current: PT.bool }),
};

StillingAktivitetForm.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: undefined,
};

export default StillingAktivitetForm;
