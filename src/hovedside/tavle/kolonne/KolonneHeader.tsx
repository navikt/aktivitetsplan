import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../constant';
import AktivitetsplanHjelpetekst from '../../../moduler/hjelpetekst/aktivitetsplan-hjelpetekst';

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
    status: string;
}

const KolonneHeader = (props: Props) => {
    const { status } = props;

    return (
        <div className={`aktivitetstavle__kolonne-header-wrapper ${mapKlassenavn(status)}`}>
            <Undertittel className="aktivitetstavle__kolonne-header" tag="h2">
                <FormattedMessage id={`aktivitetstavle.${status}`} />
            </Undertittel>
            <AktivitetsplanHjelpetekst status={status} />
        </div>
    );
};

export default KolonneHeader;
