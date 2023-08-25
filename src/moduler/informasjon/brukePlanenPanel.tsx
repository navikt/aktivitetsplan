import { Accordion, BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';

export const BrukePlanenPanel = () => {
    return (
        <Accordion.Item>
            <Accordion.Header>
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
                    Avtalt med NAV
                </Heading>
                <BodyShort>
                    Når du har avtalt å gjennomføre en aktivitet med veilederen din, vil veilederen merke den «Avtalt
                    med NAV». Du må gjennomføre slike aktiviteter. Hvis du ikke følger opp avtalte aktiviteter, kan du
                    risikere å miste pengestøtte fra NAV.
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
                    Hvis du har vært registrert hos NAV før, kan du se aktivitetsplanen fra denne perioden.
                </BodyShort>
            </Accordion.Content>
        </Accordion.Item>
    );
};
