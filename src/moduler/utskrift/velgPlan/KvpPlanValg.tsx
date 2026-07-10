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
        <Radio value={kvpPeriode.startTidspunkt} disabled={!kvpPeriode.sluttTidspunkt}>
            <UtskriftValg
                tittelId="KVP-perioden"
                tekstId="Du skriver ut innholdet i KVP-perioden. Velger du dette kan du ikke sende dokumentet automatisk til bruker."
            />
        </Radio>
    );
};

const KvpPlanListeValg = (props: Props) => {
    const { kvpPerioder } = props;

    return (
        <div className="">
            <UtskriftValg
                tittelId="KVP-perioden"
                tekstId="Du skriver ut innholdet i KVP-perioden. Velger du dette kan du ikke sende dokumentet automatisk til bruker."
            />
            {kvpPerioder &&
                kvpPerioder.map((kvpPeriode) => (
                    <Radio
                        key={kvpPeriode.startTidspunkt}
                        className="pt-2"
                        value={kvpPeriode.startTidspunkt}
                        disabled={!kvpPeriode.sluttTidspunkt}
                    >
                        <BodyShort>
                            {`${formaterDatoKortManed(kvpPeriode.startTidspunkt)} - ${
                                kvpPeriode.sluttTidspunkt ? formaterDatoKortManed(kvpPeriode.sluttTidspunkt) : 'nå'
                            }`}
                        </BodyShort>
                    </Radio>
                ))}
        </div>
    );
};

export default KvpPlanValg;
