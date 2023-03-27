import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import * as konstanter from '../../../../constant';
import { StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { DirtyContext } from '../../../context/dirty-context';

interface Props {
    soknadsstatus?: Exclude<StillingFraNavSoknadsstatus, 'IKKE_FATT_JOBBEN'>; // IKKE_FATT_JOBBEN kan kun endres i backend
    disabled: boolean;
    onSubmit(val: { soknadsstatus: string }): Promise<any>;
}

const RadioButtons: Record<Exclude<StillingFraNavSoknadsstatus, 'IKKE_FATT_JOBBEN'>, string> = {
    VENTER: 'Venter på å bli kontaktet av NAV eller arbeidsgiver',
    CV_DELT: 'CV er delt med arbeidsgiver',
    SKAL_PAA_INTERVJU: 'Skal på intervju',
    JOBBTILBUD: 'Fått jobbtilbud',
    AVSLAG: 'Ikke fått jobben',
};

const schema = z.object({
    soknadsstatus: z.enum([
        konstanter.VENTER,
        konstanter.CV_DELT,
        konstanter.SKAL_PAA_INTERVJU,
        konstanter.JOBBTILBUD,
        konstanter.AVSLAG,
    ]),
});

export type SoknadsstatusFormValues = z.infer<typeof schema>;

const SoknadsstatusForm = (props: Props) => {
    const { soknadsstatus, disabled, onSubmit } = props;

    const defaultValues: SoknadsstatusFormValues = {
        soknadsstatus: soknadsstatus || konstanter.VENTER,
    };

    const {
        handleSubmit,
        setValue,
        formState: { isDirty, isSubmitting },
    } = useForm<SoknadsstatusFormValues>({ defaultValues, resolver: zodResolver(schema), shouldFocusError: true });

    const { setFormIsDirty } = useContext(DirtyContext);

    useEffect(() => {
        setFormIsDirty('soknadsstatus', isDirty);
        return () => {
            setFormIsDirty('soknadsstatus', false);
        };
    }, [setFormIsDirty, isDirty]);

    const disable = isSubmitting || disabled;

    const onChangeSoknadsstatus = (value: Exclude<StillingFraNavSoknadsstatus, 'IKKE_FATT_JOBBEN'>) => {
        setValue('soknadsstatus', value);
    };

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="pb-4">
                <RadioGroup
                    legend={''}
                    defaultValue={defaultValues.soknadsstatus}
                    onChange={onChangeSoknadsstatus}
                    disabled={disable}
                >
                    {Object.entries(RadioButtons).map(([key, value]) => (
                        <Radio key={key} value={key}>
                            {value}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>
            <Button className="oppdater-status" disabled={disable} loading={isSubmitting}>
                Lagre
            </Button>
        </form>
    );
};

export default SoknadsstatusForm;
