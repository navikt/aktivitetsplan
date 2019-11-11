import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';

export function MeldekortPanel() {
    return (
        <Ekspanderbartpanel tittel="Meldekort" tittelProps="undertittel">
            <p>
                Hvis du får dagpenger, tiltakspenger eller er arbeidssøker, skal du oppgi tiltak, kurs eller utdanning
                på meldekortet. Aktivitetsplanen din kan inneholde flere avtalte aktiviteter enn det meldekortet spør
                deg om. Det kan for eksempel gjelde jobber du skal søke på eller oppdatering av CV-en din.
            </p>
            <p>Hvis du får arbeidsavklaringspenger, skal du føre opp alle aktiviteter du har gjort på meldekortet.</p>
            <p>
                Her kan du lese{' '}
                <Lenke href="https://www.nav.no/no/Person/Arbeid/Dagpenger+ved+arbeidsloshet+og+permittering/Meldekort+hvordan+gjor+du+det">
                    mer informasjon om meldekort
                </Lenke>
                .
            </p>
        </Ekspanderbartpanel>
    );
}
