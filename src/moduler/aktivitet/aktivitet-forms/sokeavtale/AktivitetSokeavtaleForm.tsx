import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { TextField, Textarea, Select } from '@navikt/ds-react';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SokeavtaleAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { DateRange } from '../../../../felles-komponenter/skjema/datovelger/common';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

const numberErrorMessage = {
    required_error: 'Antall stillinger må fylles ut',
    invalid_type_error: 'Antall stillinger må fylles ut',
};

enum Mal {
    'SØKEAVTALE' = 'SOKEAVTALE',
    'EGEN' = 'EGEN',
}

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

export type SokeavtaleAktivitetFormValues = z.infer<typeof SokeAvtaleFormValues> & { mal: Mal };

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
        mal: Mal.EGEN,
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
            antallStillingerIUken: aktivitet?.antallStillingerIUken || 0,
        };
    } else {
        return {
            skjemaVersjon: 'gammel',
            ...basevalues,
            antallStillingerSokes: aktivitet?.antallStillingerSokes || 0,
        };
    }
};

const beskrivelseTekst = (antallStillinger: number) =>
    `NAV forventer at du søker omtrent ${antallStillinger} stillinger i uken.\nDet er viktig at du søker på de jobbene du mener du er kvalifisert for. Det er også viktig å søke på mange stillinger, det øker sjansene dine til å finne en jobb.`;

const SokeAvtaleAktivitetForm = (props: Props) => {
    const { aktivitet, dirtyRef, onSubmit } = props;
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
        formState: { errors: formStateErrors, isDirty, isSubmitting, touchedFields },
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

    const mal = watch('mal');
    const antallStillinger = watch('antallStillingerIUken');
    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work
    const avtaleOppfolging = watch('avtaleOppfolging'); // for <Textarea /> character-count to work

    useEffect(() => {
        if (mal === Mal.EGEN) {
            setDefaultDateValues(undefined);
            setValue('mal', Mal.EGEN);
            reset();
        } else if (mal === Mal.SØKEAVTALE && !aktivitet) {
            if (!aktivitet) {
                setDefaultDateValues({ from: new Date(), to: new Date() });
            }
        }
    }, [mal]);

    useEffect(() => {
        if (!touchedFields.beskrivelse && mal == Mal.SØKEAVTALE) {
            const nyBeskrivelse = antallStillinger > 0 ? beskrivelseTekst(antallStillinger) : '';
            setValue('beskrivelse', nyBeskrivelse);
        }
    }, [antallStillinger]);

    const onMalChange = (newInitalValues: any) => {
        console.log('NewInitial', newInitalValues);
        if (!newInitalValues) {
            setDefaultDateValues(undefined);
            reset();
        } else {
            console.log('ObjectEntries', newInitalValues);
            Object.entries(newInitalValues).forEach(([name, value]: [any, any]) => {
                if (['fraDato', 'tilDato'].includes(name)) setValue(name, new Date(value));
                else if (name === 'beskrivelse') setValue(name, '');
                else if (name === 'antallStillingerIUken') setValue('antallStillingerIUken', 0);
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
                    <AktivitetFormHeader aktivitetstype={VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE} />
                    <Select label="Ferdig utfylt aktivitet" {...register('mal')}>
                        <option value={Mal.EGEN}>Ingen ferdig utfylt aktivitet valgt</option>
                        <option value={Mal.SØKEAVTALE}>Avtale om å søke jobber</option>
                    </Select>
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
