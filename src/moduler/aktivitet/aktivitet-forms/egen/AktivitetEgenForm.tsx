import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { TextField, Textarea, Select } from '@navikt/ds-react';
import { addDays, isAfter, startOfDay } from 'date-fns';
import React, { ChangeEventHandler, MutableRefObject } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { EgenAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { useErVeileder } from '../../../../Provider';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import { dateOrUndefined } from '../ijobb/AktivitetIjobbForm';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';
import { InnsynsrettInfo } from '../../innsynsrett/InnsynsrettInfo';
import DateRangePicker from '../../../../felles-komponenter/skjema/datovelger/ControlledDateRangePicker';

const schema = z
    .object({
        tittel: z
            .string()
            .min(1, 'Du må fylle ut navn på aktiviteten')
            .max(100, 'Du må korte ned teksten til 100 tegn'),
        fraDato: z.date({
            required_error: 'Fra dato må fylles ut',
            invalid_type_error: 'Ikke en gyldig dato',
        }),
        tilDato: z.date({
            required_error: 'Til dato må fylles ut',
            invalid_type_error: 'Ikke en gyldig dato',
        }),
        hensikt: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
        beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional(),
        oppfolging: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
        lenke: z.string().max(2000, 'Du må korte ned lenken til 2000 tegn').optional(),
    })
    .superRefine((formValues, context) => {
        if (isAfter(formValues.fraDato, formValues.tilDato)) {
            context.addIssue({
                path: ['tilDato'],
                code: z.ZodIssueCode.custom,
                message: 'Til dato kan ikke være før fra dato',
            });
        }
    });

export type EgenAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: EgenAktivitetFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: EgenAktivitet;
}

const EgenAktivitetForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;

    const erVeileder = useErVeileder();

    const defaultValues: Partial<EgenAktivitetFormValues> = {
        tittel: aktivitet?.tittel || '',
        fraDato: dateOrUndefined(aktivitet?.fraDato),
        tilDato: dateOrUndefined(aktivitet?.tilDato),
        hensikt: aktivitet?.hensikt || '',
        beskrivelse: aktivitet?.beskrivelse || '',
        oppfolging: aktivitet?.oppfolging || '',
        lenke: aktivitet?.lenke || '',
    };

    const avtalt = aktivitet?.avtalt === true;

    const formHandlers = useForm<EgenAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
        shouldFocusError: false,
    });
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = formHandlers;

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work
    const fraDato = watch('fraDato');
    const tilDato = watch('tilDato');

    const onTemplateChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        if (event.target.value === 'ingen') {
            reset();
        } else {
            for (const [name, value] of Object.entries(malverkTemplate) as [keyof typeof malverkTemplate, string][]) {
                setValue(name, value);
            }
            const now = new Date();
            const fraDato = startOfDay(now);
            const tilDato = addDays(now, 8);
            setValue('fraDato', fraDato);
            setValue('tilDato', tilDato);
        }
    };

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <FormProvider {...formHandlers}>
                <div className="space-y-8">
                    <AktivitetFormHeader aktivitetstype={VeilarbAktivitetType.EGEN_AKTIVITET_TYPE} />

                    <InnsynsrettInfo />
                    <Select id="malverk" name={'malverk'} label="Ferdig utfylt aktivitet" onChange={onTemplateChange}>
                        <option value="ingen">Ingen ferdig utfylt aktivitet valgt</option>
                        <option value={malverkTemplate.tittel}>{malverkTemplate.tittel}</option>
                    </Select>

                    <TextField
                        disabled={avtalt}
                        label="Navn på aktiviteten (obligatorisk)"
                        id={'tittel'}
                        {...register('tittel')}
                        error={errors.tittel && errors.tittel.message}
                    />
                    <DateRangePicker
                        // aktivitet={aktivitet}
                        from={{ name: 'fraDato', required: true, defaultValue: fraDato }}
                        to={{ name: 'tilDato', required: true, defaultValue: tilDato }}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Mål med aktiviteten (valgfri)"
                        id={'hensikt'}
                        {...register('hensikt')}
                        error={errors.hensikt && errors.hensikt.message}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Kort beskrivelse av aktiviteten (valgfri)"
                        maxLength={5000}
                        {...register('beskrivelse')}
                        error={errors.beskrivelse && errors.beskrivelse.message}
                        value={beskrivelseValue}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Min huskeliste for denne aktiviteten (valgfri)"
                        id={'huskeliste'}
                        {...register('oppfolging')}
                        error={errors.oppfolging && errors.oppfolging.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Lenke til en aktuell nettside (valgfri)"
                        id={'lenke'}
                        {...register('lenke')}
                        error={errors.lenke && errors.lenke.message}
                    />
                    <CustomErrorSummary errors={errors} />
                    <LagreAktivitetKnapp loading={isSubmitting} />
                </div>
            </FormProvider>
        </form>
    );
};

const malverkTemplate = {
    tittel: 'Oppdater CV-en og jobbønsker',
    hensikt: 'Tydeliggjøre arbeidserfaring og jobbønsker slik at Nav kan bidra til å hjelpe deg ut i jobb',
    beskrivelse:
        'Når du registrerer CV-en din og jobbønskene dine, kan Nav følge deg opp på en bedre måte. CV-en gir oss nyttig informasjon om din kompetanse og dine jobbønsker. Etter avtale med deg, videreformidler NAV relevant informasjon til aktuelle arbeidsgivere og bemanningsbransjen for å hjelpe deg ut i jobb.',
    // lenke: '{lenke}',
    // fraDato: '{now}',
    // tilDato: '{now + 8d}',
} as const;

export default EgenAktivitetForm;
