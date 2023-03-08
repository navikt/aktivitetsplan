import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Select, TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    INTERNET_KANAL,
    OPPMOTE_KANAL,
    SAMTALEREFERAT_TYPE,
    STATUS_GJENNOMFOERT,
    TELEFON_KANAL,
} from '../../../../constant';
import { INTERNET_KANAL, OPPMOTE_KANAL, STATUS_GJENNOMFOERT, TELEFON_KANAL } from '../../../../constant';
import { SamtalereferatAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { SamtalereferatAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import ControlledDatePicker from '../../../../felles-komponenter/skjema/datovelger/ControlledDatePicker';
import { todayIsoString } from '../../../../utils/dateUtils';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import { dateOrUndefined } from '../ijobb/AktivitetIjobbForm';
import { useReferatStartTekst } from './useReferatStartTekst';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut tema for samtalen').max(100, 'Du må korte ned teksten til 100 tegn'),
    fraDato: z.date({
        required_error: 'Fra dato må fylles ut',
        invalid_type_error: 'Ikke en gyldig dato',
    }),
    kanal: z.string().min(1, 'Du må fylle ut samtaleform'),
    referat: z.string().min(1, 'Du må fylle ut samtalereferat').max(5000, 'Du må korte ned teksten til 5000 tegn'),
});

type SamtalereferatAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (
        data: SamtalereferatAktivitetFormValues & {
            status: string;
            avtalt: boolean;
            erReferatPublisert?: boolean;
        }
    ) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: SamtalereferatAktivitet;
}

const InnerSamtalereferatForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;
    const startTekst = useReferatStartTekst();
    const nyAktivitet = !aktivitet;

    const defaultValues: Partial<SamtalereferatAktivitetFormValues> = {
        tittel: aktivitet?.tittel || '',
        fraDato: dateOrUndefined(aktivitet?.fraDato),
        kanal: aktivitet?.kanal || TELEFON_KANAL,
        referat: aktivitet?.referat || startTekst,
    };

    const formHandlers = useForm<SamtalereferatAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
        shouldFocusError: false,
    });
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = formHandlers;

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const referatValue = watch('referat'); // for <Textarea /> character-count to work

    const lagreOgDel = (erReferatPublisert: boolean) => {
        return handleSubmit((data) => {
            onSubmit({
                ...data,
                status: STATUS_GJENNOMFOERT,
                avtalt: false,
                ...(erReferatPublisert && { erReferatPublisert: true }),
            });
        });
    };

    return (
        <form autoComplete="off" noValidate>
            <FormProvider {...formHandlers}>
                <div className="aktivitetskjema space-y-4">
                    <AktivitetFormHeader
                        tittel="Samtalereferat"
                        aktivitetstype={VeilarbAktivitetType.SAMTALEREFERAT_TYPE}
                    />

                    <TextField
                        label="Tema for samtalen (obligatorisk)"
                        id={'tittel'}
                        {...register('tittel')}
                        error={errors.tittel && errors.tittel.message}
                    />

                    <ControlledDatePicker
                        field={{ name: 'fraDato', required: true, defaultValue: dateOrUndefined(aktivitet?.fraDato) }}
                    />

                    <Select label="Møteform (obligatorisk)" {...register('kanal')}>
                        <option value={OPPMOTE_KANAL}>Oppmøte</option>
                        <option value={TELEFON_KANAL}>Telefonmøte</option>
                        <option value={INTERNET_KANAL}>Videomøte</option>
                    </Select>

                    {nyAktivitet && (
                        <Textarea
                            label="Samtalereferat (obligatorisk)"
                            maxLength={5000}
                            {...register('referat')}
                            error={errors.referat && errors.referat.message}
                            value={referatValue}
                        />
                    )}

                    <CustomErrorSummary errors={errors} />
                </div>
                <Lagreknapper isLoading={isSubmitting} isNy={nyAktivitet} lagreOgDel={lagreOgDel} />
            </FormProvider>
        </form>
    );
};

const Lagreknapper = (props: {
    isLoading: boolean;
    isNy: boolean;
    lagreOgDel: (erReferatPublisert: boolean) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}) => {
    const { isLoading, isNy, lagreOgDel } = props;
    if (isNy) {
        return (
            <div className="mt-4">
                <Button loading={isLoading} className="mr-4" onClick={lagreOgDel(true)}>
                    Del med bruker
                </Button>
                <Button variant="secondary" loading={isLoading} onClick={lagreOgDel(false)}>
                    Lagre utkast
                </Button>
            </div>
        );
    }
    return (
        <Button className="mt-4" loading={isLoading} onClick={lagreOgDel(false)}>
            Lagre
        </Button>
    );
};

export default InnerSamtalereferatForm;
