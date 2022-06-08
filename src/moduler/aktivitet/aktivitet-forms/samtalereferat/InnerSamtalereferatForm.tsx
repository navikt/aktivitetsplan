import useFormstate from '@nutgaard/use-formstate';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';

import { SAMTALEREFERAT_TYPE, STATUS_GJENNOMFOERT, TELEFON_KANAL } from '../../../../constant';
import { SamtalereferatAktivitet } from '../../../../datatypes/aktivitetTypes';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/Datovelger';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import Input from '../../../../felles-komponenter/skjema/input/Input';
import Textarea from '../../../../felles-komponenter/skjema/input/Textarea';
import { todayIsoString } from '../../../../utils/dateUtils';
import AktivitetFormHeader from '../aktivitet-form-header';
import VelgKanal from '../VelgKanal';
import { useReferatStartTekst } from './useReferatStartTekst';
import { validateFraDato, validateKanal, validateReferat, validateTittel } from './validate';

interface Props {
    aktivitet?: SamtalereferatAktivitet;
    onSubmit: (data: { status: string; avtalt: boolean }) => Promise<any>;
    isDirtyRef?: { current: boolean };
}

type SamtalereferatInputProps = { tittel: string; fraDato: string; kanal: string; referat: string };

const InnerSamtalereferatForm = (props: Props) => {
    const { aktivitet, onSubmit, isDirtyRef = undefined } = props;
    const startTekst = useReferatStartTekst();
    const nyAktivitet = !aktivitet;
    const validator = useFormstate<SamtalereferatInputProps>({
        tittel: validateTittel,
        fraDato: validateFraDato,
        kanal: validateKanal,
        referat: validateReferat,
    });

    const state = validator(
        aktivitet
            ? {
                  tittel: aktivitet.tittel,
                  fraDato: aktivitet.fraDato ? aktivitet.fraDato : '',
                  kanal: aktivitet.kanal as string,
                  referat: aktivitet.referat ? aktivitet.referat : '',
              }
            : {
                  tittel: '',
                  fraDato: todayIsoString(),
                  kanal: TELEFON_KANAL,
                  referat: startTekst,
              }
    );

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    const lagreOgDel = state.onSubmit((values) => {
        const newValues = {
            ...values,
            status: STATUS_GJENNOMFOERT,
            erReferatPublisert: true,
            avtalt: false,
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
                    avtalt: false,
                });
            })}
            noValidate
        >
            <SkjemaGruppe className="aktivitetskjema">
                <AktivitetFormHeader tittel="Samtalereferat" aktivitetsType={SAMTALEREFERAT_TYPE} />

                <Input label="Tema for samtalen *" {...state.fields.tittel} />

                <DatoField label="Dato *" {...state.fields.fraDato} required />

                <VelgKanal label="Møteform *" {...state.fields.kanal} />

                {nyAktivitet && (
                    <Textarea
                        label="Samtalereferat *"
                        placeholder="Skriv her"
                        maxLength={5000}
                        visTellerFra={500}
                        required
                        {...state.fields.referat}
                    />
                )}

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
};

export default InnerSamtalereferatForm;
