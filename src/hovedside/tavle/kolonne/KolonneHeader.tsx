import { Heading } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../constant';
import { AktivitetStatus } from '../../../datatypes/aktivitetTypes';
import AktivitetsplanHjelpetekst from '../../../moduler/hjelpetekst/AktivitetsplanHjelpetekst';

const mapKlassenavn = (aktivitetStatus: string) => {
    switch (aktivitetStatus) {
        case STATUS_BRUKER_ER_INTRESSERT:
        case STATUS_PLANLAGT:
        case STATUS_GJENNOMFOERT:
            return 'aktivitet-apen';

        case STATUS_FULLFOERT:
        case STATUS_AVBRUTT:
            return 'aktivitet-last';

        default:
            return null;
    }
};

interface Props {
    status: AktivitetStatus;
}

const KolonneHeader = (props: Props) => {
    const { status } = props;

    return (
        <div className={`flex justify-between pb-2 ${mapKlassenavn(status)}`}>
            <Heading className="text-left" level="2" size="small">
                <FormattedMessage id={`aktivitetstavle.${status}`} />
            </Heading>
            <AktivitetsplanHjelpetekst status={status} />
        </div>
    );
};

export default KolonneHeader;
