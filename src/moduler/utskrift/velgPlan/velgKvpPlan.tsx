import { BodyShort } from '@navikt/ds-react';
import { FieldState } from '@nutgaard/use-formstate';
import React from 'react';

import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';
import Radio from '../../../felles-komponenter/skjema/input/Radio';
import { formaterDatoKortManed } from '../../../utils/dateUtils';
import UtskriftValg from './utskriftValg';

interface KvpPlanValgProps {
    kvpPerioder?: KvpPeriode[];
    field: FieldState;
}

function KvpPlanValg(props: KvpPlanValgProps) {
    const { kvpPerioder, field } = props;

    if (!kvpPerioder) return null;

    if (kvpPerioder.length === 1) {
        return <KvpPlanSingelValgRadio kvpPeriode={kvpPerioder[0]} />;
    } else {
        return <KvpPlanListeValg kvpPerioder={kvpPerioder} field={field} />;
    }
}

interface KvpPlanSingelValgProps {
    kvpPeriode: KvpPeriode;
}

function KvpPlanSingelValgRadio(props: KvpPlanSingelValgProps) {
    const { kvpPeriode } = props;

    return (
        <Radio
            label={<UtskriftValg tittelId="KVP-perioden" tekstId="Du skriver ut innholdet i KVP-perioden" />}
            value={kvpPeriode.opprettetDato}
            disabled={!kvpPeriode.avsluttetDato}
        />
    );
}

function KvpPlanListeValg(props: KvpPlanValgProps) {
    const { kvpPerioder } = props;
    return (
        <div className="kvp-plan-valg">
            <UtskriftValg tittelId="KVP-perioden" tekstId="Du skriver ut innholdet i KVP-perioden" />
            {kvpPerioder &&
                kvpPerioder.map((kvpPeriode) => (
                    <Radio
                        key={kvpPeriode.opprettetDato}
                        label={
                            <BodyShort>
                                {`${formaterDatoKortManed(kvpPeriode.opprettetDato)} - ${
                                    formaterDatoKortManed(kvpPeriode.avsluttetDato) || 'nå'
                                }`}
                            </BodyShort>
                        }
                        className="kvp-periode-valg"
                        value={kvpPeriode.opprettetDato}
                        disabled={!kvpPeriode.avsluttetDato}
                    />
                ))}
        </div>
    );
}

export default KvpPlanValg;
