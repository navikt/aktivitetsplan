import useFormstate from '@nutgaard/use-formstate';
import PT from 'prop-types';
import React from 'react';

import { AppConfig } from '../../../../app';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import { HiddenIfInput } from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import * as AppPT from '../../../../proptypes';
import Malverk from '../../../malverk/malverk';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import {
    validateAntallStillinger,
    validateAntallStillingerIUken,
    validateBeskrivelse,
    validateFraDato,
    validateOppfolging,
    validateTilDato,
} from './validate';

function erAvtalt(aktivitet: any) {
    return aktivitet.avtalt === true;
}

type SokeAvtaltFormValues = {
    tittel: string;
    antallStillingerIUken: string;
    antallStillingerSokes: string;
    avtaleOppfolging: string;
    beskrivelse: string;
    fraDato: string;
    tilDato: string;
};

const dateOrUndefined = (arg: string | undefined): Date | undefined => {
    return !arg ? undefined : new Date(arg);
};

export default function SokeAvtaleAktivitetForm(props: any) {
    const { onSubmit, aktivitet, isDirtyRef, endre } = props;

    const validator = useFormstate<SokeAvtaltFormValues>({
        tittel: () => undefined,
        antallStillingerIUken: (val, values, aktivitet) =>
            validateAntallStillingerIUken(erAvtalt(aktivitet), val, values.antallStillingerSokes),
        antallStillingerSokes: (val, values, aktivitet) => validateAntallStillinger(erAvtalt(aktivitet), val),
        avtaleOppfolging: (val, values, aktivitet) => validateOppfolging(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
        fraDato: (val, values) => validateFraDato(values.tilDato, val),
        tilDato: (val, values) => validateTilDato(values.fraDato, val),
    });

    const maybeAktivitet = aktivitet || {};
    const avtalt = maybeAktivitet.avtalt === true;

    const initalValues = {
        tittel: maybeAktivitet.tittel || 'Avtale om å søke jobber',
        antallStillingerSokes: maybeAktivitet.antallStillingerSokes || '',
        antallStillingerIUken: maybeAktivitet.antallStillingerIUken || '',
        avtaleOppfolging: maybeAktivitet.avtaleOppfolging || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        periodeValidering: '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
    };

    const state = validator(initalValues);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const reinitalize = (newInitalValues: any) => {
        state.reinitialize({ ...initalValues, ...newInitalValues });
    };

    const brukeStillingerIUken = !state.fields.antallStillingerSokes.initialValue;

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <div className="skjema-innlogget aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Avtale om å søke jobber" aktivitetsType={SOKEAVTALE_AKTIVITET_TYPE} />
                <Malverk visible={window.appconfig.VIS_MALER} endre={endre} onChange={reinitalize} type="SOKEAVTALE" />
                <div className="dato-container">
                    <MaybeAvtaltDateRangePicker
                        formState={state}
                        aktivitet={aktivitet}
                        initialFromDate={initalValues.fraDato ? new Date(initalValues.fraDato) : undefined}
                        initialToDate={initalValues.tilDato ? new Date(initalValues.tilDato) : undefined}
                    />
                </div>
                <HiddenIfInput
                    hidden={brukeStillingerIUken}
                    disabled={avtalt}
                    label="Antall søknader i perioden *"
                    {...state.fields.antallStillingerSokes}
                />
                <HiddenIfInput
                    hidden={!brukeStillingerIUken}
                    disabled={avtalt}
                    label="Antall søknader i uken *"
                    {...state.fields.antallStillingerIUken}
                />
                <Textarea
                    disabled={avtalt}
                    label="Oppfølging fra NAV"
                    maxLength={255}
                    {...state.fields.avtaleOppfolging}
                />
                <Textarea disabled={avtalt} label="Beskrivelse" maxLength={5000} {...state.fields.beskrivelse} />
                {state.submittoken ? <FormErrorSummary errors={{ ...state.errors }} /> : null}
            </div>
            <LagreAktivitet />
        </form>
    );
}

declare const window: {
    appconfig: AppConfig;
};

SokeAvtaleAktivitetForm.propTypes = {
    aktivitet: AppPT.aktivitet,
    onSubmit: PT.func.isRequired,
    isDirtyRef: PT.shape({ current: PT.bool }),
    endre: PT.bool,
};

SokeAvtaleAktivitetForm.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: undefined,
    endre: false,
};
