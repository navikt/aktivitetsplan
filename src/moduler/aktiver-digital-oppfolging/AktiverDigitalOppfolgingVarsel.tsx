import { Alert, Link } from '@navikt/ds-react';
import React from 'react';

interface Props {
    reservertIKRR: boolean;
    settDigitalFeilet: boolean;
}

const AktiverDigitalOppfolgingVarsel = (props: Props) => {
    const { reservertIKRR, settDigitalFeilet } = props;

    if (settDigitalFeilet) {
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                Feilet. Prøv igjen senere!
            </Alert>
        );
    }

    if (!reservertIKRR) {
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                Du har ikke digital oppfølging fra NAV. Du har derfor ikke en digital aktivitetsplan.
            </Alert>
        );
    } else {
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                For å ta i bruk aktivitetsplanen, må du fjerne reservasjonen din mot digital kommunikasjon. &nbsp;
                <Link href={'https://www.norge.no/nb/digital-borgar/reservasjon'}>
                    Gå til Norge.no for å fjerne reservasjonen
                </Link>
            </Alert>
        );
    }
};

export default AktiverDigitalOppfolgingVarsel;
