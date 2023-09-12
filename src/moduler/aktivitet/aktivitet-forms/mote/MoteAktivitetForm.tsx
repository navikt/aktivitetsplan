import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Select, TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AktivitetStatus, Kanal } from '../../../../datatypes/aktivitetTypes';
import { MoteAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { coerceToUndefined } from '../../../../felles-komponenter/skjema/datovelger/common';
import ControlledDatePicker from '../../../../felles-komponenter/skjema/datovelger/ControlledDatePicker';
import { beregnFraTil, beregnKlokkeslettVarighet, formatterVarighet } from '../../aktivitet-util';
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
    varighet: z.string().min(1, 'Du må velge varighet'),
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
    onSubmit: (data: MoteAktivitetFormValues & { status: string; avtalt: boolean }) => Promise<void>;
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
        varighet: formatterVarighet(moteTid?.varighet),
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

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit((data) => {
                    const formValues = {
                    ...data,
                    ...beregnFraTil(data),
                        status: AktivitetStatus.PLANLAGT,
                        avtalt: false,
                        // dato: selectedDay!!.toString(),
                    }
                onSubmit(formValues)}
            , (error) => {
                    console.log(error)
                } )}
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
                        type={'time' as any}
                        step="300"
                        error={errors.klokkeslett && errors.klokkeslett.message}
                    />
                    <Select label="Varighet (obligatorisk)" {...register('varighet')} error={errors.varighet && errors.varighet.message} >
                        <option value={30}>30 minutter</option>
                        <option value={45}>45 minutter</option>
                        <option value={60}>1 time</option>
                        <option value={90}>1 time, 30 minutter</option>
                        <option value={120}>2 timer</option>
                        <option value={150}>2 timer, 30 minutter</option>
                        <option value={180}>3 timer</option>
                        <option value={210}>3 timer, 30 minutter</option>
                        <option value={240}>4 timer</option>
                        <option value={270}>4 timer, 30 minutter</option>
                        <option value={300}>5 timer</option>
                        <option value={330}>5 timer, 30 minutter</option>
                        <option value={360}>6 timer</option>
                        <option value={390}>6 timer, 30 minutter</option>
                        <option value={420}>7 timer</option>
                        <option value={450}>7 timer, 30 minutter</option>
                    </Select>
                    <Select label="Møteform (obligatorisk)" {...register('kanal')} error={errors.kanal && errors.kanal.message}>
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
