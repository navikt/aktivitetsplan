import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject, useState } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SokeavtaleAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import { DateRange } from '../../../../felles-komponenter/skjema/datovelger/PartialDateRangePicker';
import { useErVeileder } from '../../../../Provider';
import Malverk from '../../../malverk/malverk';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

const numberErrorMessage = {
    required_error: 'Antall stillinger må fylles ut',
    invalid_type_error: 'Antall stillinger må fylles ut',
};

const commonFields = {
    tittel: z.string(),
    fraDato: z.date({ required_error: 'Fra dato må fylles ut' }),
    tilDato: z.date({ required_error: 'Til dato må fylles ut' }),
    avtaleOppfolging: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional(),
};

const GammelSokeAvtaleFormValues = z.object({
    ...commonFields,
    skjemaVersjon: z.literal('gammel' as const),
    antallStillingerSokes: z.number(numberErrorMessage).lt(100, 'Antall søknader må ikke være høyere enn 99'),
});
type GammelSokeavtaleAktivitetFormValues = z.infer<typeof GammelSokeAvtaleFormValues>;
const NySokeAvtaleFormValues = z.object({
    ...commonFields,
    skjemaVersjon: z.literal('ny' as const),
    antallStillingerIUken: z.number(numberErrorMessage).lt(100, 'Antall søknader må ikke være høyere enn 99'),
});
type NySokeavtaleAktivitetFormValues = z.infer<typeof NySokeAvtaleFormValues>;
const SokeAvtaleFormValues = z.discriminatedUnion('skjemaVersjon', [
    GammelSokeAvtaleFormValues,
    NySokeAvtaleFormValues,
]);

export type SokeavtaleAktivitetFormValues = z.infer<typeof SokeAvtaleFormValues>;

interface Props {
    onSubmit: (values: SokeavtaleAktivitetFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: SokeavtaleAktivitet;
    // onChangeInitialValues: (initialValues?: InitalValues) => void;
    // initialValues?: InitalValues;
}

const getDefaultValues = (aktivitet: SokeavtaleAktivitet | undefined): Partial<SokeavtaleAktivitetFormValues> => {
    const brukeStillingerIUken = aktivitet ? !!aktivitet.antallStillingerIUken : true;
    const basevalues = {
        tittel: aktivitet?.tittel || 'Avtale om å søke jobber',
        fraDato: aktivitet?.fraDato ? new Date(aktivitet.fraDato) : undefined,
        tilDato: aktivitet?.tilDato ? new Date(aktivitet.tilDato) : undefined,
        avtaleOppfolging: aktivitet?.avtaleOppfolging || '',
        beskrivelse: aktivitet?.beskrivelse || '',
    };
    if (brukeStillingerIUken) {
        return {
            skjemaVersjon: 'ny',
            ...basevalues,
            antallStillingerIUken: aktivitet?.antallStillingerIUken ?? undefined,
        };
    } else {
        return {
            skjemaVersjon: 'gammel',
            ...basevalues,
            antallStillingerSokes: aktivitet?.antallStillingerSokes ?? undefined,
        };
    }
};

const SokeAvtaleAktivitetForm = (props: Props) => {
    const { aktivitet, dirtyRef, onSubmit } = props;

    const erVeileder = useErVeileder();

    const brukeStillingerIUken = aktivitet ? !!aktivitet.antallStillingerIUken : true;

    const defaultValues = getDefaultValues(aktivitet);
    const avtalt = aktivitet?.avtalt || false;
    const [defaultDateValues, setDefaultDateValues] = useState<Partial<DateRange> | undefined>({
        from: defaultValues.fraDato,
        to: defaultValues?.tilDato,
    });

    const formHandlers = useForm<SokeavtaleAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(SokeAvtaleFormValues),
        shouldFocusError: false,
    });
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors: formStateErrors, isDirty, isSubmitting },
    } = formHandlers;

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const errorWrapper = brukeStillingerIUken
        ? { errors: formStateErrors as FieldErrors<NySokeavtaleAktivitetFormValues>, skjemaVersjon: 'ny' as const }
        : {
              errors: formStateErrors as FieldErrors<GammelSokeavtaleAktivitetFormValues>,
              skjemaVersjon: 'gammel' as const,
          };

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work
    const avtaleOppfolging = watch('avtaleOppfolging'); // for <Textarea /> character-count to work

    const onMalChange = (newInitalValues: any) => {
        if (!newInitalValues) {
            setDefaultDateValues(undefined);
            reset();
        } else {
            Object.entries(newInitalValues).forEach(([name, value]: [any, any]) => {
                if (['fraDato', 'tilDato'].includes(name)) setValue(name, new Date(value));
                else setValue(name, value);
            });
            setDefaultDateValues({
                from: new Date(newInitalValues['fraDato']),
                to: new Date(newInitalValues['tilDato']),
            });
        }
    };

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <FormProvider {...formHandlers}>
                <div className="space-y-8">
                    <AktivitetFormHeader
                        tittel="Avtale om å søke jobber"
                        aktivitetstype={VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE}
                    />
                    <Malverk visible={erVeileder} endre={!!aktivitet} onChange={onMalChange} type="SOKEAVTALE" />
                    <div className="dato-container">
                        <MaybeAvtaltDateRangePicker
                            aktivitet={aktivitet}
                            from={{ name: 'fraDato', required: true, defaultValue: defaultDateValues?.from }}
                            to={{ name: 'tilDato', required: true, defaultValue: defaultDateValues?.to }}
                        />
                    </div>
                    {errorWrapper.skjemaVersjon === 'ny' ? (
                        <TextField
                            disabled={avtalt}
                            type="number"
                            label="Antall søknader i uken (obligatorisk)"
                            id={'antallStillingerIUken'}
                            {...register('antallStillingerIUken', {
                                valueAsNumber: true,
                            })}
                            error={
                                errorWrapper.errors.antallStillingerIUken &&
                                errorWrapper.errors.antallStillingerIUken.message
                            }
                        />
                    ) : (
                        <TextField
                            disabled={avtalt}
                            type="number"
                            label="Antall søknader i perioden (obligatorisk)"
                            id={'antallStillingerSokes'}
                            {...register('antallStillingerSokes', {
                                valueAsNumber: true,
                            })}
                            error={
                                errorWrapper.errors.antallStillingerSokes &&
                                errorWrapper.errors.antallStillingerSokes.message
                            }
                        />
                    )}
                    <Textarea
                        disabled={avtalt}
                        label="Oppfølging fra NAV (valgfri)"
                        maxLength={255}
                        {...register('avtaleOppfolging')}
                        error={errorWrapper.errors.avtaleOppfolging && errorWrapper.errors.avtaleOppfolging.message}
                        value={avtaleOppfolging}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Beskrivelse (valgfri)"
                        maxLength={5000}
                        {...register('beskrivelse')}
                        error={errorWrapper.errors.beskrivelse && errorWrapper.errors.beskrivelse.message}
                        value={beskrivelseValue}
                    />
                    <CustomErrorSummary errors={errorWrapper.errors} />
                    <LagreAktivitetKnapp loading={isSubmitting} />
                </div>
            </FormProvider>
        </form>
    );
};

export default SokeAvtaleAktivitetForm;
