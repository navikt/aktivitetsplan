import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react';
import React from 'react';

import styles from './informasjon-modal.module.less';

export function RettigheterPanel() {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <Heading level="2" size="small">
                    Rettigheter og personvern
                </Heading>
            </Accordion.Header>
            <Accordion.Content>
                <BodyShort>
                    Du har rett til å få en aktivitetsplan når du har registrert deg hos NAV. Informasjonen i
                    aktivitetsplanen og annen informasjon du gir til veilederen din brukes til å vurdere ditt behov for
                    hjelp fra NAV.
                </BodyShort>
                <Heading level="3" size="xsmall" className={styles.element}>
                    Manuell oppfølging
                </Heading>
                <BodyShort>
                    NAV henter informasjon om deg fra Folkeregisteret og sjekker mot Kontakt- og reservasjonsregisteret
                    for å se om du har reservert deg mot digital kommunikasjon med det offentlige. Hvis du har reservert
                    deg, eller ikke er i stand til å bruke aktivitetsplanen, vil NAV følge deg opp manuelt. Det betyr at
                    en veileder følger deg opp, uten at du selv bruker den digitale aktivitetsplanen. Du får
                    aktivitetsplanen skrevet ut på papir.
                </BodyShort>
                <Heading level="3" size="xsmall" className={styles.element}>
                    Deling og lagring
                </Heading>
                <BodyShort className={styles.avsnitt}>
                    Opplysningene i aktivitetsplanen blir ikke delt med andre offentlige etater, med mindre de har rett
                    til å hente slike opplysninger.
                </BodyShort>
                <BodyShort className={styles.avsnitt}>
                    Opplysningene i aktivitetsplanen din blir lagret og oppbevart etter arkivloven. Aktiviteter og
                    meldinger i dialogen kan ikke slettes når de først er opprettet.
                </BodyShort>
                <BodyShort>
                    Les mer om{' '}
                    <Link href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten">
                        hvordan NAV behandler personopplysninger
                    </Link>
                    .
                </BodyShort>
            </Accordion.Content>
        </Accordion.Item>
    );
}
