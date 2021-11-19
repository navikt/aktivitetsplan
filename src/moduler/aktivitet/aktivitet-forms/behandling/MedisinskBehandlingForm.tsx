import useFormstate, { SubmitHandler } from '@nutgaard/use-formstate';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';

import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import { Aktivitet, MedisinskBehandlingAktivitet } from '../../../../datatypes/aktivitetTypes';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/PeriodeValidering';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import { HiddenIfInput as Input } from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import { todayIsoString } from '../../../../utils/dateUtils';
import AktivitetFormHeader from '../aktivitet-form-header';
import LagreAktivitet from '../LagreAktivitet';
import {
    validateBehandlingSted,
    validateBehandlingType,
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateTilDato,
} from './validate';

type MedisinskBehandlingFormProps = {
    tittel: string;
    behandlingType: string;
    behandlingSted: string;
    fraDato: string;
    tilDato: string;
    effekt: string;
    beskrivelse: string;
    behandlingOppfolging: string;
};

//Det er anbefalt at man bruker type er pga en known issue i use-formstate
type ValideringsProps = MedisinskBehandlingFormProps & {
    periodeValidering: string;
};

export type Handler = SubmitHandler<ValideringsProps>;

interface DirtyRef {
    current: boolean;
}

interface Props {
    aktivitet?: MedisinskBehandlingAktivitet;
    isDirtyRef: DirtyRef;
    onSubmit: Handler;
}

const MedisinskBehandlingForm = (props: Props) => {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const validator = useFormstate<ValideringsProps, Aktivitet>({
        tittel: () => undefined,
        behandlingType: (val, values, aktivitet) => validateBehandlingType(aktivitet.avtalt, val),
        behandlingSted: (val, values, aktivitet) => validateBehandlingSted(aktivitet.avtalt, val),
        fraDato: (val, values, aktivitet: Aktivitet) => validateFraDato(aktivitet.avtalt, aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet: Aktivitet) => validateTilDato(aktivitet.fraDato, val),
        effekt: (val, values, aktivitet) => validateFeltForLangt(aktivitet.avtalt, val),
        beskrivelse: (val, values, aktivitet) => validateBeskrivelse(aktivitet.avtalt, val),
        behandlingOppfolging: (val, values, aktivitet) => validateFeltForLangt(aktivitet.avtalt, val),
        periodeValidering: (val, values) => validerPeriodeFelt(values.fraDato, values.tilDato),
    });

    const avtalt = !!aktivitet && aktivitet.avtalt;
    const maybeAktivitet: Partial<MedisinskBehandlingAktivitet> = aktivitet ? aktivitet : {};

    const initalValues: ValideringsProps = {
        tittel: maybeAktivitet.tittel ? maybeAktivitet.tittel : 'Medisinsk behandling',
        behandlingType: maybeAktivitet.behandlingType ? maybeAktivitet.behandlingType : '',
        behandlingSted: maybeAktivitet.behandlingSted ? maybeAktivitet.behandlingSted : '',
        fraDato: maybeAktivitet.fraDato ? maybeAktivitet.fraDato : todayIsoString(),
        tilDato: maybeAktivitet.tilDato ? maybeAktivitet.tilDato : '',
        effekt: maybeAktivitet.effekt ? maybeAktivitet.effekt : '',
        beskrivelse: maybeAktivitet.beskrivelse ? maybeAktivitet.beskrivelse : '',
        behandlingOppfolging: maybeAktivitet.behandlingOppfolging ? maybeAktivitet.behandlingOppfolging : '',
        periodeValidering: '',
    };

    const state = validator(initalValues, aktivitet ? aktivitet : ({} as MedisinskBehandlingAktivitet));

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
                <Input
                    disabled={avtalt}
                    label="Oppfølging fra NAV"
                    {...state.fields.behandlingOppfolging}
                    hidden={!aktivitet || !aktivitet.behandlingOppfolging}
                />
                <Textarea
                    disabled={avtalt}
                    label="Kort beskrivelse av behandlingen"
                    maxLength={400}
                    visTellerFra={200}
                    {...state.fields.beskrivelse}
                />
                <FormErrorSummary errors={state.errors} submittoken={state.submittoken} />
            </SkjemaGruppe>
            <LagreAktivitet />
        </form>
    );
};

export default MedisinskBehandlingForm;
