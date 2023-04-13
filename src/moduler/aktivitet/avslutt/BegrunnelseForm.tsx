import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, Textarea } from '@navikt/ds-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomErrorSummary from '../aktivitet-forms/CustomErrorSummary';

const schema = z.object({
    begrunnelse: z.string().min(1, 'Du må fylle ut tema begrunnelse').max(255, 'Du må korte ned teksten til 255 tegn'),
});

type BegrunnelseFormValues = z.infer<typeof schema>;

interface Props {
    headerTekst: string;
    beskrivelseLabel: string;
    lagrer: boolean;
    onSubmit: (data: BegrunnelseFormValues) => Promise<void>;
}

const BegrunnelseForm = (props: Props) => {
    const { beskrivelseLabel, headerTekst, lagrer, onSubmit } = props;

    const defaultValues: BegrunnelseFormValues = {
        begrunnelse: '',
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<BegrunnelseFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
        shouldFocusError: false,
    });

    const begrunnelseValue = watch('begrunnelse'); // for <Textarea /> character-count to work

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Heading level="1" size="large">
                    {headerTekst}
                </Heading>
                <Textarea
                    label={beskrivelseLabel}
                    maxLength={255}
                    disabled={lagrer}
                    {...register('begrunnelse')}
                    error={errors.begrunnelse && errors.begrunnelse.message}
                    value={begrunnelseValue}
                />
                <CustomErrorSummary errors={errors} />
                <Button className="mt-4" loading={lagrer}>
                    Lagre
                </Button>
            </div>
        </form>
    );
};

export default BegrunnelseForm;
