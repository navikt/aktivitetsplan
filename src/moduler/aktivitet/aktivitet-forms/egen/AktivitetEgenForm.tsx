import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppConfig } from '../../../../app';
import { EGEN_AKTIVITET_TYPE } from '../../../../constant';
import { EgenAktivitet } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import Malverk from '../../../malverk/malverk';
import AktivitetFormHeader from '../aktivitet-form-header';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

declare const window: {
    appconfig: AppConfig;
};

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut navn på aktiviteten').max(100, 'Du må korte ned teksten til 100 tegn'),
    fraDato: z.string(),
    tilDato: z.string(),
    hensikt: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional(),
    oppfolging: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    lenke: z.string().max(2000, 'Du må korte ned lenken til 2000 tegn').optional(),
});

type EgenAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: EgenAktivitetFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: EgenAktivitet;
}

const EgenAktivitetForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;

    const defaultValues: EgenAktivitetFormValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: aktivitet?.fraDato || '',
        tilDato: aktivitet?.tilDato || '',
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
        formState: { errors, isDirty },
    } = formHandlers;

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work

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
            <FormProvider {...formHandlers}>
                <div className="aktivitetskjema space-y-4">
                    <AktivitetFormHeader tittel="Jobbrettet egenaktivitet" aktivitetsType={EGEN_AKTIVITET_TYPE} />

                    <Malverk
                        visible={window.appconfig.VIS_MALER}
                        endre={!!aktivitet}
                        onChange={onMalChange}
                        type="EGEN"
                    />

                    <TextField
                        disabled={avtalt}
                        label="Navn på aktiviteten (obligatorisk)"
                        id={'tittel'}
                        {...register('tittel')}
                        error={errors.tittel && errors.tittel.message}
                    />
                    <MaybeAvtaltDateRangePicker
                        aktivitet={aktivitet}
                        from={{ name: 'fraDato', required: true }}
                        to={{ name: 'tilDato' }}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Mål med aktiviteten"
                        id={'hensikt'}
                        {...register('hensikt')}
                        error={errors.hensikt && errors.hensikt.message}
                    />
                    <Textarea
                        label="Kort beskrivelse av aktiviteten"
                        maxLength={5000}
                        {...register('beskrivelse')}
                        error={errors.beskrivelse && errors.beskrivelse.message}
                        value={beskrivelseValue}
                    />
                    <TextField
                        label="Min huskeliste for denne aktiviteten"
                        id={'huskeliste'}
                        {...register('oppfolging')}
                        error={errors.oppfolging && errors.oppfolging.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Lenke til en aktuell nettside"
                        id={'lenke'}
                        {...register('lenke')}
                        error={errors.lenke && errors.lenke.message}
                    />
                    <CustomErrorSummary errors={errors} />
                    <LagreAktivitetKnapp />
                </div>
            </FormProvider>
        </form>
    );
};

export default EgenAktivitetForm;
