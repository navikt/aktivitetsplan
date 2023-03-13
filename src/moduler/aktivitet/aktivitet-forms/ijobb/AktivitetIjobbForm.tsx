import { zodResolver } from '@hookform/resolvers/zod';
import { Radio, RadioGroup, TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { JOBB_STATUS_DELTID, JOBB_STATUS_HELTID } from '../../../../constant';
import { IJobbAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut stillingstittel').max(100, 'Du må korte ned teksten til 100 tegn'),
    fraDato: z.date({
        required_error: 'Fra dato må fylles ut',
        invalid_type_error: 'Ikke en gyldig dato',
    }),
    tilDato: z.date({ invalid_type_error: 'Ikke en gyldig dato' }).optional().nullable(),
    jobbStatus: z.string().min(1, 'Du må velge heltid eller deltid'),
    ansettelsesforhold: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional().nullable(),
    arbeidstid: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional().nullable(),
    beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional().nullable(),
});

type IJobbAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: IJobbAktivitetFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: IJobbAktivitet;
}

export const dateOrUndefined = (val: string | undefined) => {
    if (val === undefined || val === null) return undefined;
    return new Date(val);
};

const IJobbAktivitetForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;

    const defaultValues: Partial<IJobbAktivitetFormValues> = {
        tittel: aktivitet?.tittel,
        fraDato: dateOrUndefined(aktivitet?.fraDato),
        tilDato: dateOrUndefined(aktivitet?.tilDato),
        jobbStatus: aktivitet?.jobbStatus,
        ansettelsesforhold: aktivitet?.ansettelsesforhold,
        arbeidstid: aktivitet?.arbeidstid,
        beskrivelse: aktivitet?.beskrivelse,
    };
    const avtalt = aktivitet?.avtalt || false;

    const methods = useForm<IJobbAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
        shouldFocusError: false,
    });
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        control,
        formState: { errors, isDirty },
    } = methods;

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work

    const onChangeStillingProsent = (value: typeof JOBB_STATUS_HELTID | typeof JOBB_STATUS_DELTID) => {
        setValue('jobbStatus', value, { shouldValidate: true });
    };

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <FormProvider {...methods}>
                <div className="aktivitetskjema space-y-4">
                    <AktivitetFormHeader
                        tittel="Jobb jeg har nå"
                        aktivitetstype={VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Stillingstittel (obligatorisk)"
                        id={'tittel'}
                        {...register('tittel')}
                        error={errors.tittel && errors.tittel.message}
                    />
                    <MaybeAvtaltDateRangePicker
                        aktivitet={aktivitet}
                        from={{ name: 'fraDato', required: true }}
                        to={{ name: 'tilDato', label: 'Frist (valgfri)' }}
                    />
                    <Controller
                        name="jobbStatus"
                        control={control}
                        render={() => (
                            <RadioGroup
                                defaultValue={defaultValues.jobbStatus}
                                disabled={avtalt}
                                id="jobbStatus"
                                legend="Stillingsandel (obligatorisk)"
                                onChange={onChangeStillingProsent}
                                error={errors.jobbStatus && errors.jobbStatus.message}
                            >
                                <Radio value={JOBB_STATUS_HELTID}>Heltid</Radio>
                                <Radio value={JOBB_STATUS_DELTID}>Deltid</Radio>
                            </RadioGroup>
                        )}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Arbeidsgiver"
                        id={'ansettelsesforhold'}
                        {...register('ansettelsesforhold')}
                        error={errors.ansettelsesforhold && errors.ansettelsesforhold.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Ansettelsesforhold (fast, midlertidig, vikariat)"
                        id={'arbeidstid'}
                        {...register('arbeidstid')}
                        error={errors.arbeidstid && errors.arbeidstid.message}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Kort beskrivelse av arbeidstid (dag, kveld, helg, stillingsprosent) og arbeidsoppgaver"
                        maxLength={5000}
                        {...register('beskrivelse')}
                        error={errors.beskrivelse && errors.beskrivelse.message}
                        value={beskrivelseValue || ''}
                    />
                    <CustomErrorSummary errors={errors} />
                    <LagreAktivitetKnapp />
                </div>
            </FormProvider>
        </form>
    );
};

export default IJobbAktivitetForm;
