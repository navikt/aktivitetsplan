import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import { startOfDay } from 'date-fns';
import React, { MutableRefObject } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { StillingAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import { dateOrUndefined } from '../ijobb/AktivitetIjobbForm';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';
import { InnsynsrettInfo } from '../../innsynsrett/InnsynsrettInfo';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut stillingstittel').max(100, 'Du må korte ned teksten til 100 tegn'),
    fraDato: z.date({ required_error: 'Fra dato må fylles ut', invalid_type_error: 'Ikke en gyldig dato' }),
    tilDato: z.date({ invalid_type_error: 'Ikke en gyldig dato' }).optional().nullable(),
    arbeidsgiver: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    kontaktperson: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    arbeidssted: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional(),
    lenke: z.string().max(2000, 'Du må korte ned lenken til 2000 tegn').optional(),
});

export type StillingAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: StillingAktivitetFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: StillingAktivitet;
}

const StillingAktivitetForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;

    const defaultValues: StillingAktivitetFormValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: dateOrUndefined(aktivitet?.fraDato) ?? startOfDay(new Date()),
        tilDato: dateOrUndefined(aktivitet?.tilDato),
        beskrivelse: aktivitet?.beskrivelse || '',
        arbeidssted: aktivitet?.arbeidssted || '',
        arbeidsgiver: aktivitet?.arbeidsgiver || '',
        kontaktperson: aktivitet?.kontaktperson || '',
        lenke: aktivitet?.lenke || '',
    };
    const avtalt = aktivitet?.avtalt || false;

    const formHandlers = useForm<StillingAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
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
                    <AktivitetFormHeader aktivitetstype={VeilarbAktivitetType.STILLING_AKTIVITET_TYPE} />
                    <InnsynsrettInfo/>
                    <TextField
                        disabled={avtalt}
                        label="Stillingstittel (obligatorisk)"
                        id={'tittel'}
                        {...register('tittel')}
                        error={errors.tittel && errors.tittel.message}
                    />
                    <MaybeAvtaltDateRangePicker
                        aktivitet={aktivitet}
                        from={{ name: 'fraDato', required: true, defaultValue: defaultValues.fraDato }}
                        to={{ name: 'tilDato', required: true, label: 'Frist (valgfri)' }}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Arbeidsgiver (valgfri)"
                        id={'arbeidsgiver'}
                        {...register('arbeidsgiver')}
                        error={errors.arbeidsgiver && errors.arbeidsgiver.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Kontaktperson hos arbeidsgiver (valgfri)"
                        id={'kontaktperson'}
                        {...register('kontaktperson')}
                        error={errors.kontaktperson && errors.kontaktperson.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Arbeidssted (valgfri)"
                        id="arbeidssted"
                        {...register('arbeidssted')}
                        error={errors.arbeidssted && errors.arbeidssted.message}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Kort beskrivelse av stillingen (valgfri)"
                        maxLength={5000}
                        {...register('beskrivelse')}
                        error={errors.beskrivelse && errors.beskrivelse.message}
                        value={beskrivelseValue}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Lenke til stillingsannonse (valgfri)"
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

export default StillingAktivitetForm;
