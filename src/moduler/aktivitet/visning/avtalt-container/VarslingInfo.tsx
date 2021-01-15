import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { EtikettLiten } from 'nav-frontend-typografi';
import React from 'react';

import styles from './ForhaandsorienteringsMelding.module.less';

const VarslingInfo = () => (
    <>
        <EtikettLiten className={styles.avtaltTekstEtikett}>Tekst til brukeren</EtikettLiten>
        <Hjelpetekst>
            <div className={styles.maxWidth300}>
                Brukeren får en SMS eller e-post via kontaktinformasjon som brukeren selv har registrert i det
                offentlige kontaktregisteret. Brukeren får beskjed om en viktig oppgave og det lenkes til dialog.
                Beskjeden sendes gjennom Altinn etter en halv time. Sender du flere forhåndsorienteringer innen en halv
                time så blir det kun sendt én SMS eller e-post.
            </div>
        </Hjelpetekst>
    </>
);

export default VarslingInfo;
