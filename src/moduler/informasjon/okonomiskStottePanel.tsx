import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react';
import React from 'react';

export const OkonomiskStotte = () => {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <Heading level="2" size="small">
                    Aktivitetsplanen handler ikke om økonomi
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <BodyShort>
                    Aktivitetsplanen og dialogen skal bare handle om jobbrettede aktiviteter. Har du spørsmål om
                    økonomisk støtte, økonomisk sosialhjelp, boligsituasjon eller andre ting som ikke handler om å komme
                    i jobb, kan du
                </BodyShort>
                <ul>
                    <BodyShort as="li">
                        kontakte NAV i tjenesten{' '}
                        <Link href="https://www.nav.no/person/kontakt-oss/skriv-til-oss">«Skriv til oss»</Link>
                    </BodyShort>
                    <BodyShort as="li">ringe NAV på 55 55 33 33</BodyShort>
                </ul>
            </Accordion.Content>
        </Accordion.Item>
    );
};
