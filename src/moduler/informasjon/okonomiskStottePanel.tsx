import { Accordion, Link } from '@navikt/ds-react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';

export function OkonomiskStotte() {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <Undertittel>Aktivitetsplanen handler ikke om økonomi</Undertittel>
            </Accordion.Header>
            <Accordion.Content>
                <Normaltekst>
                    Aktivitetsplanen og dialogen skal bare handle om jobbrettede aktiviteter. Har du spørsmål om
                    økonomisk støtte, økonomisk sosialhjelp, boligsituasjon eller andre ting som ikke handler om å komme
                    i jobb, kan du
                </Normaltekst>
                <ul>
                    <Normaltekst tag="li">
                        kontakte NAV i tjenesten{' '}
                        <Link href="https://www.nav.no/person/kontakt-oss/skriv-til-oss">«Skriv til oss»</Link>
                    </Normaltekst>
                    <Normaltekst tag="li">ringe NAV på 55 55 33 33</Normaltekst>
                </ul>
            </Accordion.Content>
        </Accordion.Item>
    );
}
