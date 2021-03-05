import useFormstate from '@nutgaard/use-formstate';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import PT from 'prop-types';
import React from 'react';

import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/periode-validering';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import * as AppPT from '../../../../proptypes';
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

function erAvtalt(aktivitet) {
    return aktivitet.avtalt === true;
}

function AktivitetBehandlingFormGammel(props) {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const validator = useFormstate({
        tittel: () => {},
        behandlingType: (val, values, aktivitet) => validateBehandlingType(erAvtalt(aktivitet), val),
        behandlingSted: (val, values, aktivitet) => validateBehandlingSted(erAvtalt(aktivitet), val),
        fraDato: (val, values, aktivitet) => validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
        tilDato: (val, values, aktivitet) => validateTilDato(aktivitet.fraDato, val),
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
}

AktivitetBehandlingFormGammel.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: undefined,
};

AktivitetBehandlingFormGammel.propTypes = {
    onSubmit: PT.func.isRequired,
    aktivitet: AppPT.aktivitet,
    isDirtyRef: PT.shape({ current: PT.bool }),
};

export default AktivitetBehandlingFormGammel;
