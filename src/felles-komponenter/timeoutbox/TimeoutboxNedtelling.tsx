import { BodyLong, BodyShort, Button, Link, Modal } from '@navikt/ds-react';
import { differenceInSeconds, parseISO, secondsToMinutes } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Env, getEnv } from '../../environment';

interface Props {
    expirationTimestamp: string;
}

const logoutLenke =
    getEnv() === Env.Dev
        ? 'https://login.ekstern.dev.nav.no/oauth2/logout'
        : 'https://login.ekstern.nav.no/oauth2/logout';

const TimeoutboxNedtelling = (props: Props) => {
    const { expirationTimestamp } = props;
    const [sekunderIgjen, setSekunderIgjen] = useState(differenceInSeconds(parseISO(expirationTimestamp), new Date()));

    useEffect(() => {
        const interval = setInterval(() => {
            setSekunderIgjen(sekunderIgjen - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [sekunderIgjen]);

    if (sekunderIgjen <= 0) {
        return (
            <Modal.Body>
                <BodyShort spacing>Sesjonen har utløpt. Du må logge inn igjen for å fortsette.</BodyShort>
                <Button variant="primary" className="mt-2" onClick={() => window.location.reload()}>
                    Last siden på nytt
                </Button>
            </Modal.Body>
        );
    }

    const tid = secondsToMinutes(sekunderIgjen);
    const tekst = tid === 0 ? `${sekunderIgjen} sekunder` : `${tid} minutter`;

    return (
        <Modal.Body>
            <BodyLong className="blokk-xxs" spacing>
                {`Din sesjon vil utløpe om ${tekst}. Dersom du ikke laster siden på nytt, vil du bli logget ut. Ta vare på alt ulagret arbeid. For å laste siden på nytt, vennligst trykk "Last siden på nytt".`}
            </BodyLong>
            <Button className="mr-4" onClick={() => window.location.reload()}>
                Last siden på nytt
            </Button>
            <Link href={logoutLenke}>
                <Button variant="secondary">Logg ut</Button>
            </Link>
        </Modal.Body>
    );
};

export default TimeoutboxNedtelling;
