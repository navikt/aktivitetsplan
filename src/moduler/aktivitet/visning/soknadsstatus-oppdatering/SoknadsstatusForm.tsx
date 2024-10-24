import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';

import { StillingFraNavSoknadsstatus } from '../../../../datatypes/aktivitetTypes';
import { DirtyContext } from '../../../context/dirty-context';
import { selectOppdaterStillingFraNavSoknadsstatusFeil } from '../../../feilmelding/feil-selector';
import Feilmelding from '../../../feilmelding/Feilmelding';

type StatuserFraBackend = StillingFraNavSoknadsstatus.IKKE_FATT_JOBBEN | StillingFraNavSoknadsstatus.FATT_JOBBEN | StillingFraNavSoknadsstatus.CV_DELT
interface Props {
    soknadsstatus?: Exclude<StillingFraNavSoknadsstatus, StatuserFraBackend>; // IKKE_FATT_JOBBEN, FATT_JOBBEN og CV_DELT kan kun endres i backend
    disabled: boolean;
    onSubmit(val: { soknadsstatus: string }): Promise<any>;
}


const RadioButtons: Record<
    Exclude<StillingFraNavSoknadsstatus, StatuserFraBackend>,
    string
> = {
    VENTER: 'Venter på å bli kontaktet av Nav eller arbeidsgiver',
    SKAL_PAA_INTERVJU: 'Skal på intervju',
    JOBBTILBUD: 'Fått jobbtilbud',
    AVSLAG: 'Ikke fått jobben',
};

const schema = z.object({
    soknadsstatus: z.enum([
        StillingFraNavSoknadsstatus.VENTER,
        StillingFraNavSoknadsstatus.SKAL_PAA_INTERVJU,
        StillingFraNavSoknadsstatus.JOBBTILBUD,
        StillingFraNavSoknadsstatus.AVSLAG,
    ]),
});

export type SoknadsstatusFormValues = z.infer<typeof schema>;

const SoknadsstatusForm = (props: Props) => {
    const { soknadsstatus, disabled, onSubmit } = props;

    const defaultValues: SoknadsstatusFormValues = {
        soknadsstatus: soknadsstatus || StillingFraNavSoknadsstatus.VENTER,
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

    const onChangeSoknadsstatus = (
        value: Exclude<StillingFraNavSoknadsstatus, StatuserFraBackend >
    ) => {
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
            <Feilmelding feilmeldinger={useSelector(selectOppdaterStillingFraNavSoknadsstatusFeil)} />
            <Button className="oppdater-status" disabled={disable} loading={isSubmitting}>
                Lagre
            </Button>
        </form>
    );
};

export default SoknadsstatusForm;
