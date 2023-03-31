import { Heading } from '@navikt/ds-react';
import React from 'react';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import AktivitetsplanHjelpetekst from '../../../moduler/hjelpetekst/AktivitetsplanHjelpetekst';
import { aktivitetStatusMap } from '../../../utils/textMappers';

interface Props {
    status: AktivitetStatus;
}

const KolonneHeader = (props: Props) => {
    const { status } = props;

    return (
        <div className="flex justify-between pb-2">
            <Heading className="text-left" level="2" size="small">
                {aktivitetStatusMap[status]}
            </Heading>
            <AktivitetsplanHjelpetekst status={status} />
        </div>
    );
};

export default KolonneHeader;
