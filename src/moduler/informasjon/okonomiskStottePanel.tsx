import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react';
import React, { useState } from 'react';
import { logAccordionAapnet } from '../../amplitude/amplitude';

export const OkonomiskStotte = () => {
    const [open, setOpen] = useState(false);

    function handleClick() {
        if (!open) {
            logAccordionAapnet('Aktivitetsplanen handler ikke om økonomi');
        }
        setOpen(!open);
    }

    return (
        <Accordion.Item>
            <Accordion.Header onClick={handleClick}>
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
                <ul className="list-disc mt-4 pl-8">
                    <li>
                        <BodyShort>
                            kontakte Nav i tjenesten{' '}
                            <Link href="https://www.nav.no/person/kontakt-oss/skriv-til-oss">«Skriv til oss»</Link>
                        </BodyShort>
                    </li>
                    <li>
                        <BodyShort>ringe Nav på 55 55 33 33</BodyShort>{' '}
                    </li>
                </ul>
            </Accordion.Content>
        </Accordion.Item>
    );
};
