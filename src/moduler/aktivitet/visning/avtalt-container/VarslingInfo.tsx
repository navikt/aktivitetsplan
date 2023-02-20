import { HelpText } from '@navikt/ds-react';
import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';

import styles from './VarslingInfo.module.less';

const VarslingInfo = () => (
    <>
        <Undertekst className={styles.avtaltTekstEtikett}>Teksten som blir lagt til aktiviteten:</Undertekst>
        <HelpText>
            <div className={styles.maxWidth300}>
                Brukeren mottar sms eller e-post (se KRR) med en lenke til aktiviteten. <br />
                <br />
                På aktiviteten vil bruker se forhåndsorienteringen og en knapp for å bekrefte at en har lest. <br />
                <br />
                Hvis ikke brukeren leser beskjeden innen 7 dager, så blir de revarslet.
            </div>
        </HelpText>
    </>
);

export default VarslingInfo;
