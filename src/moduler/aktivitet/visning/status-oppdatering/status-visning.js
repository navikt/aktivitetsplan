import React from 'react';
import PT from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../../constant';

function getStatusText(status) {
    switch (status) {
        case STATUS_BRUKER_ER_INTRESSERT:
            return 'Forslag';
        case STATUS_PLANLAGT:
            return 'Planlegger';
        case STATUS_GJENNOMFOERT:
            return 'Gjennomfører';
        case STATUS_FULLFOERT:
            return 'Fullført';
        case STATUS_AVBRUTT:
            return 'Avbrutt';
        default:
            return '';
    }
}

function StatusVisning(props) {
    const { status } = props;
    return (
        <Normaltekst>
            {getStatusText(status)}
        </Normaltekst>
    );
}

StatusVisning.propTypes = {
    status: PT.string.isRequired,
};

export default StatusVisning;
