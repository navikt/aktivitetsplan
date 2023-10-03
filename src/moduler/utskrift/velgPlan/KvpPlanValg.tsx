import { BodyShort, Radio } from '@navikt/ds-react';
import React from 'react';

import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';
import { formaterDatoKortManed } from '../../../utils/dateUtils';
import UtskriftValg from './utskriftValg';

interface Props {
    kvpPerioder?: KvpPeriode[];
}

const KvpPlanValg = (props: Props) => {
    const { kvpPerioder } = props;

    if (!kvpPerioder) return null;

    if (kvpPerioder.length === 1) {
        return <KvpPlanSingelValgRadio kvpPeriode={kvpPerioder[0]} />;
    } else {
        return <KvpPlanListeValg kvpPerioder={kvpPerioder} />;
    }
};

const KvpPlanSingelValgRadio = ({ kvpPeriode }: { kvpPeriode: KvpPeriode }) => {
    return (
        <Radio value={kvpPeriode.opprettetDato} disabled={!kvpPeriode.avsluttetDato}>
            <UtskriftValg tittelId="KVP-perioden" tekstId="Du skriver ut innholdet i KVP-perioden" />
        </Radio>
    );
};

const KvpPlanListeValg = (props: Props) => {
    const { kvpPerioder } = props;

    return (
        <div className="">
            <UtskriftValg tittelId="KVP-perioden" tekstId="Du skriver ut innholdet i KVP-perioden" />
            {kvpPerioder &&
                kvpPerioder.map((kvpPeriode) => (
                    <Radio
                        key={kvpPeriode.opprettetDato}
                        className="pt-2"
                        value={kvpPeriode.opprettetDato}
                        disabled={!kvpPeriode.avsluttetDato}
                    >
                        <BodyShort>
                            {`${formaterDatoKortManed(kvpPeriode.opprettetDato)} - ${
                                kvpPeriode.avsluttetDato ? formaterDatoKortManed(kvpPeriode.avsluttetDato) : 'nå'
                            }`}
                        </BodyShort>
                    </Radio>
                ))}
        </div>
    );
};

export default KvpPlanValg;
