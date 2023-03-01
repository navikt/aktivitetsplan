import { Button, UNSAFE_DatePicker as DatePicker, UNSAFE_useDatepicker as useDatepicker } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import React from 'react';

import { SAMTALEREFERAT_TYPE, STATUS_GJENNOMFOERT, TELEFON_KANAL } from '../../../../constant';
import { SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
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

    const initialValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: aktivitet?.fraDato ? aktivitet.fraDato : todayIsoString(),
        kanal: aktivitet?.kanal || TELEFON_KANAL,
        referat: aktivitet?.referat ? aktivitet.referat : startTekst,
    };

    const state = validator(initialValues);

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

    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: initialValues.fraDato ? new Date(initialValues.fraDato) : undefined,
        onDateChange: (date) => state.setValue('fraDato', date?.toISOString() || ''),
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
            <div className="aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Samtalereferat" aktivitetsType={SAMTALEREFERAT_TYPE} />

                <Input label="Tema for samtalen *" {...state.fields.tittel} />

                <DatePicker {...datepickerProps}>
                    <DatePicker.Input error={state.errors.fraDato} label="Dato *" {...inputProps} />
                </DatePicker>

                <VelgKanal label="Møteform *" {...state.fields.kanal} />

                {nyAktivitet && (
                    <Textarea
                        label="Samtalereferat *"
                        placeholder="Skriv her"
                        maxLength={5000}
                        required
                        {...state.fields.referat}
                    />
                )}
                {state.submittoken ? <FormErrorSummary errors={state.errors} /> : null}
            </div>
            <Lagreknapper isLoading={state.submitting} isNy={nyAktivitet} lagreOgDel={lagreOgDel} />
        </form>
    );
};

function Lagreknapper(props: { isLoading: boolean; isNy: boolean; lagreOgDel: (event: React.FormEvent) => void }) {
    const { isLoading, isNy, lagreOgDel } = props;
    if (isNy) {
        return (
            <div className="mt-4">
                <Button loading={isLoading} onClick={lagreOgDel} className="mr-4">
                    Del med bruker
                </Button>
                <Button variant="secondary" loading={isLoading}>
                    Lagre utkast
                </Button>
            </div>
        );
    }
    return (
        <Button className="mt-4" loading={isLoading}>
            Lagre
        </Button>
    );
}

export default InnerSamtalereferatForm;
