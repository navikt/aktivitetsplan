import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Textarea } from '@navikt/ds-react';
import React, { MutableRefObject, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import { MedisinskBehandlingAktivitet } from '../../../../datatypes/internAktivitetTypes';
import MaybeAvtaltDateRangePicker from '../../../../felles-komponenter/skjema/datovelger/MaybeAvtaltDateRangePicker';
import AktivitetFormHeader from '../aktivitet-form-header';
import CustomErrorSummary from '../CustomErrorSummary';
import LagreAktivitetKnapp from '../LagreAktivitetKnapp';

const schema = z.object({
    tittel: z.string(),
    fraDato: z.string(),
    tilDato: z.string(),
    behandlingType: z
        .string()
        .min(1, 'Du må fylle ut type behandling')
        .max(100, 'Du må korte ned teksten til 100 tegn'),
    behandlingSted: z
        .string()
        .min(1, 'Du må fylle ut behandlingssted')
        .max(255, 'Du må korte ned teksten til 100 tegn'),
    effekt: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    behandlingOppfolging: z.string().max(255, 'Du må korte ned teksten til 255 tegn').optional(),
    beskrivelse: z.string().max(400, 'Du må korte ned teksten til 400 tegn').optional(),
});

type MedisinskBehandlingFormValues = z.infer<typeof schema>;

interface Props {
    onSubmit: (values: MedisinskBehandlingFormValues) => Promise<void>;
    dirtyRef: MutableRefObject<boolean>;
    aktivitet?: MedisinskBehandlingAktivitet;
}

const MedisinskBehandlingForm = (props: Props) => {
    const { onSubmit, dirtyRef, aktivitet } = props;

    const defaultValues: MedisinskBehandlingFormValues = {
        tittel: aktivitet?.tittel || 'Medisinsk behandling',
        behandlingType: aktivitet?.behandlingType || '',
        behandlingSted: aktivitet?.behandlingSted || '',
        fraDato: aktivitet?.fraDato || '',
        tilDato: aktivitet?.tilDato || '',
        effekt: aktivitet?.effekt || '',
        beskrivelse: aktivitet?.beskrivelse || '',
        behandlingOppfolging: aktivitet?.behandlingOppfolging || '',
    };
    const avtalt = aktivitet?.avtalt || false;

    const formHandlers = useForm<MedisinskBehandlingFormValues>({
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

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit((data) => onSubmit(data))}>
            <FormProvider {...formHandlers}>
                <div className="aktivitetskjema space-y-4">
                    <AktivitetFormHeader tittel="Medisinsk behandling" aktivitetsType={BEHANDLING_AKTIVITET_TYPE} />
                    <TextField
                        disabled={avtalt}
                        label="Type behandling (obligatorisk)"
                        id={'behandlingstype'}
                        {...register('behandlingType')}
                        error={errors.behandlingType && errors.behandlingType.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Behandlingssted (obligatorisk)"
                        id={'behandlingssted'}
                        {...register('behandlingSted')}
                        error={errors.behandlingSted && errors.behandlingSted.message}
                    />
                    <MaybeAvtaltDateRangePicker
                        aktivitet={aktivitet}
                        from={{ name: 'fraDato', required: true }}
                        to={{ name: 'tilDato' }}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Mål for behandlingen"
                        id={'effekt'}
                        {...register('effekt')}
                        error={errors.effekt && errors.effekt.message}
                    />
                    <TextField
                        disabled={avtalt}
                        label="Oppfølging fra NAV"
                        id={'behandlingoppfolging'}
                        {...register('behandlingOppfolging')}
                        error={errors.behandlingOppfolging && errors.behandlingOppfolging.message}
                    />
                    <Textarea
                        disabled={avtalt}
                        label="Kort beskrivelse av behandlingen"
                        maxLength={400}
                        {...register('beskrivelse')}
                        error={errors.beskrivelse && errors.beskrivelse.message}
                        value={beskrivelseValue}
                    />
                    <CustomErrorSummary errors={errors} />
                    <LagreAktivitetKnapp />
                </div>
            </FormProvider>
        </form>
    );
};

export default MedisinskBehandlingForm;
