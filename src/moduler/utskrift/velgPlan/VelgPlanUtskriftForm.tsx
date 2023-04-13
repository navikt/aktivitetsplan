import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';
import KvpPlanValg from './KvpPlanValg';
import UtskriftValg from './utskriftValg';

interface Props {
    kvpPerioder?: KvpPeriode[];
    onSubmit: (formValues: VelgPlanUtskriftFormValues) => Promise<void>;
}

const schema = z.object({
    utskritPlanType: z.string(),
});

export type VelgPlanUtskriftFormValues = z.infer<typeof schema>;

const VelgPlanUtskriftForm = (props: Props) => {
    const { kvpPerioder, onSubmit } = props;

    const defaultValues: VelgPlanUtskriftFormValues = { utskritPlanType: 'helePlanen' };

    const { handleSubmit, setValue } = useForm<VelgPlanUtskriftFormValues>({
        defaultValues,
        resolver: zodResolver(schema),
    });

    const onChangeRadioGroup = (value: string) => {
        setValue('utskritPlanType', value);
    };

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="p-4 space-y-8">
            <RadioGroup
                legend={
                    <Heading className="mb-4" level="1" size="medium">
                        Velg hva du ønsker å skrive ut
                    </Heading>
                }
                defaultValue={'helePlanen'}
                onChange={onChangeRadioGroup}
            >
                <Radio value="helePlanen" id="id--helePlanen">
                    <UtskriftValg
                        tittelId="Hele oppfølgingsperioden"
                        tekstId="Du skriver ut alt innholdet du ser i aktivitetsplan, også KVP-perioden"
                    />
                </Radio>
                <Radio value="aktivitetsplan" id="id--aktivitetsplan">
                    <UtskriftValg
                        tittelId="Oppfølgingsperioden uten KVP-perioden"
                        tekstId="Du skriver ut alt innholdet du ser i aktivitetsplan, uten om KVP-perioden"
                    />
                </Radio>
                <KvpPlanValg kvpPerioder={kvpPerioder} />
            </RadioGroup>
            <Button>Velg</Button>
        </form>
    );
};

export default VelgPlanUtskriftForm;
