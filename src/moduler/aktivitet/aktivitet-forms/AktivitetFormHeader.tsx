import { Heading } from '@navikt/ds-react';
import React from 'react';

import { AktivitetType } from '../../../datatypes/aktivitetTypes';
import AktivitetIngress from '../visning/aktivitetingress/AktivitetIngress';

interface Props {
    tittel: string;
    aktivitetstype: AktivitetType;
}

const AktivitetFormHeader = ({ tittel, aktivitetstype }: Props) => {
    return (
        <div className="mb-8 mt-4">
            <Heading level="1" size="xlarge">
                {tittel}
            </Heading>
            <AktivitetIngress aktivitetstype={aktivitetstype} />
        </div>
    );
};

export default AktivitetFormHeader;
