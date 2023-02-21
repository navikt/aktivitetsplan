import useFormstate from '@nutgaard/use-formstate';
import PT from 'prop-types';
import React, { useState } from 'react';

import { AppConfig } from '../../../../app';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import DateRangePicker from '../../../../felles-komponenter/skjema/datovelger/DateRangePicker';
import PartialDateRangePicker, {
    DateRange,
    DateRangeValidation,
    getErrorMessage,
    getErrorMessageForDate,
} from '../../../../felles-komponenter/skjema/datovelger/PartialDateRangePicker';
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
    validateOppfolging,
} from './validate';

function erAvtalt(aktivitet: any) {
    return aktivitet.avtalt === true;
}

const parseDate = (val: string | undefined) => {
    if (!val) return undefined;
    return new Date(val);
};

export default function SokeAvtaleAktivitetForm(props: any) {
    const { onSubmit, aktivitet, isDirtyRef, endre } = props;

    const [dateRange, setDateRange] = useState<Partial<DateRange> | undefined>({
        from: parseDate(aktivitet?.fraDato) ?? new Date(),
        to: parseDate(aktivitet?.tilDato),
    });
    const [rangeError, setRangeError] = useState<{ from: string | undefined; to: string | undefined }>({
        to: undefined,
        from: undefined,
    });

    const validator = useFormstate({
        tittel: () => undefined,
        antallStillingerIUken: (val, values, aktivitet) =>
            validateAntallStillingerIUken(erAvtalt(aktivitet), val, values.antallStillingerSokes),
        antallStillingerSokes: (val, values, aktivitet) => validateAntallStillinger(erAvtalt(aktivitet), val),
        avtaleOppfolging: (val, values, aktivitet) => validateOppfolging(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
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
    };

    const state = validator(initalValues);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const reinitalize = (newInitalValues: any) => {
        state.reinitialize({ ...initalValues, ...newInitalValues });
    };

    const brukeStillingerIUken = !state.fields.antallStillingerSokes.initialValue;
    const validateDateRange = (val: DateRangeValidation) => {
        const error = getErrorMessage(val);
        if (error) {
            setRangeError(error);
        }
    };

    return (
        <form
            autoComplete="off"
            onSubmit={() => {
                console.log(onSubmit);
                state.onSubmit(onSubmit);
            }}
            noValidate
        >
            <div className="skjema-innlogget aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Avtale om å søke jobber" aktivitetsType={SOKEAVTALE_AKTIVITET_TYPE} />

                <Malverk visible={window.appconfig.VIS_MALER} endre={endre} onChange={reinitalize} type="SOKEAVTALE" />

                <div className="dato-container">
                    {aktivitet?.avtalt === true && aktivitet?.fraDato ? (
                        <PartialDateRangePicker
                            error={rangeError}
                            onValidate={(val) => {
                                const error = getErrorMessageForDate(val);
                                if (error) setRangeError({ from: undefined, to: error });
                            }}
                            onChange={(toDate) => {
                                setDateRange({
                                    ...dateRange,
                                    to: toDate,
                                });
                            }}
                            from={parseDate(aktivitet.fraDato)!!}
                        />
                    ) : (
                        <DateRangePicker
                            error={rangeError}
                            onValidate={validateDateRange}
                            value={dateRange}
                            onChange={setDateRange}
                        />
                    )}
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
                    visTellerFra={100}
                    {...state.fields.avtaleOppfolging}
                />
                <Textarea
                    disabled={avtalt}
                    label="Beskrivelse"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
                {/*<FormErrorSummary submittoken={state.submittoken} errors={state.errors} />*/}
                <FormErrorSummary submittoken={state.submittoken} errors={{ ...state.errors, ...rangeError }} />
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
