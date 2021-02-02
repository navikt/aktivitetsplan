import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { EtikettLiten } from 'nav-frontend-typografi';
import React from 'react';

import styles from './ForhaandsorienteringsMelding.module.less';

const VarslingInfo = () => (
    <>
        <EtikettLiten className={styles.avtaltTekstEtikett}>Tekst til brukeren</EtikettLiten>
        <Hjelpetekst>
            <div className={styles.maxWidth300}>
                Brukeren mottar sms eller e-post (se KRR) med en lenke til aktiviteten. <br />
                <br />
                På aktiviteten vil bruker se forhåndsorienteringen og en knapp for å bekrefte at en har lest. <br />
                <br />
                Hvis ikke brukeren leser beskjeden innen 7 dager, så blir de revarslet.
            </div>
        </Hjelpetekst>
    </>
);

export default VarslingInfo;
