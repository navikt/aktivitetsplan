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

interface SubmitProps {
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

export type Handler = SubmitHandler<SubmitProps>;

interface DirtyRef {
    current: boolean;
}

interface Props {
    aktivitet: Aktivitet;
    isDirtyRef: DirtyRef;
    onSubmit: Handler;
}

const BehandlingAktivitetForm = (props: Props) => {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const validator = useFormstate({
        tittel: () => '',
        behandlingType: (val, values, aktivitet) => validateBehandlingType(erAvtalt(aktivitet as Aktivitet), val),
        behandlingSted: (val, values, aktivitet) => validateBehandlingSted(erAvtalt(aktivitet as Aktivitet), val),
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet as Aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validateTilDato(aktivitet.fraDato, val),
        effekt: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet as Aktivitet), val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(erAvtalt(aktivitet as Aktivitet), val),
        behandlingOppfolging: (val, values, aktivitet) => validateFeltForLangt(erAvtalt(aktivitet as Aktivitet), val),
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
                        <DatoField
                            disabled={avtalt}
                            label="Fra dato *"
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

export default BehandlingAktivitetForm;
