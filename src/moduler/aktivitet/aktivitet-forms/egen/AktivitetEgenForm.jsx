import useFormstate from '@nutgaard/use-formstate';
import PT from 'prop-types';
import React from 'react';

import { EGEN_AKTIVITET_TYPE } from '../../../../constant';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
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

function erAvtalt(aktivitet) {
    return aktivitet.avtalt === true;
}

function EgenAktivitetForm(props) {
    const { onSubmit, aktivitet, isDirtyRef, endre } = props;

    const validator = useFormstate({
        tittel: (val, values, aktivitet) => validateTittel(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validateTilDato(aktivitet.fraDato, val),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
        hensikt: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
        oppfolging: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        lenke: (val, values, aktivitet) => validateLenke(erAvtalt(aktivitet), val),
    });

    const maybeAktivitet = aktivitet || {};

    const avtalt = maybeAktivitet.avtalt === true;

    const initalValues = {
        tittel: maybeAktivitet.tittel || '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        periodeValidering: '',
        hensikt: maybeAktivitet.hensikt || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        oppfolging: maybeAktivitet.oppfolging || '',
        lenke: maybeAktivitet.lenke || '',
    };

    const state = validator(initalValues, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const reinitalize = (newInitalValues) => state.reinitialize({ ...initalValues, ...newInitalValues });

    return (
        <form autoComplete="off" onSubmit={state.onSubmit(onSubmit)} noValidate>
            <div className="aktivitetskjema space-y-3">
                <AktivitetFormHeader tittel="Jobbrettet egenaktivitet" aktivitetsType={EGEN_AKTIVITET_TYPE} />

                <Malverk visible={window.appconfig.VIS_MALER} endre={endre} onChange={reinitalize} type="EGEN" />

                <Input disabled={avtalt} label="Navn på aktiviteten *" {...state.fields.tittel} />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        {/*<DatoField disabled={avtalt} label="Fra dato *" {...state.fields.fraDato} required />*/}
                        {/*<DatoField label="Til dato *" {...state.fields.tilDato} required />*/}
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
