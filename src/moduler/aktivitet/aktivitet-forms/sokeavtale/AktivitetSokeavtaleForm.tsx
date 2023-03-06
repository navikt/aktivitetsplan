import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import React from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppConfig } from '../../../../app';
import { SOKEAVTALE_AKTIVITET_TYPE } from '../../../../constant';
import { SokeavtaleAktivitet } from '../../../../datatypes/internAktivitetTypes';
import DateRangePicker from '../../../../felles-komponenter/skjema/datovelger/DateRangePicker';
import PartialDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/PartialDateRangePicker';
import Malverk from '../../../malverk/malverk';
import AktivitetFormHeader from '../aktivitet-form-header';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

declare const window: {
    appconfig: AppConfig;
};

const numberErrorMessage = {
    required_error: 'Antall stillinger må fylles ut',
    invalid_type_error: 'Antall stillinger må fylles ut',
};

const commonFields = {
    tittel: z.string(),
    fraDato: z.date().nullable().optional(),
    tilDato: z.date().nullable().optional(),
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

type SokeavtaleAktivitetFormValues = z.infer<typeof SokeAvtaleFormValues>;

interface Props {
    aktivitet?: SokeavtaleAktivitet;
    onSubmit: (values: SokeavtaleAktivitetFormValues) => Promise<void>;
}

const getDefaultValues = (aktivitet: SokeavtaleAktivitet | undefined): Partial<SokeavtaleAktivitetFormValues> => {
    const brukeStillingerIUken = !!aktivitet ? !!aktivitet.antallStillingerIUken : true;
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
            antallStillingerIUken: aktivitet?.antallStillingerIUken || undefined,
        };
    } else {
        return {
            skjemaVersjon: 'gammel',
            ...basevalues,
            antallStillingerSokes: aktivitet?.antallStillingerSokes || undefined,
        };
    }
};

const parseDate = (date: string | undefined): Date | undefined => {
    if (!date) return undefined;
    return new Date(date);
};

const noOp = () => {};

const valueAsDateOrUndefined = (value: string) => {
    if (!value) return undefined;
    return new Date(value);
};

const SokeAvtaleAktivitetForm = (props: Props) => {
    const { aktivitet, onSubmit } = props;
    const brukeStillingerIUken = !!aktivitet ? !!aktivitet.antallStillingerIUken : true;
    const defaultValues = getDefaultValues(aktivitet);
    const avtalt = aktivitet?.avtalt || false;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors: formStateErrors },
    } = useForm<SokeavtaleAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(SokeAvtaleFormValues),
        shouldFocusError: false,
    });

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
            reset();
        } else {
            Object.entries(newInitalValues).forEach(([name, value], _) => {
                setValue(name as any, value); // TODO pls typ malverk. pls fjern malverk
            });
        }
    };

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="skjema-innlogget aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Avtale om å søke jobber" aktivitetsType={SOKEAVTALE_AKTIVITET_TYPE} />
                <Malverk
                    visible={window.appconfig.VIS_MALER}
                    endre={!!aktivitet}
                    onChange={onMalChange}
                    type="SOKEAVTALE"
                />
                <div className="dato-container">
                    {aktivitet?.avtalt === true && aktivitet?.fraDato ? (
                        <PartialDateRangePicker
                            error={{
                                from: errorWrapper.errors.fraDato?.message,
                                to: errorWrapper.errors.tilDato?.message,
                            }}
                            from={defaultValues.fraDato!!}
                            fromRef={register('fraDato', { setValueAs: valueAsDateOrUndefined }).ref}
                            toRef={register('tilDato', { setValueAs: valueAsDateOrUndefined }).ref}
                        />
                    ) : (
                        <DateRangePicker
                            fromRef={register('fraDato', { setValueAs: valueAsDateOrUndefined }).ref}
                            toRef={register('tilDato', { setValueAs: valueAsDateOrUndefined }).ref}
                            error={{
                                from: errorWrapper.errors.fraDato?.message,
                                to: errorWrapper.errors.tilDato?.message,
                            }}
                        />
                    )}
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
                    label="Oppfølging fra NAV"
                    maxLength={255}
                    {...register('avtaleOppfolging')}
                    error={errorWrapper.errors.avtaleOppfolging && errorWrapper.errors.avtaleOppfolging.message}
                    value={avtaleOppfolging}
                />
                <Textarea
                    disabled={avtalt}
                    label="Beskrivelse"
                    maxLength={5000}
                    {...register('beskrivelse')}
                    error={errorWrapper.errors.beskrivelse && errorWrapper.errors.beskrivelse.message}
                    value={beskrivelseValue}
                />
                <CustomErrorSummary errors={errorWrapper.errors} />
                <LagreAktivitetKnapp />
            </div>
        </form>
    );
};

export default SokeAvtaleAktivitetForm;
