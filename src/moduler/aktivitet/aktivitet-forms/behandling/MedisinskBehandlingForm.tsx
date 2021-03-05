import useFormstate, { SubmitHandler } from '@nutgaard/use-formstate';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';

import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/periode-validering';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../lagre-aktivitet';
import {
    validateBehandlingSted,
    validateBehandlingType,
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateTilDato,
} from './validate';

const erAvtalt = (aktivitet: Aktivitet) => {
    return aktivitet.avtalt === true;
};

interface AktivitetProps {
    tittel: string;
    behandlingType: string;
    behandlingSted: string;
    fraDato: string;
    tilDato: string;
    effekt: string;
    beskrivelse: string;
    behandlingOppfolging: string;
    periodeValidering: string;
}

export type Handler = SubmitHandler<AktivitetProps>;

interface DirtyRef {
    current: boolean;
}

interface Props {
    aktivitet: Aktivitet;
    isDirtyRef: DirtyRef;
    onSubmit: Handler;
}

export const MedisinskBehandlingForm = (props: Props) => {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const validator = useFormstate<AktivitetProps, Aktivitet>({
        tittel: () => '',
        behandlingType: (val, values, aktivitet) => validateBehandlingType(erAvtalt(aktivitet), val),
        behandlingSted: (val, values, aktivitet) => validateBehandlingSted(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet: Aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet: Aktivitet) => validateTilDato(aktivitet.fraDato, val),
        effekt: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet), val),
        behandlingOppfolging: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet), val),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
    });

    const maybeAktivitet = aktivitet || {};
    const avtalt = maybeAktivitet.avtalt === true;

    const initalValues = {
        tittel: maybeAktivitet.tittel || 'Medisinsk behandling',
        behandlingType: maybeAktivitet.behandlingType || '',
        behandlingSted: maybeAktivitet.behandlingSted || '',
        periodeValidering: '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        effekt: maybeAktivitet.effekt || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        behandlingOppfolging: maybeAktivitet.behandlingOppfolging || '',
    };

    const state = validator(initalValues, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }
    return (
        <form onSubmit={state.onSubmit(onSubmit)} autoComplete="off" noValidate>
            <SkjemaGruppe className="aktivitetskjema">
                <AktivitetFormHeader tittel="Medisinsk behandling" aktivitetsType={BEHANDLING_AKTIVITET_TYPE} />

                <Input disabled={avtalt} label="Type behandling *" {...state.fields.behandlingType} />
                <Input disabled={avtalt} label="Behandlingssted *" {...state.fields.behandlingSted} />

                <PeriodeValidering valideringFelt={state.fields.periodeValidering}>
                    <div className="dato-container">
                        <DatoField disabled={avtalt} label="Fra dato *" {...state.fields.fraDato} required />
                        <DatoField label="Til dato *" {...state.fields.tilDato} required />
                    </div>
                </PeriodeValidering>

                <Input disabled={avtalt} label="Mål for behandlingen" {...state.fields.effekt} />
                <Input disabled={avtalt} label="Oppfølging fra NAV" {...state.fields.behandlingOppfolging} />
                <Textarea
                    disabled={avtalt}
                    label="Kort beskrivelse av behandlingen"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
                <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            </SkjemaGruppe>
            <LagreAktivitet />
        </form>
    );
};

export default MedisinskBehandlingForm;
