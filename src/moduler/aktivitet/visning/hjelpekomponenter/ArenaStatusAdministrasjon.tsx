import { Alert } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectErBruker } from '../../../identitet/identitet-selector';

const ArenaStatusAdministrasjon = () => {
    const erBruker = useSelector(selectErBruker);

    const text = erBruker
        ? 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.'
        : 'For å endre aktiviteten må du gå til Arena.';

    return (
        <Alert variant="info" className="w-full mt-4">
            {text}
        </Alert>
    );
};

export default ArenaStatusAdministrasjon;
