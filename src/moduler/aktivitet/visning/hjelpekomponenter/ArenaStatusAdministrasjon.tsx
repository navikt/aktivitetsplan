import { Alert } from '@navikt/ds-react';
import React from 'react';

import DeleLinje from '../delelinje/delelinje';

interface Props {
    erBruker: boolean;
}

const ArenaStatusAdministrasjon = (props: Props) => {
    const { erBruker } = props;

    const alertTekst = erBruker
        ? 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.'
        : 'For å endre aktiviteten må du gå til Arena.';

    return <Alert variant="info">{alertTekst}</Alert>;
};

export default ArenaStatusAdministrasjon;
