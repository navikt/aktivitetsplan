import { Heading } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import AktivitetsplanHjelpetekst from '../../../moduler/hjelpetekst/AktivitetsplanHjelpetekst';

interface Props {
    status: AktivitetStatus;
}

const KolonneHeader = (props: Props) => {
    const { status } = props;

    return (
        <div className="flex justify-between pb-2">
            <Heading className="text-left" level="2" size="small">
                <FormattedMessage id={`aktivitetstavle.${status}`} />
            </Heading>
            <AktivitetsplanHjelpetekst status={status} />
        </div>
    );
};

export default KolonneHeader;
