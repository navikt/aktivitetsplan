import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Select, TextField, Textarea } from '@navikt/ds-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { INTERNET_KANAL, MOTE_TYPE, OPPMOTE_KANAL, STATUS_PLANLAGT, TELEFON_KANAL } from '../../../../constant';
import { MoteAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { beregnFraTil, beregnKlokkeslettVarighet } from '../../aktivitet-util';
import AktivitetFormHeader from '../aktivitet-form-header';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';
import HuskVarsleBruker from './HuskVarsleBruker';
import VideoInfo from './VideoInfo';

export const defaultBeskrivelse = 'Vi ønsker å snakke med deg om aktiviteter du har gjennomført og videre oppfølging.';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut tema for møtet').max(100, 'Du må korte ned teksten til 100 tegn'),
    dato: z.string(),
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
    aktivitet?: MoteAktivitet;
    onSubmit: (data: MoteAktivitetFormValues & { status: string; avtalt: boolean }) => Promise<any>;
}

const MoteAktivitetForm = (props: Props) => {
    const { aktivitet, onSubmit } = props;

    const dato = aktivitet ? beregnKlokkeslettVarighet(aktivitet) : undefined;

    const defaultValues: MoteAktivitetFormValues = {
        tittel: aktivitet?.tittel || '',
        klokkeslett: dato?.klokkeslett ? dato.klokkeslett : '10:00',
        varighet: dato?.varighet ? dato.varighet : '00:45',
        kanal: aktivitet?.kanal || OPPMOTE_KANAL,
        adresse: aktivitet?.adresse || '',
        beskrivelse: aktivitet?.beskrivelse || defaultBeskrivelse,
        forberedelser: aktivitet?.forberedelser || '',
        dato: aktivitet?.fraDato || '',
    };
    const avtalt = aktivitet?.avtalt || false;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<MoteAktivitetFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
        shouldFocusError: false,
    });

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

                {/* TODO datovelger her */}
                {/*<div className="mote-aktivitet-form__velg-mote-klokkeslett">*/}
                {/*    <DatePicker {...datepickerProps} disabled={[{ before: new Date() }]}>*/}
                {/*        <DatePicker.Input*/}
                {/*            {...state.fields.dato.input}*/}
                {/*            {...inputProps}*/}
                {/*            required*/}
                {/*            label={'Dato *'}*/}
                {/*            error={state.fields.dato.touched ? state.fields.dato.error : undefined}*/}
                {/*        />*/}
                {/*    </DatePicker>*/}
                {/*    <TextField*/}
                {/*        label="Klokkeslett *"*/}
                {/*        {...state.fields.klokkeslett.input}*/}
                {/*        type={'time' as any}*/}
                {/*        step="300"*/}
                {/*    />*/}
                {/*    <TextField label="Varighet *" {...state.fields.varighet.input} type={'time' as any} step="900" />*/}
                {/*</div>*/}

                <Select label="Møteform (obligatorisk)" {...register('kanal')}>
                    <option value={OPPMOTE_KANAL}>Oppmøte</option>
                    <option value={TELEFON_KANAL}>Telefonmøte</option>
                    <option value={INTERNET_KANAL}>Videomøte</option>
                </Select>
                <VideoInfo kanal={watch('kanal')} />

                <TextField
                    label="Møtested eller annen praktisk informasjon *"
                    id={'adresse'}
                    {...register('adresse')}
                    error={errors.adresse && errors.adresse.message}
                />
                <Textarea
                    disabled={avtalt}
                    label="Hensikt med møtet *"
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
        </form>
    );
};

export default MoteAktivitetForm;
