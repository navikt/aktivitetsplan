import { BodyLong, BodyShort, Button, Heading, Modal } from '@navikt/ds-react';
import { differenceInSeconds, parseISO, secondsToMinutes } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface Props {
    expirationTimestamp: string;
}

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
            <Modal.Content>
                <Heading level="1" size="large" spacing>
                    Obs!
                </Heading>
                <BodyShort spacing>Sesjonen har utløpt. Du må logge inn igjen for å fortsette.</BodyShort>
                <Button variant="primary" className="mt-2" onClick={() => window.location.reload()}>
                    Last siden på nytt
                </Button>
            </Modal.Content>
        );
    }

    const tid = secondsToMinutes(sekunderIgjen);
    const tekst = tid === 0 ? `${sekunderIgjen} sekunder` : `${tid} minutter`;

    return (
        <Modal.Content>
            <Heading className="blokk-s" level="1" size="large" spacing>
                Obs!
            </Heading>
            <BodyLong className="blokk-xxs" spacing>
                {`Din sesjon vil utløpe om ${tekst}. Dersom du ikke laster siden på nytt, vil du bli logget ut. Ta vare på alt ulagret arbeid. For å laste siden på nytt, vennligst trykk "Last siden på nytt".`}
            </BodyLong>
            <Button className="mr-4" onClick={() => window.location.reload()}>
                Last siden på nytt
            </Button>
            <Button variant="secondary" onClick={() => document.querySelector('#login-knapp-id').click()}>
                Logg ut
            </Button>
        </Modal.Content>
    );
};

export default TimeoutboxNedtelling;
