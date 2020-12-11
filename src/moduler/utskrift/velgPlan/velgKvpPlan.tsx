import { FieldState } from '@nutgaard/use-formstate';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';
import Radio from '../../../felles-komponenter/skjema/input/radio';
import { formaterDatoKortManed } from '../../../utils';
import UtskriftValg from './utskriftValg';

interface KvpPlanValgProps {
    kvpPerioder?: KvpPeriode[];
    field: FieldState;
}

function KvpPlanValg(props: KvpPlanValgProps) {
    const { kvpPerioder, field } = props;

    if (!kvpPerioder) return null;

    if (kvpPerioder.length === 1) {
        return <KvpPlanSingelValg kvpPeriode={kvpPerioder[0]} field={field} />;
    } else {
        return <KvpPlanListeValg kvpPerioder={kvpPerioder} field={field} />;
    }
}

interface KvpPlanSingelValgProps {
    kvpPeriode: KvpPeriode;
    field: FieldState;
}

function KvpPlanSingelValg(props: KvpPlanSingelValgProps) {
    const { kvpPeriode, field } = props;

    return (
        <Radio
            id={kvpPeriode.opprettetDato}
            label={<UtskriftValg tittelId="KVP-perioden" tekstId="Du skriver ut innholdet i KVP-perioden" />}
            value={kvpPeriode.opprettetDato}
            disabled={!kvpPeriode.avsluttetDato}
            {...field}
        />
    );
}

function KvpPlanListeValg(props: KvpPlanValgProps) {
    const { kvpPerioder, field } = props;
    return (
        <div className="kvp-plan-valg">
            <UtskriftValg tittelId="KVP-perioden" tekstId="Du skriver ut innholdet i KVP-perioden" />
            {kvpPerioder &&
                kvpPerioder.map((kvp) => (
                    <Radio
                        key={kvp.opprettetDato}
                        id={kvp.opprettetDato}
                        label={
                            <Normaltekst>
                                {`${formaterDatoKortManed(kvp.opprettetDato)} - ${
                                    formaterDatoKortManed(kvp.avsluttetDato) || 'nå'
                                }`}
                            </Normaltekst>
                        }
                        className="kvp-periode-valg"
                        value={kvp.opprettetDato}
                        disabled={!kvp.avsluttetDato}
                        {...field}
                    />
                ))}
        </div>
    );
}

export default KvpPlanValg;
