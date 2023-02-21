import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import { parseISO } from 'date-fns';
import { DatepickerDateRange } from 'nav-datovelger';
import PT from 'prop-types';
import React, { useState } from 'react';

import { AppConfig } from '../../../../app';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
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
    validateRange,
} from './validate';

function erAvtalt(aktivitet: any) {
    return aktivitet.avtalt === true;
}

export default function SokeAvtaleAktivitetForm(props: any) {
    const { onSubmit, aktivitet, isDirtyRef, endre } = props;

    const [rangeError, setRangeError] = useState({ from: undefined, to: undefined });

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

    // const state = validator(initalValues, aktivitet);
    const state = validator(initalValues);

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } = UNSAFE_useRangeDatepicker({
        defaultSelected: {
            from: maybeAktivitet.fraDato ? new Date(maybeAktivitet.fraDato) : undefined,
            to: maybeAktivitet.tilDato ? new Date(maybeAktivitet.tilDato) : undefined,
        },
        onValidate: (val) => {
            // console.log({ onValidate: val });
            setRangeError(validateRange(val) as any);
        },
        onRangeChange: (val) => {
            // console.log({ range: val, fromInputProps, toInputProps });
            // console.log(maybeAktivitet.fraDato);
            // console.log(val);
            // console.log(parseISO(fromInputProps.value as any));
        },
    });

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const reinitalize = (newInitalValues: any) => {
        state.reinitialize({ ...initalValues, ...newInitalValues });
    };

    const brukeStillingerIUken = !state.fields.antallStillingerSokes.initialValue;

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
                    <UNSAFE_DatePicker {...datepickerProps} disabled={[{ before: new Date(maybeAktivitet.fraDato) }]}>
                        <div className="flex flex-wrap justify-center gap-4 items-start">
                            <UNSAFE_DatePicker.Input
                                {...fromInputProps}
                                disabled={avtalt}
                                label="Fra dato *"
                                error={!!rangeError.from && rangeError.from}
                                id="fraDato"
                            />
                            <UNSAFE_DatePicker.Input
                                {...toInputProps}
                                label="Til dato *"
                                error={!!rangeError.to && rangeError.to}
                                id="tilDato"
                            />
                        </div>
                    </UNSAFE_DatePicker>
                    {/*{selectedRange && (*/}
                    {/*    <div className="pt-4">*/}
                    {/*        <div>{selectedRange?.from && selectedRange.from.toDateString()}</div>*/}
                    {/*        <div>{selectedRange?.to && selectedRange.to.toDateString()}</div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
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
