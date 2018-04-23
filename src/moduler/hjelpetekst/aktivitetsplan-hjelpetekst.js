import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { HjelpetekstUnderVenstre } from 'nav-frontend-hjelpetekst';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../constant';

const hjelpetekster = {
    [STATUS_BRUKER_ER_INTRESSERT]: {
        tittelId: 'aktivitetstavle.brukerErInteressert.info',
        innholdId: 'hjelpetekst.aktivitet.er.interessert',
    },
    [STATUS_PLANLAGT]: {
        tittelId: 'aktivitetstavle.planlagt.info',
        innholdId: 'hjelpetekst.aktivitet.planlagt',
    },
    [STATUS_GJENNOMFOERT]: {
        tittelId: 'aktivitetstavle.gjennomfoert.info',
        innholdId: 'hjelpetekst.aktivitet.gjennomfoert',
    },
    [STATUS_FULLFOERT]: {
        tittelId: 'aktivitetstavle.fullfoert.info',
        innholdId: 'hjelpetekst.aktivitet.fullfoert',
    },
    [STATUS_AVBRUTT]: {
        tittelId: 'aktivitetstavle.avbrutt.info',
        innholdId: 'hjelpetekst.aktivitet.avbrutt',
    },
};

function AktivitetsplanHjelpetekst({ status }) {
    const config = hjelpetekster[status];
    if (!config) {
        return null;
    }

    const { tittelId, innholdId } = config;
    return (
        <FormattedMessage id={tittelId}>
            {tittel =>
                <HjelpetekstUnderVenstre id={tittelId} tittel={tittel}>
                    <FormattedMessage id={innholdId} />
                </HjelpetekstUnderVenstre>}
        </FormattedMessage>
    );
}

AktivitetsplanHjelpetekst.propTypes = {
    status: PT.oneOf(Object.keys(hjelpetekster)).isRequired,
};

export default AktivitetsplanHjelpetekst;
