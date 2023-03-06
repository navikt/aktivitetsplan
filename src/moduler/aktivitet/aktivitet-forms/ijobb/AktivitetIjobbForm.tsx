import { zodResolver } from '@hookform/resolvers/zod';
import { Radio, RadioGroup, TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { IJOBB_AKTIVITET_TYPE, JOBB_STATUS_DELTID, JOBB_STATUS_HELTID } from '../../../../constant';
import { IJobbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import AktivitetFormHeader from '../aktivitet-form-header';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut stillingstittel').max(100, 'Du må korte ned teksten til 100 tegn'),
    fraDato: z.string(),
    tilDato: z.string(),
    jobbStatus: z.string().min(1, 'Du må velge heltid eller deltid'),
    ansettelsesforhold: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    arbeidstid: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional(),
});

type IJobbAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: IJobbAktivitetFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: IJobbAktivitet;
}

const IJobbAktivitetForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;

    const defaultValues: IJobbAktivitetFormValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: aktivitet?.fraDato || '',
        tilDato: aktivitet?.tilDato || '',
        jobbStatus: aktivitet?.jobbStatus || '',
        ansettelsesforhold: aktivitet?.ansettelsesforhold || '',
        arbeidstid: aktivitet?.arbeidstid || '',
        beskrivelse: aktivitet?.beskrivelse || '',
    };
    const avtalt = aktivitet?.avtalt || false;

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        control,
        formState: { errors, isDirty },
    } = useForm<IJobbAktivitetFormValues>({ defaultValues, resolver: zodResolver(schema), shouldFocusError: false });

    if (dirtyRef) {
        dirtyRef.current = isDirty;
    }

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work

    const onChangeStillingProsent = (value: typeof JOBB_STATUS_HELTID | typeof JOBB_STATUS_HELTID) => {
        setValue('jobbStatus', value, { shouldValidate: true });
    };

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="Jobb jeg har nå" aktivitetsType={IJOBB_AKTIVITET_TYPE} />
                <TextField
                    disabled={avtalt}
                    label="Stillingstittel (obligatorisk)"
                    id={'tittel'}
                    {...register('tittel')}
                    error={errors.tittel && errors.tittel.message}
                />
                {/* TODO datovelger her */}
                {/*<PeriodeValidering valideringFelt={state.fields.periodeValidering}>*/}
                {/*    <div className="dato-container">*/}
                {/*        <MaybeAvtaltDateRangePicker*/}
                {/*            formState={state}*/}
                {/*            aktivitet={aktivitet}*/}
                {/*            initialFromDate={defaultValues.fraDato ? new Date(defaultValues.fraDato) : undefined}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</PeriodeValidering>*/}
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
                    value={beskrivelseValue}
                />
                <CustomErrorSummary errors={errors} />
                <LagreAktivitetKnapp />
            </div>
        </form>
    );
};

export default IJobbAktivitetForm;
