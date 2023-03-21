import { Button, Heading, RadioGroup } from '@navikt/ds-react';
import useFormstate from '@nutgaard/use-formstate';
import React from 'react';

import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';
import Radio from '../../../felles-komponenter/skjema/input/Radio';
import UtskriftValg from './utskriftValg';
import KvpPlanValg from './velgKvpPlan';

interface VelgPlanUtskriftFormProps {
    onSubmit: (utskriftPlanType: string) => Promise<any>;
    hidden?: boolean;
    kvpPerioder?: KvpPeriode[];
}
type FormType = {
    utskriftPlanType: string;
};

function VelgPlanUtskriftForm(props: VelgPlanUtskriftFormProps) {
    const { onSubmit, kvpPerioder, hidden } = props;

    const validator = useFormstate<FormType>({
        utskriftPlanType: () => undefined,
    });

    const initial = {
        utskriftPlanType: 'helePlanen',
    };

    const submit = (form: { utskriftPlanType: string }) => {
        return onSubmit(form.utskriftPlanType);
    };

    const state = validator(initial);

    return (
        <form onSubmit={state.onSubmit(submit)} className="p-4 space-y-8" hidden={hidden}>
            <RadioGroup
                legend={
                    <Heading className="mb-4" level="1" size="medium">
                        Velg hva du ønsker å skrive ut
                    </Heading>
                }
                defaultValue={'helePlanen'}
            >
                <Radio
                    label={
                        <UtskriftValg
                            tittelId="Hele oppfølgingsperioden"
                            tekstId="Du skriver ut alt innholdet du ser i aktivitetsplan, også KVP-perioden"
                        />
                    }
                    value="helePlanen"
                    id="id--helePlanen"
                />
                <Radio
                    label={
                        <UtskriftValg
                            tittelId="Oppfølgingsperioden uten KVP-perioden"
                            tekstId="Du skriver ut alt innholdet du ser i aktivitetsplan, uten om KVP-perioden"
                        />
                    }
                    value="aktivitetsplan"
                    id="id--aktivitetsplan"
                />
                <KvpPlanValg kvpPerioder={kvpPerioder} field={state.fields.utskriftPlanType} />
            </RadioGroup>
            <Button>Velg</Button>
        </form>
    );
}

export default VelgPlanUtskriftForm;
