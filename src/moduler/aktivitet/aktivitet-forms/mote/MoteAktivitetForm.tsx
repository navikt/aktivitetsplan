import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Select, TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AktivitetStatus, Kanal } from '../../../../datatypes/aktivitetTypes';
import { MoteAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { coerceToUndefined } from '../../../../felles-komponenter/skjema/datovelger/common';
import ControlledDatePicker from '../../../../felles-komponenter/skjema/datovelger/ControlledDatePicker';
import { beregnFraTil, beregnKlokkeslettVarighet } from '../../aktivitet-util';
import AktivitetFormHeader from '../AktivitetFormHeader';
import CustomErrorSummary from '../CustomErrorSummary';
import { dateOrUndefined } from '../ijobb/AktivitetIjobbForm';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';
import HuskVarsleBruker from './HuskVarsleBruker';
import VideoInfo from './VideoInfo';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut tema for møtet').max(100, 'Du må korte ned teksten til 100 tegn'),
    dato: z.date({
        required_error: 'Dato må fylles ut',
        invalid_type_error: 'Ikke en gyldig dato',
    }),
    klokkeslett: z.string().min(1, 'Du må fylle ut klokkeslett'),
    varighet: z.number({ invalid_type_error: 'Du må velge varighet' }), // Blir NaN på default value
    kanal: z.nativeEnum(Kanal, {
        errorMap: (issue) => {
            switch (issue.code) {
                case 'invalid_enum_value':
                    return { message: 'Du må velge møteform' };
                default:
                    return { message: 'Noe har gått galt' };
            }
        },
    }),
    adresse: z
        .string()
        .min(1, 'Du må fylle ut møtested eller annen praktisk informasjon')
        .max(255, 'Du må korte ned teksten til 255 tegn'),
    beskrivelse: z
        .string()
        .min(1, 'Du må fylle ut hensikten med møtet')
        .max(5000, 'Du må korte ned teksten til 5000 tegn'),
    forberedelser: z.string().max(500, 'Du må korte ned teksten til 500 tegn').optional(),
});

export type MoteAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (
        data: Omit<MoteAktivitetFormValues, 'klokkeslett'> & { status: string; avtalt: boolean },
    ) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: MoteAktivitet;
}

const MoteAktivitetForm = (props: Props) => {
    const { aktivitet, dirtyRef, onSubmit } = props;

    const moteTid = aktivitet ? beregnKlokkeslettVarighet(aktivitet) : undefined;

    const defaultValues: Partial<MoteAktivitetFormValues> = {
        tittel: aktivitet?.tittel,
        klokkeslett: moteTid?.klokkeslett,
        // Keep field as string since input natively returns string
        varighet: moteTid?.varighet,
        kanal: aktivitet?.kanal,
        adresse: aktivitet?.adresse,
        beskrivelse: aktivitet?.beskrivelse,
        forberedelser: aktivitet?.forberedelser ?? undefined,
        dato: coerceToUndefined(aktivitet?.fraDato),
    };
    const avtalt = aktivitet?.avtalt || false;

    const formHandlers = useForm<MoteAktivitetFormValues>({
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
    const forberedelserValue = watch('forberedelser'); // for <Textarea /> character-count to work

    const varighet = [
        { minutter: 15, tekst: '15 minutter' },
        { minutter: 30, tekst: '30 minutter' },
        { minutter: 45, tekst: '45 minutter' },
        { minutter: 60, tekst: '1 time' },
        { minutter: 90, tekst: '1 time, 30 minutter' },
        { minutter: 120, tekst: '2 timer' },
        { minutter: 150, tekst: '2 timer, 30 minutter' },
        { minutter: 180, tekst: '3 timer' },
        { minutter: 210, tekst: '3 timer, 30 minutter' },
        { minutter: 240, tekst: '4 timer' },
        { minutter: 270, tekst: '4 timer, 30 minutter' },
        { minutter: 300, tekst: '5 timer' },
        { minutter: 330, tekst: '5 timer, 30 minutter' },
        { minutter: 360, tekst: '6 timer' },
        { minutter: 390, tekst: '6 timer, 30 minutter' },
        { minutter: 420, tekst: '7 timer' },
        { minutter: 450, tekst: '7 timer, 30 minutter' },
    ];

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit((data) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { klokkeslett, ...rest } = data;
                return onSubmit({
                    ...rest,
                    ...beregnFraTil(data),
                    status: AktivitetStatus.PLANLAGT,
                    avtalt: false,
                });
            })}
        >
            <FormProvider {...formHandlers}>
                <div className="space-y-8">
                    <AktivitetFormHeader tittel="Møte med NAV" aktivitetstype={VeilarbAktivitetType.MOTE_TYPE} />
                    <HuskVarsleBruker avtalt={avtalt} endre={!!aktivitet} />

                    <TextField
                        disabled={avtalt}
                        label="Tema for møtet (obligatorisk)"
                        id={'tittel'}
                        {...register('tittel')}
                        error={errors.tittel && errors.tittel.message}
                    />

                    <ControlledDatePicker
                        field={{ name: 'dato', required: true, defaultValue: dateOrUndefined(aktivitet?.fraDato) }}
                    />
                    <TextField
                        label="Klokkeslett (obligatorisk)"
                        {...register('klokkeslett')}
                        type="time"
                        error={errors.klokkeslett && errors.klokkeslett.message}
                    />
                    <Select
                        label="Varighet (obligatorisk)"
                        {...register('varighet', { valueAsNumber: true })}
                        error={errors.varighet && errors.varighet.message}
                    >
                        <option value="">Velg varighet</option>
                        {varighet.map((item) => (
                            <option value={item.minutter} key={item.minutter}>
                                {item.tekst}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Møteform (obligatorisk)"
                        {...register('kanal')}
                        error={errors.kanal && errors.kanal.message}
                    >
                        <option value="">Velg møteform</option>
                        <option value={Kanal.OPPMOTE}>Oppmøte</option>
                        <option value={Kanal.TELEFON}>Telefonmøte</option>
                        <option value={Kanal.INTERNET}>Videomøte</option>
                    </Select>
                    <VideoInfo kanal={watch('kanal')} />

                    <TextField
                        label="Møtested eller annen praktisk informasjon (obligatorisk)"
                        id={'adresse'}
                        {...register('adresse')}
                        error={errors.adresse && errors.adresse.message}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Hensikt med møtet (obligatorisk)"
                        maxLength={5000}
                        {...register('beskrivelse')}
                        error={errors.beskrivelse && errors.beskrivelse.message}
                        value={beskrivelseValue}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Forberedelser til møtet (valgfri)"
                        maxLength={500}
                        {...register('forberedelser')}
                        error={errors.forberedelser && errors.forberedelser.message}
                        value={forberedelserValue}
                    />
                    <CustomErrorSummary errors={errors} />
                    <LagreAktivitetKnapp loading={isSubmitting} />
                </div>
            </FormProvider>
        </form>
    );
};

export default MoteAktivitetForm;
