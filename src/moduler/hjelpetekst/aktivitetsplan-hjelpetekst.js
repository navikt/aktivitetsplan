import React from 'react';
import PT from 'prop-types';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT
} from '../../constant';

const hjelpetekster = {
    [STATUS_BRUKER_ER_INTRESSERT]: {
        tittel: 'Informasjon om statusen Forslag',
        innhold:
            'Legg til en aktivitet du tror du kommer til å gjøre her. Dra aktiviteten til Planlegger når du har bestemt deg for å gjøre aktiviteten.'
    },
    [STATUS_PLANLAGT]: {
        tittel: 'Informasjon om statusen Planlegger',
        innhold:
            'Legg til en aktivitet som du faktisk planlegger å gjøre her. Når du starter aktiviteten, drar du den til Gjennomfører.'
    },
    [STATUS_GJENNOMFOERT]: {
        tittel: 'Informasjon om statusen Gjennomfører',
        innhold:
            'Dra aktiviteter hit som du gjennomfører nå. Har du søkt på en stilling og venter på et svar, kan du vente med å dra aktiviteten til Fullført til du har fått svaret.'
    },
    [STATUS_FULLFOERT]: {
        tittel: 'Informasjon om statusen Fullført',
        innhold:
            'Dra aktiviteter som du er ferdig med hit. Flytter du en aktivitet til Fullført, blir den låst og kan ikke redigeres. Hvis du angrer, kan du opprette en ny tilsvarende aktivitet.'
    },
    [STATUS_AVBRUTT]: {
        tittel: 'Informasjon om statusen Avbrutt',
        innhold:
            'Dra aktiviteter hit som du avbryter eller ikke begynner på. Flytter du en aktivitet til Avbrutt, blir den låst og kan ikke redigeres. Hvis du angrer, kan du opprette en tilsvarende ny aktivitet.'
    }
};

function AktivitetsplanHjelpetekst({ status }) {
    const config = hjelpetekster[status];
    if (!config) {
        return null;
    }

    const { tittel, innhold } = config;
    return (
        <Hjelpetekst type="under-hoyre" id={status} tittel={tittel}>
            <div className="max-width-300">{innhold}</div>
        </Hjelpetekst>
    );
}

AktivitetsplanHjelpetekst.propTypes = {
    status: PT.oneOf(Object.keys(hjelpetekster)).isRequired
};

export default AktivitetsplanHjelpetekst;
