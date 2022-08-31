import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import styles from './informasjon-modal.module.css';

export function BrukePlanenPanel() {
    return (
        <Ekspanderbartpanel tittel={<Undertittel>Slik bruker du aktivitetsplanen</Undertittel>}>
            <Normaltekst className={styles.avsnitt}>
                Bestem deg først for hva som er målet ditt. Du kan endre dette senere. Vurder så hvilke aktiviteter du
                ønsker å gjøre for å nå målet, for eksempel å søke jobber, gjennomføre et kurs eller arbeidstrening.
            </Normaltekst>
            <Normaltekst>
                I aktivitetsplanen kan du og veilederen din samarbeide om hva som skal til for at du skal komme i
                aktivitet eller jobb. Du og veilederen din ser den samme planen.
            </Normaltekst>
            <Element className={styles.element}>Avtalt med NAV</Element>
            <Normaltekst>
                Når du har avtalt å gjennomføre en aktivitet med veilederen din, vil veilederen merke den «Avtalt med
                NAV». Du må gjennomføre slike aktiviteter. Hvis du ikke følger opp avtalte aktiviteter, kan du risikere
                å miste pengestøtte fra NAV.
            </Normaltekst>
            <Element className={styles.element}>Flytte på en aktivitet</Element>
            <Normaltekst>
                Aktivitetsplanen har fem kolonner med statusene forslag, planlegger, gjennomfører, fullført og avbrutt.
                Statusen på aktiviteten viser til hvor langt du har kommet i gjennomføringen. Du kan oppdatere statusen
                inne i aktiviteten, for eksempel fra «gjennomfører» til «fullført».
            </Normaltekst>
            <Element className={styles.element}>Blå prikk</Element>
            <Normaltekst>
                Hvis du ser at en aktivitet er merket med blå prikk, er det veilederen din som har gjort noe nytt siden
                sist du var inne i aktiviteten.
            </Normaltekst>
            <Element className={styles.element}>Tidligere planer</Element>
            <Normaltekst>
                Hvis du har vært registrert hos NAV før, kan du se aktivitetsplanen fra denne perioden.
            </Normaltekst>
        </Ekspanderbartpanel>
    );
}
