import { Alert, Heading, Link } from '@navikt/ds-react';
import React from 'react';
import { useErVeileder } from '../../Provider';

interface Props {
    reservertIKRR: boolean;
    settDigitalFeilet: boolean;
}

const AktiverDigitalOppfolgingVarsel = (props: Props) => {
    const { reservertIKRR, settDigitalFeilet } = props;
    const erVeileder = useErVeileder();

    if (settDigitalFeilet) {
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                Feilet. Prøv igjen senere!
            </Alert>
        );
    }

    //å være enten manuell eller reservert i krr for å kunne komme hit
    if (!reservertIKRR) {
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.
            </Alert>
        );
    } else if (reservertIKRR && !erVeileder) {
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
    else if (reservertIKRR && erVeileder) {
        return (
            <Alert variant="warning" className="mx-2 mb-5 max-w-2xl">
                <Heading spacing size="small" level="3">
                    Brukeren er reservert i KRR &nbsp;
                </Heading>
                Du kan ikke sende meldinger fordi brukeren har
                reservert seg mot digital kommunikasjon KRR.
                <Link href={'https://www.norge.no/nb/digital-borgar/reservasjon'}>
                    Gå til norge.no for å fjerne reservasjonen.
                </Link>
            </Alert>
        )
    }
};

export default AktiverDigitalOppfolgingVarsel;
