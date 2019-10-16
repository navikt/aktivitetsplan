import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

export function OkonomiskStotte() {
    return (
        <Ekspanderbartpanel tittel="Aktivitetsplanen og økonomisk støtte">
            <p>
                Aktivitetsplanen og dialogen skal kun handle om jobbrettede aktiviteter. Du skal derfor ikke skrive om
                økonomisk støtte, økonomisk sosialhjelp, boligsituasjon eller andre ting som ikke handler om jobb.
            </p>
            <p>
                <ul>
                    <li>
                        Bruk nav.no til å finne svar på disse spørsmålene. Hvis du ikke finner svaret der, kan du ringe
                        oss på 55 55 33 33.
                    </li>
                    <li>
                        Hvis du ikke følger opp avtalte aktiviteter, kan det få konsekvenser for oppfølgingen du får fra
                        NAV og eventuell økonomisk støtte.
                    </li>
                </ul>
            </p>
        </Ekspanderbartpanel>
    );
}
