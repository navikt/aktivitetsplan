import { Heading } from '@navikt/ds-react';
import React from 'react';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import AktivitetsplanHjelpetekst from '../../../moduler/hjelpetekst/AktivitetsplanHjelpetekst';
import KolonneSortering from '../../../moduler/filtrering/sortering/Sortering';
import { aktivitetStatusMap } from '../../../utils/textMappers';

interface Props {
    status: AktivitetStatus;
}

const KolonneHeader = (props: Props) => {
    const { status } = props;

    return (
        <div className="flex justify-between items-center pb-2">
            <Heading className="text-left" level="2" size="small">
                {aktivitetStatusMap[status]}
            </Heading>
            <div className="flex items-center">
                <KolonneSortering status={status} />
                <AktivitetsplanHjelpetekst status={status} />
            </div>
        </div>
    );
};

export default KolonneHeader;
