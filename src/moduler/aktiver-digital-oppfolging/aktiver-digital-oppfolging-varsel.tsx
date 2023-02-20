import { Alert } from '@navikt/ds-react';
import Lenke from 'nav-frontend-lenker';
import React from 'react';

interface PropTypes {
    reservertIKRR: boolean;
    settDigitalFeilet: boolean;
}

const AktiverDigitalOppfolgingVarsel = (props: PropTypes): React.ReactElement => {
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
                <Lenke href={'https://www.norge.no/nn/reservasjon'}>Gå til Norge.no for å fjerne reservasjonen</Lenke>
            </Alert>
        );
    }
};

export default AktiverDigitalOppfolgingVarsel;
