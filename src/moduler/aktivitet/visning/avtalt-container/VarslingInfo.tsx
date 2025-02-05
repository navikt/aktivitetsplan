import { ReadMore } from '@navikt/ds-react';
import React from 'react';

import styles from './VarslingInfo.module.less';

const VarslingInfo = () => (
    <div className="flex mb-2">
        <ReadMore header="Brukeren mottar sms eller e-post (se KRR) med en lenke til aktiviteten." className="ml-2">
            <div className={styles.maxWidth300}>
                På aktiviteten vil bruker se forhåndsorienteringen og en knapp for å bekrefte at en har lest. <br />
                <br />
                Hvis ikke brukeren leser beskjeden innen 7 dager, så blir de revarslet.
            </div>
        </ReadMore>
    </div>
);

export default VarslingInfo;
