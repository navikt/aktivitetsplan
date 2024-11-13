import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import { isAfter } from 'date-fns';
import React, { MutableRefObject } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { MedisinskBehandlingAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import { avtaltResolver } from '../../../../utils/avtaltResolver';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import { dateOrUndefined } from '../ijobb/AktivitetIjobbForm';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';
import { InnsynsrettInfo } from '../../innsynsrett/InnsynsrettInfo';

const schema = z
    .object({
        tittel: z.string(),
        fraDato: z.date({
            required_error: 'Fra dato må fylles ut',
            invalid_type_error: 'Ikke en gyldig dato',
        }),
        tilDato: z.date({
            required_error: 'Til dato må fylles ut',
            invalid_type_error: 'Ikke en gyldig dato',
        }),
        behandlingType: z
            .string()
            .min(1, 'Du må fylle ut type behandling')
            .max(100, 'Du må korte ned teksten til 100 tegn'),
        behandlingSted: z
            .string()
            .min(1, 'Du må fylle ut behandlingssted')
            .max(255, 'Du må korte ned teksten til 100 tegn'),
        effekt: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
        behandlingOppfolging: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
        beskrivelse: z.string().max(400, 'Du må korte ned teksten til 400 tegn').optional(),
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

export type MedisinskBehandlingFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: MedisinskBehandlingFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: MedisinskBehandlingAktivitet;
}

const medisinskZodResolver = zodResolver(schema);

const MedisinskBehandlingForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;

    const defaultValues: Partial<MedisinskBehandlingFormValues> = {
        tittel: aktivitet?.tittel || 'Medisinsk behandling',
        behandlingType: aktivitet?.behandlingType || '',
        behandlingSted: aktivitet?.behandlingSted || '',
        fraDato: dateOrUndefined(aktivitet?.fraDato),
        tilDato: dateOrUndefined(aktivitet?.tilDato),
        effekt: aktivitet?.effekt || '',
        beskrivelse: aktivitet?.beskrivelse || '',
        behandlingOppfolging: aktivitet?.behandlingOppfolging || '',
    };
    const avtalt = aktivitet?.avtalt || false;

    const formHandlers = useForm<MedisinskBehandlingFormValues>({
        defaultValues,
        resolver: avtaltResolver(avtalt, ['tilDato'], medisinskZodResolver),
        shouldFocusError: false,
    });
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = formHandlers;

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <FormProvider {...formHandlers}>
                <div className="space-y-8">
                    <AktivitetFormHeader aktivitetstype={VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE} />
                    <InnsynsrettInfo/>
                    <TextField
                        disabled={avtalt}
                        label="Type behandling (obligatorisk)"
                        id={'behandlingstype'}
                        {...register('behandlingType')}
                        error={errors.behandlingType && errors.behandlingType.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Behandlingssted (obligatorisk)"
                        id={'behandlingssted'}
                        {...register('behandlingSted')}
                        error={errors.behandlingSted && errors.behandlingSted.message}
                    />
                    <MaybeAvtaltDateRangePicker
                        aktivitet={aktivitet}
                        from={{ name: 'fraDato', required: true, label: 'Fra dato (obligatorisk)' }}
                        to={{ name: 'tilDato', required: true, label: 'Til dato (obligatorisk)' }}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Mål for behandlingen (valgfri)"
                        id={'effekt'}
                        {...register('effekt')}
                        error={errors.effekt && errors.effekt.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Oppfølging fra Nav (valgfri)"
                        id={'behandlingoppfolging'}
                        {...register('behandlingOppfolging')}
                        error={errors.behandlingOppfolging && errors.behandlingOppfolging.message}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Kort beskrivelse av behandlingen (valgfri)"
                        maxLength={400}
                        {...register('beskrivelse')}
                        error={errors.beskrivelse && errors.beskrivelse.message}
                        value={beskrivelseValue}
                    />
                    <CustomErrorSummary errors={errors} />
                    <LagreAktivitetKnapp loading={isSubmitting} />
                </div>
            </FormProvider>
        </form>
    );
};

export default MedisinskBehandlingForm;
