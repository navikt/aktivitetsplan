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
    validateTittel,
} from './validate';
import Input from '../../../../felles-komponenter/skjema/input-v2/input';
import PeriodeValidering, {
    periodeErrors,
} from '../../../../felles-komponenter/skjema/field-group/periode-valideringv2';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelgerv2';
import Textarea from '../../../../felles-komponenter/skjema/input-v2/textarea';

function StillingAktivitetForm(props) {
    const { onSubmit, isDirtyRef, aktivitet } = props;
    const maybeAktivitet = aktivitet || {};
    const erAvtalt = maybeAktivitet.avtalt === true;

    const validator = useFormstate({
        tittel: val => erAvtalt || validateTittel(val),
        fraDato: val =>
            erAvtalt ||
            validateFraDato(val) ||
            validerDato(val, maybeAktivitet.tilDato, null),
        tilDato: val => validerDato(val, null, maybeAktivitet.fraDato),
        beskrivelse: val => erAvtalt || validateBeskrivelse(val),
        arbeidssted: val => erAvtalt || validateFeltForLangt(val),
        arbeidsgiver: val => erAvtalt || validateFeltForLangt(val),
        kontaktperson: val => erAvtalt || validateFeltForLangt(val),
        lenke: val => erAvtalt || validateBeskrivelse(val),
    });

    const state = validator({
        tittel: maybeAktivitet.tittel || '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        arbeidssted: maybeAktivitet.arbeidssted || '',
        arbeidsgiver: maybeAktivitet.arbeidsgiver || '',
        kontaktperson: maybeAktivitet.kontaktperson || '',
        lenke: maybeAktivitet.lenke || '',
    });

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const errors = {
        ...state.errors,
        ...periodeErrors(state.fields.fraDato, state.fields.tilDato),
    };

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)}>
            <div className="aktivitetskjema">
                <FormErrorSummary hidden={state.submittoken} errors={errors} />

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
                    fraDato={state.fields.fraDato}
                    tilDato={state.fields.tilDato}
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

                <Textarea
                    disabled={erAvtalt}
                    label="Kort beskrivelse av stillingen"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />

                <Input
                    disabled={erAvtalt}
                    label="Arbeidssted"
                    {...state.fields.arbeidssted}
                />
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
