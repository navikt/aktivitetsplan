import useFormstate from '@nutgaard/use-formstate';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import PT from 'prop-types';
import React from 'react';

import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
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
import { validateBeskrivelse, validateFeltForLangt, validateFraDato, validateLenke, validateTittel } from './validate';
import { todayIsoString } from '../../../../utils/dateUtils';

function erAvtalt(aktivitet) {
    return aktivitet.avtalt === true;
}

function StillingAktivitetForm(props) {
    const { onSubmit, isDirtyRef, aktivitet } = props;

    const validator = useFormstate({
        tittel: (val, values, aktivitet) => validateTittel(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validerDato(val, null, aktivitet.fraDato),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
        arbeidssted: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        arbeidsgiver: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        kontaktperson: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        lenke: (val, values, aktivitet) => validateLenke(erAvtalt(aktivitet), val),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
    });

    const maybeAktivitet = aktivitet || {};
    const avtalt = maybeAktivitet.avtalt === true;

    const initalValues = {
        tittel: maybeAktivitet.tittel || '',
        fraDato: maybeAktivitet.fraDato || todayIsoString(),
        tilDato: maybeAktivitet.tilDato || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        arbeidssted: maybeAktivitet.arbeidssted || '',
        arbeidsgiver: maybeAktivitet.arbeidsgiver || '',
        kontaktperson: maybeAktivitet.kontaktperson || '',
        lenke: maybeAktivitet.lenke || '',
        periodeValidering: '',
    };

    const state = validator(initalValues, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <SkjemaGruppe className="aktivitetskjema" tag="div">
                <AktivitetFormHeader tittel="En jobb jeg vil søke på" aktivitetsType={STILLING_AKTIVITET_TYPE} />

                <Input disabled={avtalt} label="Stillingstittel *" {...state.fields.tittel} required />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        <DatoField
                            disabled={avtalt}
                            label="Fra dato *"
                            senesteTom={maybeAktivitet.tilDato}
                            required
                            {...state.fields.fraDato}
                        />
                        <DatoField label="Frist" tidligsteFom={maybeAktivitet.fraDato} {...state.fields.tilDato} />
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
            </SkjemaGruppe>
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
