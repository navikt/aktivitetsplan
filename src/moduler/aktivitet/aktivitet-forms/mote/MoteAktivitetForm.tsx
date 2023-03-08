import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Select, TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { INTERNET_KANAL, MOTE_TYPE, OPPMOTE_KANAL, STATUS_PLANLAGT, TELEFON_KANAL } from '../../../../constant';
import { MoteAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { coerceToUndefined } from '../../../../felles-komponenter/skjema/datovelger/common';
import ControlledDatePicker from '../../../../felles-komponenter/skjema/datovelger/ControlledDatePicker';
import { beregnFraTil, beregnKlokkeslettVarighet } from '../../aktivitet-util';
import AktivitetFormHeader from '../aktivitet-form-header';
import CustomErrorSummary from '../CustomErrorSummary';
import { dateOrUndefined } from '../ijobb/AktivitetIjobbForm';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';
import HuskVarsleBruker from './HuskVarsleBruker';
import VideoInfo from './VideoInfo';

export const defaultBeskrivelse = 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut tema for møtet').max(100, 'Du må korte ned teksten til 100 tegn'),
    dato: z.date({
        required_error: 'Fra dato må fylles ut',
        invalid_type_error: 'Ikke en gyldig dato',
    }),
    klokkeslett: z.string().min(1, 'Du må fylle ut klokkeslett'),
    varighet: z.string().min(1, 'Du må fylle ut varighet'),
    kanal: z.string().min(1, 'Du må fylle ut møteform'),
    adresse: z
        .string()
        .min(1, 'Du må fylle ut møtested eller annen praktisk informasjon')
        .max(255, 'Du må korte ned teksten til 255 tegn'),
    beskrivelse: z
        .string()
        .min(1, 'Du må fylle ut hensikten med møtet')
        .max(5000, 'Du må korte ned teksten til 5000 tegn'),
    forberedelser: z.string().max(500, 'Du må korte ned teksten til 500 tegn'),
});

type MoteAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (data: MoteAktivitetFormValues & { status: string; avtalt: boolean }) => Promise<any>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: MoteAktivitet;
}

const MoteAktivitetForm = (props: Props) => {
    const { aktivitet, dirtyRef, onSubmit } = props;

    const dato = aktivitet ? beregnKlokkeslettVarighet(aktivitet) : undefined;

    const defaultValues: Partial<MoteAktivitetFormValues> = {
        tittel: aktivitet?.tittel,
        klokkeslett: dato?.klokkeslett ? dato.klokkeslett : '10:00',
        varighet: dato?.varighet ? dato.varighet : '00:45',
        kanal: aktivitet?.kanal || OPPMOTE_KANAL,
        adresse: aktivitet?.adresse,
        beskrivelse: aktivitet?.beskrivelse || defaultBeskrivelse,
        forberedelser: aktivitet?.forberedelser,
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
        formState: { errors, isDirty },
    } = formHandlers;

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work
    const forberedelserValue = watch('forberedelser'); // for <Textarea /> character-count to work

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit((data) =>
                onSubmit({
                    ...data,
                    ...beregnFraTil(data),
                    status: STATUS_PLANLAGT,
                    avtalt: false,
                    // dato: selectedDay!!.toString(),
                })
            )}
        >
            <FormProvider {...formHandlers}>
                <div className="skjema-innlogget aktivitetskjema space-y-4">
                    <AktivitetFormHeader tittel="Møte med NAV" aktivitetsType={MOTE_TYPE} />
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
                    <TextField label="Klokkeslett *" {...register('klokkeslett')} type={'time' as any} step="300" />
                    <TextField label="Varighet *" {...register('varighet')} type={'time' as any} step="900" />
                    <Select label="Møteform (obligatorisk)" {...register('kanal')}>
                        <option value={OPPMOTE_KANAL}>Oppmøte</option>
                        <option value={TELEFON_KANAL}>Telefonmøte</option>
                        <option value={INTERNET_KANAL}>Videomøte</option>
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
                        label="Forberedelser til møtet"
                        maxLength={500}
                        {...register('forberedelser')}
                        error={errors.forberedelser && errors.forberedelser.message}
                        value={forberedelserValue}
                    />
                    <CustomErrorSummary errors={errors} />
                    <LagreAktivitetKnapp />
                </div>
            </FormProvider>
        </form>
    );
};

export default MoteAktivitetForm;
