import { Accordion, BodyShort, Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import AktivitetskortVideo from './Video/AktivitetskortVideo';
import { logAccordionAapnet } from '../../analytics/umami';

export const BrukePlanenPanel = () => {
    const [open, setOpen] = useState(false);

    function handleClick() {
        if (!open) {
            logAccordionAapnet('Slik bruker du aktivitetsplanen');
        }
        setOpen(!open);
    }

    return (
        <Accordion.Item>
            <Accordion.Header onClick={handleClick}>
                <Heading level="2" size="small">
                    Slik bruker du aktivitetsplanen
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <BodyShort className="pb-4">
                    Bestem deg først for hva som er målet ditt. Du kan endre dette senere. Vurder så hvilke aktiviteter
                    du ønsker å gjøre for å nå målet, for eksempel å søke jobber, gjennomføre et kurs eller
                    arbeidstrening.
                </BodyShort>
                <BodyShort>
                    I aktivitetsplanen kan du og veilederen din samarbeide om hva som skal til for at du skal komme i
                    aktivitet eller jobb. Du og veilederen din ser den samme planen.
                </BodyShort>
                <Heading level="3" size="xsmall" className="pt-4">
                    Avtalt med Nav
                </Heading>
                <BodyShort className="pb-4">
                    Når du har avtalt å gjennomføre en aktivitet med veilederen din, vil veilederen merke den «Avtalt
                    med Nav». Du må gjennomføre slike aktiviteter. Hvis du ikke følger opp avtalte aktiviteter, kan du
                    risikere å miste pengestøtte fra Nav.
                </BodyShort>
                <BodyShort>
                    Når en aktivitet er markert med "avtalt med Nav" kan teksten ikke lenger endres på. Noen datoer kan
                    likevel endres på, men ingen annen tekst. Det er laget slik for at ingen skal kunne endre på
                    detaljer som kan være viktige for din sak i Nav.
                </BodyShort>
                <Heading level="3" size="xsmall" className="pt-4">
                    Flytte på en aktivitet
                </Heading>
                <BodyShort>
                    Aktivitetsplanen har fem kolonner med statusene forslag, planlegger, gjennomfører, fullført og
                    avbrutt. Statusen på aktiviteten viser til hvor langt du har kommet i gjennomføringen. Du kan
                    oppdatere statusen inne i aktiviteten, for eksempel fra «gjennomfører» til «fullført».
                </BodyShort>
                <Heading level="3" size="xsmall" className="pt-4">
                    Fullførte eller avbrutte aktiviteter
                </Heading>
                <BodyShort>
                    Når en aktivitet flyttes til "fullført" eller "avbrutt", blir aktiviteten låst slik at hverken du
                    eller veilederen din kan endre innholdet i etterkant. Pass på å gjøre viktige endringer før
                    aktiviteten låses.
                </BodyShort>
                <Heading level="3" size="xsmall" className="pt-4">
                    Blå prikk
                </Heading>
                <BodyShort>
                    Hvis du ser at en aktivitet er merket med blå prikk, er det veilederen din som har gjort noe nytt
                    siden sist du var inne i aktiviteten.
                </BodyShort>
                <Heading level="3" size="xsmall" className="pt-4">
                    Tidligere planer
                </Heading>
                <BodyShort>
                    Hvis du har vært registrert hos Nav før, kan du se aktivitetsplanen fra denne perioden.
                </BodyShort>
                <AktivitetskortVideo />
            </Accordion.Content>
        </Accordion.Item>
    );
};
