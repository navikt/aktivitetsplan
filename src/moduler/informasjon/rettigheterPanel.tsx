import { Accordion } from '@navikt/ds-react';
import Lenke from 'nav-frontend-lenker';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import styles from './informasjon-modal.module.less';

export function RettigheterPanel() {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <Undertittel>Rettigheter og personvern</Undertittel>
            </Accordion.Header>
            <Accordion.Content>
                <Normaltekst>
                    Du har rett til å få en aktivitetsplan når du har registrert deg hos NAV. Informasjonen i
                    aktivitetsplanen og annen informasjon du gir til veilederen din brukes til å vurdere ditt behov for
                    hjelp fra NAV.
                </Normaltekst>
                <Element className={styles.element}>Manuell oppfølging</Element>
                <Normaltekst>
                    NAV henter informasjon om deg fra Folkeregisteret og sjekker mot Kontakt- og reservasjonsregisteret
                    for å se om du har reservert deg mot digital kommunikasjon med det offentlige. Hvis du har reservert
                    deg, eller ikke er i stand til å bruke aktivitetsplanen, vil NAV følge deg opp manuelt. Det betyr at
                    en veileder følger deg opp, uten at du selv bruker den digitale aktivitetsplanen. Du får
                    aktivitetsplanen skrevet ut på papir.
                </Normaltekst>
                <Element className={styles.element}>Deling og lagring</Element>
                <Normaltekst className={styles.avsnitt}>
                    Opplysningene i aktivitetsplanen blir ikke delt med andre offentlige etater, med mindre de har rett
                    til å hente slike opplysninger.
                </Normaltekst>
                <Normaltekst className={styles.avsnitt}>
                    Opplysningene i aktivitetsplanen din blir lagret og oppbevart etter arkivloven. Aktiviteter og
                    meldinger i dialogen kan ikke slettes når de først er opprettet.
                </Normaltekst>
                <Normaltekst>
                    Les mer om{' '}
                    <Lenke href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten">
                        hvordan NAV behandler personopplysninger
                    </Lenke>
                    .
                </Normaltekst>
            </Accordion.Content>
        </Accordion.Item>
    );
}
