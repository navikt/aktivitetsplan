import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Alert, Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { DirtyContext } from '../../../context/dirty-context';
import CustomErrorSummary from '../../aktivitet-forms/CustomErrorSummary';
import { trengerBegrunnelse } from '../../aktivitet-util';
import { kanOppdatereStatus } from './valideringUtils';

const label = (status: AktivitetStatus) => {
    if (status === STATUS_FULLFOERT) {
        return 'Skriv en kort kommentar om hvordan det har gått med aktiviteten, eller noe NAV bør kjenne til.';
    }
    return 'Skriv en kort begrunnelse om hvorfor du avbryter aktiviteten.';
};

interface Props {
    aktivitet: VeilarbAktivitet;
    disabled: boolean;
    onSubmit: (val: AktivitetStatusFormValues) => Promise<any>;
}

const RadioButtons: Record<AktivitetStatus, string> = {
    BRUKER_ER_INTERESSERT: 'Forslag',
    PLANLAGT: 'Planlegger',
    GJENNOMFORES: 'Gjennomfører',
    FULLFORT: 'Fullført',
    AVBRUTT: 'Avbrutt',
};

const schema = z
    .discriminatedUnion('should_validate_begrunnelse', [
        z.object({
            should_validate_begrunnelse: z.literal(false),
            aktivitetstatus: z.nativeEnum(AktivitetStatus),
            aktivitet: z.any(),
        }),
        z.object({
            should_validate_begrunnelse: z.literal(true),
            aktivitetstatus: z.nativeEnum(AktivitetStatus),
            begrunnelse: z
                .string()
                .min(1, 'Du må fylle ut en begrunnelse')
                .max(255, 'Du må korte ned teksten til 255 tegn'),
            aktivitet: z.any(),
        }),
    ])
    .superRefine((values, ctx) => {
        const error = kanOppdatereStatus(values.aktivitet, values.aktivitetstatus);
        if (error) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: error,
            });
        }
    });

export type AktivitetStatusFormValues = z.infer<typeof schema>;

const AktivitetStatusForm = (props: Props) => {
    const { aktivitet, onSubmit, disabled } = props;

    const defaultValues: AktivitetStatusFormValues = {
        should_validate_begrunnelse: false,
        aktivitetstatus: aktivitet.status,
        aktivitet: aktivitet,
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<AktivitetStatusFormValues>({ defaultValues, resolver: zodResolver(schema), shouldFocusError: true });

    useEffect(() => {
        reset();
        setValue('aktivitet', aktivitet);
    }, [aktivitet]);

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('status', isDirty);
        return () => {
            setFormIsDirty('status', false);
        };
    }, [setFormIsDirty, isDirty]);

    const status = watch('aktivitetstatus');
    const visAdvarsel = status === STATUS_FULLFOERT || status === STATUS_AVBRUTT;
    const visBegrunnelseFelt = trengerBegrunnelse(aktivitet.avtalt, status, aktivitet.type);

    const onChangeStatus = (value: AktivitetStatus) => {
        setValue('aktivitetstatus', value);
    };

    const begrunnelseValue = watch('begrunnelse'); // for <Textarea /> character-count to work

    useEffect(() => {
        if (visBegrunnelseFelt) {
            setValue('should_validate_begrunnelse', true);
        } else {
            setValue('should_validate_begrunnelse', false);
        }
    }, [visBegrunnelseFelt]);

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
            <RadioGroup legend={null} hideLegend value={status} onChange={onChangeStatus} disabled={disabled}>
                {Object.entries(RadioButtons).map(([key, value]) => (
                    <Radio key={key} value={key}>
                        {value}
                    </Radio>
                ))}
            </RadioGroup>
            {visAdvarsel ? (
                <Alert variant={'warning'}>
                    Hvis du endrer til &quot;Fullført&quot; eller &quot;Avbrutt&quot;, blir aktiviteten låst og du kan
                    ikke lenger endre innholdet.
                </Alert>
            ) : null}
            {visBegrunnelseFelt ? (
                <Textarea
                    disabled={disabled}
                    label={label(status)}
                    maxLength={255}
                    {...register('begrunnelse')}
                    error={(errors as any).begrunnelse && (errors as any).begrunnelse.message}
                    value={begrunnelseValue}
                />
            ) : null}
            <CustomErrorSummary errors={errors} />
            <Button loading={isSubmitting} className="mt-4" disabled={disabled}>
                Lagre
            </Button>
        </form>
    );
};

export default AktivitetStatusForm;
