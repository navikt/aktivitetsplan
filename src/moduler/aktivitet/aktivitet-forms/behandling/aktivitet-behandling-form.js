import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import LagreAktivitet from '../lagre-aktivitet';
import AktivitetFormHeader from '../aktivitet-form-header';
import * as AppPT from '../../../../proptypes';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/periode-validering';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';
import {
    validateBehandlingSted,
    validateBehandlingType,
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateTilDato,
} from './validate';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelger';

function BehandlingAktivitetForm(props) {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const maybeAktivitet = aktivitet || {};
    const erAvtalt = maybeAktivitet.avtalt === true;

    const validator = useFormstate({
        tittel: () => {},
        behandlingType: val => validateBehandlingType(erAvtalt, val),
        behandlingSted: val => validateBehandlingSted(erAvtalt, val),
        fraDato: val => validateFraDato(erAvtalt, maybeAktivitet.tilDato, val),
        tilDato: val => validateTilDato(maybeAktivitet.fraDato, val),
        effekt: val => validateFeltForLangt(erAvtalt, val),
        beskrivelse: val => validateBeskrivelse(erAvtalt, val),
        behandlingOppfolging: val => validateFeltForLangt(erAvtalt, val),
        periodeValidering: (val, values) =>
            validerPeriodeFelt(values.fraDato, values.tilDato),
    });

    const state = validator({
        tittel: maybeAktivitet.tittel || 'Medisinsk behandling',
        behandlingType: maybeAktivitet.behandlingType || '',
        behandlingSted: maybeAktivitet.behandlingSted || '',
        periodeValidering: '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        effekt: maybeAktivitet.effekt || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        behandlingOppfolging: maybeAktivitet.behandlingOppfolging || '',
    });

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form
            onSubmit={state.onSubmit(onSubmit)}
            noValidate="noValidate"
            autoComplete="off"
        >
            <div className="aktivitetskjema">
                <FormErrorSummary
                    errors={state.errors}
                    submittoken={state.submittoken}
                />

                <AktivitetFormHeader
                    tittel="Medisinsk behandling"
                    ingressType={BEHANDLING_AKTIVITET_TYPE}
                />

                <Input
                    disabled={erAvtalt}
                    label="Type behandling *"
                    {...state.fields.behandlingType}
                />
                <Input
                    disabled={erAvtalt}
                    label="Behandlingssted *"
                    {...state.fields.behandlingSted}
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
                            label="Til dato *"
                            tidligsteFom={maybeAktivitet.fraDato}
                            {...state.fields.tilDato}
                        />
                    </div>
                </PeriodeValidering>

                <Input
                    disabled={erAvtalt}
                    label="Mål for behandlingen"
                    {...state.fields.effekt}
                />
                <Input
                    disabled={erAvtalt}
                    label="Oppfølging fra NAV"
                    {...state.fields.behandlingOppfolging}
                />
                <Textarea
                    disabled={erAvtalt}
                    label="Kort beskrivelse av behandlingen"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
            </div>
            <LagreAktivitet />
        </form>
    );
}

BehandlingAktivitetForm.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: undefined,
};

BehandlingAktivitetForm.propTypes = {
    onSubmit: PT.func.isRequired,
    aktivitet: AppPT.aktivitet,
    isDirtyRef: PT.shape({ current: PT.bool }),
};

export default BehandlingAktivitetForm;
