import { ReadMore } from '@navikt/ds-react';
import React from 'react';

const VarslingInfo = () => (
    <ReadMore header="Brukeren mottar sms eller e-post (se KRR) med en lenke til aktiviteten" className="mt-4">
        På aktiviteten vil bruker se forhåndsorienteringen og en knapp for å bekrefte at en har lest.
        <br /><br />
        Hvis ikke brukeren leser beskjeden innen 7 dager, så blir de revarslet.
    </ReadMore>
);

export default VarslingInfo;
