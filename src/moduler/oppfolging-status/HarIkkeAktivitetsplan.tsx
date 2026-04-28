import { Alert, BodyShort, Link } from '@navikt/ds-react';
import React from 'react';

import { REGISTRERINGSINFORMASJON_URL } from '../../constant';

interface Props {
    erVeileder: boolean;
}

const HarIkkeAktivitetsplan = (props: Props) => {
    const { erVeileder } = props;
    const advarsel = erVeileder
        ? 'Denne brukeren har ikke en tidligere aktivitetsplan i Modia.'
        : 'Du må være registrert hos Nav for å bruke aktivitetsplanen.';

    return (
        <div className="flex items-center flex-col mt-8">
            <Alert variant="warning">
                <BodyShort>{advarsel}</BodyShort>
                {!erVeileder && <Link href={REGISTRERINGSINFORMASJON_URL}>Register deg hos Nav</Link>}
            </Alert>
        </div>
    );
};

export default HarIkkeAktivitetsplan;
