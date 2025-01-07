import { Alert, Heading, Link } from '@navikt/ds-react';
import React from 'react';
import { useErVeileder } from '../../Provider';

interface Props {
    reservertIKRR: boolean;
    settDigitalFeilet: boolean;
}

const tekster = {
    veileder: {
        tittel: 'Brukeren er reservert i KRR',
        tekst: 'Du kan ikke sende meldinger fordi brukeren har reservert seg mot digital kommunikasjon KRR.',
        lenkeTekst: 'Brukeren må gå til norge.no for å fjerne reservasjonen.',
    },
    bruker: {
        tittel: 'Du har reservert deg mot digital kommunikasjon',
        tekst: 'Du kan ikke bruke aktivitetsplanen fordi du har reservert deg mot digital kommunikasjon i kontakt og reservasjonsregisteret (KRR)',
        lenkeTekst: 'Gå til norge.no for å fjerne reservasjonen.',
    },
};

const linkReservertIKrr = 'https://www.norge.no/nb/digital-borger/reservasjon'

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
            <Alert variant="warning" className="mx-2 mt-6 max-w-2xl">
                Du har ikke digital oppfølging fra Nav. Du har derfor ikke en digital aktivitetsplan.
            </Alert>
        );
    } else if (reservertIKRR) {
        const tekst = erVeileder ? tekster.veileder : tekster.bruker;
        return (
            <Alert variant="warning" className="mx-2 mt-6 max-w-2xl">
                <Heading spacing size="small" level="3">
                    {tekst.tittel}
                </Heading>
                <p>{tekst.tekst}</p>
                    <Link href={linkReservertIKrr}>{tekst.lenkeTekst}</Link>
            </Alert>
    );
    }
};

export default AktiverDigitalOppfolgingVarsel;
