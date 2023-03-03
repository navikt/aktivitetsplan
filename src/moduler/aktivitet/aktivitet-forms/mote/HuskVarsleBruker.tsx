import { Alert } from '@navikt/ds-react';
import React from 'react';

const HuskVarsleBruker = ({ avtalt, endre }: { avtalt: boolean; endre: boolean }) => {
    if (!avtalt || !endre) {
        return null;
    }
    return (
        <Alert variant="warning" className="mb-8">
            Husk å sende en dialogmelding til brukeren om endringen du gjør.
        </Alert>
    );
};

export default HuskVarsleBruker;
