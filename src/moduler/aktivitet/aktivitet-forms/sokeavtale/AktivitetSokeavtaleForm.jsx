import useFormstate from '@nutgaard/use-formstate';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import PT from 'prop-types';
import React from 'react';

import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/PeriodeValidering';
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

function erAvtalt(aktivitet) {
    return aktivitet.avtalt === true;
}

export default function SokeAvtaleAktivitetForm(props) {
    const { onSubmit, aktivitet, isDirtyRef, endre } = props;

    const validator = useFormstate({
        tittel: () => null,
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validateTilDato(erAvtalt(aktivitet), aktivitet.fraDato, val),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
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
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        antallStillingerSokes: maybeAktivitet.antallStillingerSokes || '',
        antallStillingerIUken: maybeAktivitet.antallStillingerIUken || '',
        avtaleOppfolging: maybeAktivitet.avtaleOppfolging || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        periodeValidering: '',
    };

    const state = validator(initalValues, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const reinitalize = (newInitalValues) => {
        state.reinitialize({ ...initalValues, ...newInitalValues });
    };

    const brukeStillingerIUken = !state.fields.antallStillingerSokes.initialValue;

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <SkjemaGruppe className="skjema-innlogget aktivitetskjema">
                <AktivitetFormHeader tittel="Avtale om å søke jobber" aktivitetsType={SOKEAVTALE_AKTIVITET_TYPE} />

                <Malverk visible={window.appconfig.VIS_MALER} endre={endre} onChange={reinitalize} type="SOKEAVTALE" />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        <DatoField
                            label="Fra dato *"
                            disabled={avtalt}
                            senesteTom={maybeAktivitet.tilDato}
                            {...state.fields.fraDato}
                            required
                        />
                        <DatoField
                            label="Til dato *"
                            tidligsteFom={maybeAktivitet.fraDato}
                            {...state.fields.tilDato}
                            required
                        />
                    </div>
                </PeriodeValidering>

                <HiddenIfInput
                    hidden={brukeStillingerIUken}
                    disabled={avtalt}
                    label="Antall søknader i perioden *"
                    bredde="S"
                    {...state.fields.antallStillingerSokes}
                />

                <HiddenIfInput
                    hidden={!brukeStillingerIUken}
                    disabled={avtalt}
                    label="Antall søknader i uken *"
                    bredde="S"
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
                <FormErrorSummary submittoken={state.submittoken} errors={state.errors} />
            </SkjemaGruppe>
            <LagreAktivitet />
        </form>
    );
}

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
