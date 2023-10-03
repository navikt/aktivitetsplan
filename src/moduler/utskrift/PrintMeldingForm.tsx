import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Heading, Textarea } from '@navikt/ds-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Bruker } from '../../datatypes/types';

const defaultBeskrivelse =
    'Her finner du avtalte aktiviteter med NAV som du skal gjennomføre for å nå målet ditt. ' +
    'Gi beskjed til NAV hvis det skjer endringer i situasjonen din eller hvis du ikke kan gjennomføre en aktivitet.';

interface Props {
    bruker: Bruker;
    onSubmit: (formValues: PrintFormValues) => Promise<void>;
}

const schema = z.object({
    beskrivelse: z.string().max(2000, 'Du må korte ned teksten til 2000 tegn'),
});

export type PrintFormValues = z.infer<typeof schema>;

const PrintMeldingForm = (props: Props) => {
    const { bruker, onSubmit } = props;

    const defaultValues: PrintFormValues = { beskrivelse: defaultBeskrivelse };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PrintFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
        shouldFocusError: true,
    });

    const submit = (formValues: PrintFormValues) => {
        return onSubmit(formValues);
    };

    const begrunnelseValue = watch('beskrivelse');

    return (
        <form onSubmit={handleSubmit((data) => submit(data))} className="space-y-8">
            <div className="space-y-8">
                <Textarea
                    label="Rediger teksten under så den passer til brukeren."
                    maxLength={2000}
                    {...register('beskrivelse')}
                    value={begrunnelseValue}
                    error={errors.beskrivelse && errors.beskrivelse.message}
                />
            </div>
            <Button>Velg</Button>
        </form>
    );
};

export default PrintMeldingForm;
