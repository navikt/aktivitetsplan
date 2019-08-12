import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import { EGEN_AKTIVITET_TYPE } from '../../../../constant';
import LagreAktivitet from '../lagre-aktivitet';
import AktivitetFormHeader from '../aktivitet-form-header';
import Malverk from '../../../malverk/malverk';
import * as AppPT from '../../../../proptypes';
import {
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateLenke,
    validateTilDato,
    validateTittel,
} from './validate';
import Input from '../../../../felles-komponenter/skjema/input-v2/input';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/periode-valideringv2';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelgerv2';
import Textarea from '../../../../felles-komponenter/skjema/input-v2/textarea';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';

function EgenAktivitetForm(props) {
    const { onSubmit, aktivitet, isDirtyRef, endre } = props;
    const maybeAktivitet = aktivitet || {};

    const erAvtalt = maybeAktivitet.avtalt === true;

    const validator = useFormstate({
        tittel: val => validateTittel(erAvtalt, val),
        fraDato: val => validateFraDato(erAvtalt, maybeAktivitet.tilDato, val),
        tilDato: val => validateTilDato(maybeAktivitet.fraDato, val),
        periodeValidering: (val, values) =>
            validerPeriodeFelt(values.fraDato, values.tilDato),
        hensikt: val => validateFeltForLangt(erAvtalt, val),
        beskrivelse: val => validateBeskrivelse(erAvtalt, val),
        oppfolging: val => validateFeltForLangt(erAvtalt, val),
        lenke: val => validateLenke(erAvtalt, val),
    });

    const defaultFormValues = {
        tittel: maybeAktivitet.tittel || '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        periodeValidering: '',
        hensikt: maybeAktivitet.hensikt || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        oppfolging: maybeAktivitet.oppfolging || '',
        lenke: maybeAktivitet.lenke || '',
    };

    const state = validator(defaultFormValues);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const reinitalize = newInitalValues =>
        state.reinitialize({ ...defaultFormValues, ...newInitalValues });

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)}>
            <div className="aktivitetskjema">
                <FormErrorSummary
                    submittoken={state.submittoken}
                    errors={state.errors}
                />

                <AktivitetFormHeader
                    tittelId="egen-aktivitet-form.header"
                    pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                    ingressType={EGEN_AKTIVITET_TYPE}
                />

                <Malverk
                    visible={window.appconfig.VIS_MALER}
                    endre={endre}
                    onChange={reinitalize}
                    type="EGEN"
                />

                <Input
                    disabled={erAvtalt}
                    label="Navn på aktiviteten *"
                    {...state.fields.tittel}
                />

                <PeriodeValidering
                    valideringFelt={state.fields.periodeValidering}
                >
                    <div className="dato-container">
                        <DatoField
                            disabled={erAvtalt}
                            label="Fra dato *"
                            {...state.fields.fraDato}
                        />
                        <DatoField
                            label="Til dato *"
                            {...state.fields.tilDato}
                        />
                    </div>
                </PeriodeValidering>

                <Input
                    disabled={erAvtalt}
                    label="Mål med aktiviteten"
                    {...state.fields.hensikt}
                />
                <Textarea
                    disabled={erAvtalt}
                    label="Kort beskrivelse av aktiviteten"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
                <Input
                    disabled={erAvtalt}
                    label="Min huskeliste for denne aktiviteten"
                    {...state.fields.oppfolging}
                />
                <Input
                    disabled={erAvtalt}
                    label="Lenke til en aktuell nettside"
                    {...state.fields.lenke}
                />
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
