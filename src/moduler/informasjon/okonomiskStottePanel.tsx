import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';

export function OkonomiskStotte() {
    return (
        <Ekspanderbartpanel tittel="Aktivitetsplanen handler ikke om økonomi" tittelProps="undertittel">
            <p>
                Aktivitetsplanen og dialogen skal bare handle om jobbrettede aktiviteter. Har du spørsmål om økonomisk
                støtte, økonomisk sosialhjelp, boligsituasjon eller andre ting som ikke handler om å komme i jobb, kan
                du
            </p>
            <ul>
                <li>
                    kontakte NAV i tjenesten{' '}
                    <Lenke href="https://www.nav.no/person/kontakt-oss/skriv-til-oss">«Skriv til oss»</Lenke>
                </li>
                <li>ringe NAV på 55 55 33 33</li>
            </ul>
        </Ekspanderbartpanel>
    );
}
