import useFormstate from '@nutgaard/use-formstate';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import PT from 'prop-types';
import React from 'react';

import { SAMTALEREFERAT_TYPE, STATUS_GJENNOMFOERT, TELEFON_KANAL } from '../../../../constant';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import { todayIsoString } from '../../../../utils';
import AktivitetFormHeader from '../aktivitet-form-header';
import VelgKanal from '../VelgKanal';
import { validateFraDato, validateKanal, validateReferat, validateTittel } from './validate';

function SamtalereferatForm(props) {
    const { onSubmit, isDirtyRef } = props;

    const validator = useFormstate({
        tittel: validateTittel,
        fraDato: validateFraDato,
        kanal: validateKanal,
        referat: validateReferat,
    });

    const state = validator({
        tittel: '',
        fraDato: todayIsoString(),
        kanal: TELEFON_KANAL,
        referat: '',
    });

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const lagreOgDel = state.onSubmit((values) => {
        const newValues = {
            ...values,
            status: STATUS_GJENNOMFOERT,
            erReferatPublisert: true,
            avtalt: true,
        };
        return onSubmit(newValues);
    });

    return (
        <form
            autoComplete="off"
            onSubmit={state.onSubmit((data) => {
                return onSubmit({
                    ...data,
                    status: STATUS_GJENNOMFOERT,
                    avtalt: true,
                });
            })}
        >
            <SkjemaGruppe className="aktivitetskjema">
                <AktivitetFormHeader tittel="Samtalereferat" aktivitetsType={SAMTALEREFERAT_TYPE} />

                <Input label="Tema for samtalen *" {...state.fields.tittel} />

                <DatoField label="Dato *" {...state.fields.fraDato} required />

                <VelgKanal label="Møteform *" {...state.fields.kanal} />

                <Textarea
                    label="Samtalereferat *"
                    placeholder="Skriv her"
                    maxLength={5000}
                    visTellerFra={500}
                    required
                    {...state.fields.referat}
                />
                <FormErrorSummary submittoken={state.submittoken} errors={state.errors} />
            </SkjemaGruppe>
            <div className="aktivitetskjema__lagre-knapp">
                <Hovedknapp
                    kompakt
                    spinner={state.submitting}
                    autoDisableVedSpinner
                    onClick={lagreOgDel}
                    className="samtalereferat-form__lagre-og-publiser"
                >
                    Del med bruker
                </Hovedknapp>
                <Knapp kompakt spinner={state.submitting} autoDisableVedSpinner>
                    Lagre utkast
                </Knapp>
            </div>
        </form>
    );
}

SamtalereferatForm.defaultProps = {
    isDirtyRef: undefined,
};

SamtalereferatForm.propTypes = {
    onSubmit: PT.func.isRequired,
    isDirtyRef: PT.shape({ current: PT.bool }),
};

export default SamtalereferatForm;
