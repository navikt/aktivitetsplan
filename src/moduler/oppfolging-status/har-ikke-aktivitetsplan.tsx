import { Alert, BodyShort, Link } from '@navikt/ds-react';
import React from 'react';

import { ARBEIDSSOKERREGISTRERING_URL } from '../../constant';

interface PropTypes {
    erVeileder: boolean;
}

function HarIkkeAktivitetsplan(props: PropTypes) {
    const { erVeileder } = props;
    const advarsel = erVeileder
        ? 'Denne brukeren har ikke en tidligere aktivitetsplan i Modia.'
        : 'Du må være registrert hos NAV for å bruke aktivitetsplanen.';

    return (
        <div className="har-ikke-aktivitetsplan-container">
            <Alert variant="warning">
                <BodyShort>{advarsel}</BodyShort>
                {!erVeileder && <Link href={ARBEIDSSOKERREGISTRERING_URL}>Register deg hos NAV</Link>}
            </Alert>
        </div>
    );
}

export default HarIkkeAktivitetsplan;
