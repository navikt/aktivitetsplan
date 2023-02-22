import useFormstate from '@nutgaard/use-formstate';
import { Formstate } from '@nutgaard/use-formstate/dist/types/domain';
import PT from 'prop-types';
import React, { MutableRefObject } from 'react';

import { EGEN_AKTIVITET_TYPE } from '../../../../constant';
import { EgenAktivitet } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/PeriodeValidering';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import * as AppPT from '../../../../proptypes';
import Malverk from '../../../malverk/malverk';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import { validateBeskrivelse, validateFeltForLangt, validateFraDato, validateLenke } from '../validate';
import { validateTilDato, validateTittel } from './validate';

function erAvtalt(aktivitet?: Partial<EgenAktivitet>) {
    return aktivitet?.avtalt || false;
}
declare const window: {
    appconfig: { VIS_MALER: boolean };
};

interface Props {
    onSubmit: (values: EgenAktivitetFormValues) => Promise<void>;
    aktivitet?: EgenAktivitet;
    isDirtyRef: MutableRefObject<boolean>;
    endre: boolean;
}

type EgenAktivitetFormValues = {
    tittel: string;
    fraDato: string;
    tilDato: string;
    periodeValidering: string;
    hensikt: string;
    beskrivelse: string;
    oppfolging: string;
    lenke: string;
};

function EgenAktivitetForm(props: Props) {
    const { onSubmit, aktivitet, isDirtyRef, endre } = props;

    const validator: (
        initialValues: EgenAktivitetFormValues,
        props: Partial<EgenAktivitet>
    ) => Formstate<EgenAktivitetFormValues> = useFormstate<EgenAktivitetFormValues, Partial<EgenAktivitet>>({
        tittel: (val, values, aktivitet) => validateTittel(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validateTilDato(aktivitet.fraDato, val),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
        hensikt: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
        oppfolging: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        lenke: (val, values, aktivitet) => validateLenke(erAvtalt(aktivitet), val),
    });

    const avtalt = aktivitet?.avtalt === true;

    const initalValues: EgenAktivitetFormValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: aktivitet?.fraDato || '',
        tilDato: aktivitet?.tilDato || '',
        periodeValidering: '',
        hensikt: aktivitet?.hensikt || '',
        beskrivelse: aktivitet?.beskrivelse || '',
        oppfolging: aktivitet?.oppfolging || '',
        lenke: aktivitet?.lenke || '',
    };

    const state = validator(initalValues, aktivitet || {});

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const reinitalize = (newInitalValues: EgenAktivitetFormValues) =>
        state.reinitialize({ ...initalValues, ...newInitalValues });

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <div className="aktivitetskjema space-y-3">
                <AktivitetFormHeader tittel="Jobbrettet egenaktivitet" aktivitetsType={EGEN_AKTIVITET_TYPE} />

                <Malverk visible={window.appconfig.VIS_MALER} endre={endre} onChange={reinitalize} type="EGEN" />

                <Input disabled={avtalt} label="Navn på aktiviteten *" {...state.fields.tittel} />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        <MaybeAvtaltDateRangePicker
                            formState={state}
                            aktivitet={aktivitet}
                            initialFromDate={initalValues.fraDato ? new Date(initalValues.fraDato) : undefined}
                        />
                    </div>
                </PeriodeValidering>

                <Input disabled={avtalt} label="Mål med aktiviteten" {...state.fields.hensikt} />
                <Textarea
                    disabled={avtalt}
                    label="Kort beskrivelse av aktiviteten"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
                <Input disabled={avtalt} label="Min huskeliste for denne aktiviteten" {...state.fields.oppfolging} />
                <Input disabled={avtalt} label="Lenke til en aktuell nettside" {...state.fields.lenke} />
                <FormErrorSummary submittoken={state.submittoken} errors={state.errors} />
            </div>
            <LagreAktivitet />
        </form>
    );
}

EgenAktivitetForm.propTypes = {
    onSubmit: PT.func.isRequired,
    aktivitet: AppPT.aktivitet,
    isDirtyRef: PT.shape({ current: PT.bool }),
    endre: PT.bool,
};

EgenAktivitetForm.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: undefined,
    endre: false,
};

export default EgenAktivitetForm;
