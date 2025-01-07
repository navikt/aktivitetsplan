import { Alert, Heading, Link } from '@navikt/ds-react';
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
                Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.
            </Alert>
        );
    } else if (reservertIKRR) {
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                <Heading spacing size="small" level="3">
                    Du har reservert deg mot digital kommunikasjon &nbsp;
                </Heading>
                Du kan ikke bruke aktivitetsplanen fordi du har reservert deg
                mot digital kommunikasjon i kontakt og reservasjonsregisteret (KRR)
                <Link href={'https://www.norge.no/nb/digital-borgar/reservasjon'}>
                    Gå til norge.no for å fjerne reservasjonen.
                </Link>
            </Alert>
        );
    }
    if (localStorage.getItem('erKRRBruker') === 'false') {
        console.log("erKRRBruker i krr 121231342g eviwjfbo2ebvojwbvohjwr")
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                <Heading spacing size="small" level="3">
                    Vi har ikke din kontaktinformasjon &nbsp;
                </Heading>
                Du kan ikke sende meldinger i dialogen fordi du ikke har registrert
                e-post eller telefonnummeret ditt i kontakt og reservasjonsregisteret (KRR).
                <Link href={'https://www.norge.no/nb/digital-borgar/reservasjon'}>
                    Gå til norge.no for å fjerne reservasjonen.
                </Link>
            </Alert>
        );
    }
};

export default AktiverDigitalOppfolgingVarsel;
