import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import LagreAktivitet from '../lagre-aktivitet';
import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import AktivitetFormHeader from '../aktivitet-form-header';
import * as AppPT from '../../../../proptypes';
import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import {
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateLenke,
    validateTittel,
} from './validate';
import Input from '../../../../felles-komponenter/skjema/input-v2/input';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/periode-valideringv2';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelgerv2';
import Textarea from '../../../../felles-komponenter/skjema/input-v2/textarea';
import { todayIsoString } from '../../../../utils';

function StillingAktivitetForm(props) {
    const { onSubmit, isDirtyRef, aktivitet } = props;
    const maybeAktivitet = aktivitet || {};
    const erAvtalt = maybeAktivitet.avtalt === true;

    const validator = useFormstate({
        tittel: val => validateTittel(erAvtalt, val),
        fraDato: val => validateFraDato(erAvtalt, maybeAktivitet.tilDato, val),
        tilDato: val => validerDato(val, null, maybeAktivitet.fraDato),
        beskrivelse: val => validateBeskrivelse(erAvtalt, val),
        arbeidssted: val => validateFeltForLangt(erAvtalt, val),
        arbeidsgiver: val => validateFeltForLangt(erAvtalt, val),
        kontaktperson: val => validateFeltForLangt(erAvtalt, val),
        lenke: val => validateLenke(erAvtalt, val),
        periodeValidering: (val, values) =>
            validerPeriodeFelt(values.fraDato, values.tilDato),
    });

    const state = validator({
        tittel: maybeAktivitet.tittel || '',
        fraDato: maybeAktivitet.fraDato || todayIsoString(),
        tilDato: maybeAktivitet.tilDato || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        arbeidssted: maybeAktivitet.arbeidssted || '',
        arbeidsgiver: maybeAktivitet.arbeidsgiver || '',
        kontaktperson: maybeAktivitet.kontaktperson || '',
        lenke: maybeAktivitet.lenke || '',
        periodeValidering: '',
    });

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)}>
            <div className="aktivitetskjema">
                <FormErrorSummary
                    submittoken={state.submittoken}
                    errors={state.errors}
                />

                <AktivitetFormHeader
                    tittelId="stilling-aktivitet-form.header"
                    pakrevdInfoId="aktivitet-form.pakrevd-felt-info"
                    ingressType={STILLING_AKTIVITET_TYPE}
                />

                <Input
                    disabled={erAvtalt}
                    label="Stillingstittel *"
                    {...state.fields.tittel}
                />

                <PeriodeValidering
                    valideringFelt={state.fields.periodeValidering}
                >
                    <div className="dato-container">
                        <DatoField
                            disabled={erAvtalt}
                            label="Fra dato *"
                            senesteTom={maybeAktivitet.tilDato}
                            {...state.fields.fraDato}
                        />
                        <DatoField
                            label="Frist"
                            tidligsteFom={maybeAktivitet.fraDato}
                            {...state.fields.tilDato}
                        />
                    </div>
                </PeriodeValidering>
                <Input
                    disabled={erAvtalt}
                    label="Arbeidsgiver"
                    {...state.fields.arbeidsgiver}
                />
                <Input
                    disabled={erAvtalt}
                    label="Kontaktperson hos arbeidsgiver"
                    {...state.fields.kontaktperson}
                />
                <Input
                    disabled={erAvtalt}
                    label="Arbeidssted"
                    {...state.fields.arbeidssted}
                />
                <Textarea
                    disabled={erAvtalt}
                    label="Kort beskrivelse av stillingen"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
                <Input
                    disabled={erAvtalt}
                    label="Lenke til stillingsannonse"
                    {...state.fields.lenke}
                />
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
