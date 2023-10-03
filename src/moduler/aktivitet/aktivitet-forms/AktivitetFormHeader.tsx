import React from 'react';

import { AktivitetType } from '../../../datatypes/aktivitetTypes';
import AktivitetIngress from '../visning/aktivitetingress/AktivitetIngress';

interface Props {
    aktivitetstype: AktivitetType;
}

const AktivitetFormHeader = ({ aktivitetstype }: Props) => {
    return (
        <div className="mb-8 mt-4">
            <AktivitetIngress aktivitetstype={aktivitetstype} />
        </div>
    );
};

export default AktivitetFormHeader;
