import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import { KvpPeriode } from '../../../types';
import UtskriftValg from './utskriftValg';
import KvpPlanValg from './velgKvpPlan';
import Radio from '../../../felles-komponenter/skjema/input/radio';

const validator = useFormstate({
    utskriftPlanType: () => undefined
});

interface VelgPlanUtskriftFormProps {
    onSubmit: (string) => Promise<any>;
    hidden?: boolean;
    kvpPerioder?: KvpPeriode[];
}

function VelgPlanUtskriftForm(props: VelgPlanUtskriftFormProps) {
    const { onSubmit, kvpPerioder, hidden } = props;

    const initial = {
        utskriftPlanType: 'helePlanen'
    };

    const submit = (form: { utskriftPlanType: string }) => {
        return onSubmit(form.utskriftPlanType);
    };

    const state = validator(initial);

    return (
        <form onSubmit={state.onSubmit(submit)} className="printmelding__form" hidden={hidden}>
            <div className="printmelding__skjema">
                <div className="printmelding__tittel">
                    <Innholdstittel>Velg hva du ønsker å skrive ut</Innholdstittel>
                </div>

                <div>
                    <Radio
                        label={
                            <UtskriftValg
                                tittelId="Hele oppfølgingsperioden"
                                tekstId="Du skriver ut alt innholdet du ser i aktivitetsplan, også KVP-perioden"
                            />
                        }
                        value="helePlanen"
                        id="id--helePlanen"
                        {...state.fields.utskriftPlanType}
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
                        {...state.fields.utskriftPlanType}
                    />
                    <KvpPlanValg kvpPerioder={kvpPerioder} field={state.fields.utskriftPlanType} />
                </div>
            </div>
            <div className="printmelding__knapperad">
                <Hovedknapp>Velg</Hovedknapp>
            </div>
        </form>
    );
}

export default VelgPlanUtskriftForm;
