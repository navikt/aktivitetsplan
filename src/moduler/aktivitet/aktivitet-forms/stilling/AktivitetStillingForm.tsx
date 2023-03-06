import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import { StillingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { todayIsoString } from '../../../../utils/dateUtils';
import AktivitetFormHeader from '../aktivitet-form-header';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

const schema = z.object({
    tittel: z.string().min(1, 'Du må fylle ut stillingstittel').max(100, 'Du må korte ned teksten til 100 tegn'),
    fraDato: z.string(),
    tilDato: z.string(),
    arbeidsgiver: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    kontaktperson: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    arbeidssted: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    beskrivelse: z.string().max(5000, 'Du må korte ned teksten til 5000 tegn').optional(),
    lenke: z.string().max(2000, 'Du må korte ned lenken til 2000 tegn').optional(),
});

type StillingAktivitetFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: StillingAktivitetFormValues) => Promise<void>;
    aktivitet?: StillingAktivitet;
}

const StillingAktivitetForm = (props: Props) => {
    const { onSubmit, aktivitet } = props;

    const defaultValues: StillingAktivitetFormValues = {
        tittel: aktivitet?.tittel || '',
        fraDato: aktivitet?.fraDato || todayIsoString(),
        tilDato: aktivitet?.tilDato || '',
        beskrivelse: aktivitet?.beskrivelse || '',
        arbeidssted: aktivitet?.arbeidssted || '',
        arbeidsgiver: aktivitet?.arbeidsgiver || '',
        kontaktperson: aktivitet?.kontaktperson || '',
        lenke: aktivitet?.lenke || '',
    };
    const avtalt = aktivitet?.avtalt || false;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<StillingAktivitetFormValues>({ defaultValues, resolver: zodResolver(schema), shouldFocusError: false });

    const beskrivelseValue = watch('beskrivelse'); // for <Textarea /> character-count to work

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="aktivitetskjema space-y-4">
                <AktivitetFormHeader tittel="En jobb jeg vil søke på" aktivitetsType={STILLING_AKTIVITET_TYPE} />
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
                {/*            initialFromDate={aktivitet?.tilDato ? new Date(aktivitet.tilDato) : undefined}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</PeriodeValidering>*/}
                <TextField
                    disabled={avtalt}
                    label="Arbeidsgiver"
                    id={'arbeidsgiver'}
                    {...register('arbeidsgiver')}
                    error={errors.arbeidsgiver && errors.arbeidsgiver.message}
                />
                <TextField
                    disabled={avtalt}
                    label="Kontaktperson hos arbeidsgiver"
                    id={'kontaktperson'}
                    {...register('kontaktperson')}
                    error={errors.kontaktperson && errors.kontaktperson.message}
                />
                <TextField
                    disabled={avtalt}
                    label="Arbeidssted"
                    id="arbeidssted"
                    {...register('arbeidssted')}
                    error={errors.arbeidssted && errors.arbeidssted.message}
                />
                <Textarea
                    disabled={avtalt}
                    label="Kort beskrivelse av stillingen"
                    maxLength={5000}
                    {...register('beskrivelse')}
                    error={errors.beskrivelse && errors.beskrivelse.message}
                    value={beskrivelseValue}
                />
                <TextField
                    disabled={avtalt}
                    label="Lenke til stillingsannonse"
                    id={'lenke'}
                    {...register('lenke')}
                    error={errors.lenke && errors.lenke.message}
                />
                <CustomErrorSummary errors={errors} />
                <LagreAktivitetKnapp />
            </div>
        </form>
    );
};

export default StillingAktivitetForm;
