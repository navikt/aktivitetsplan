import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';

export function RettigheterPanel() {
    return (
        <Ekspanderbartpanel tittel="Rettigheter og personvern">
            <p>
                Når du henvender deg til NAV fordi du trenger hjelp til å komme i jobb, skal NAV vurdere behovet ditt
                for hjelp.
            </p>
            <p>
                Du har rett til å få en aktivitetsplan. Alle som ikke har reservert seg fra digital kommunikasjon med
                det offentlige, skal bruke aktivitetsplanen og kommunisere med NAV gjennom den. Du kan få manuell
                oppfølging hvis det er gode grunner til det. Manuell oppfølging betyr at en veileder følger deg opp uten
                at du har en digital aktivitetsplan. Veilederen vil legge inn aktiviteter, møtereferat og fylle inn
                målet ditt i aktivitetsplanen for deg. Du får da aktivitetsplanen i papirform.
            </p>
            <p>
                Opplysningene i aktivitetsplanen, slik som aktiviteter, målet ditt og dialogen mellom deg og veilederen
                din, er det du og NAV som legger inn. Formålet med disse opplysningene er å hjelpe deg å komme raskt i
                jobb. Opplysningene dine blir ikke delt med andre instanser eller etater, med mindre de har lovlig
                grunnlag til å samle inn slike opplysninger.
            </p>
            <p>
                NAV henter også informasjon fra Folkeregisteret for å gjøre en sjekk mot Kontakt- og
                reservasjonsregisteret. Dette gjør vi for å se om du har reservert deg mot digital kommunikasjon med det
                offentlige.{' '}
            </p>
            <p>
                Opplysningene i aktivitetsplanen din blir lagret og oppbevart etter arkivloven. Aktiviteter og meldinger
                i dialogen kan ikke slettes når de først er opprettet.
            </p>
            <p>
                Les mer om{' '}
                <Lenke href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten">
                    hvordan NAV behandler personopplysninger
                </Lenke>
                .
            </p>
        </Ekspanderbartpanel>
    );
}
