import { HelpText } from '@navikt/ds-react';
import React from 'react';
import { AktivitetStatus } from '../../datatypes/aktivitetTypes';
import { logKlikkKnapp } from '../../amplitude/umami.client';

const hjelpetekster: Record<AktivitetStatus, { tittel: string; innhold: string }> = {
    BRUKER_ER_INTERESSERT: {
        tittel: 'Informasjon om statusen Forslag',
        innhold:
            'Her kan du legge til en aktivitet du tror du kommer til å gjøre. Dra aktiviteten til "Planlegger" når du bestemmer deg for å gjøre aktiviteten.',
    },
    PLANLAGT: {
        tittel: 'Informasjon om statusen Planlegger',
        innhold: 'Her kan du legge aktiviteter som du har bestemt deg for å gjøre, men ikke har begynt på enda.',
    },
    GJENNOMFORES: {
        tittel: 'Informasjon om statusen Gjennomfører',
        innhold: 'Aktiviteter som du holder på med, kan du sette til "Gjennomfører".',
    },
    FULLFORT: {
        tittel: 'Informasjon om statusen Fullført',
        innhold:
            'Dra aktiviteter hit som du er ferdig med. Flytter du en aktivitet til "Fullført", blir den låst og kan ikke redigeres. Hvis du angrer, kan du legge til en ny aktivitet.',
    },
    AVBRUTT: {
        tittel: 'Informasjon om statusen Avbrutt',
        innhold:
            'Dra aktiviteter hit som du avslutter eller ikke begynner på. Flytter du en aktivitet til "Avbrutt", blir den låst og kan ikke redigeres. Hvis du angrer, kan du legge til en ny aktivitet.',
    },
};

interface Props {
    status: AktivitetStatus;
}

const AktivitetsplanHjelpetekst = ({ status }: Props) => {
    const config = hjelpetekster[status];
    const { tittel, innhold } = config;

    return (
        <HelpText
            placement={'bottom-end'}
            id={status}
            aria-label={tittel}
            title={tittel}
            onClick={() => logKlikkKnapp('Klikket hjelpeikon i kolonne ' + status)}
        >
            <div className="w-80">{innhold}</div>
        </HelpText>
    );
};

export default AktivitetsplanHjelpetekst;
