import { Alert, HelpText } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectErBrukerManuell, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';

const Mere = () => (
    <HelpText placement={'bottom'}>
        Denne brukeren har ikke vært innlogget de siste 18 månedene med nivå 4 (for eksempel BankID). <br />
        Du kan derfor ikke sende forhåndsorientering, varsel og meldinger.
    </HelpText>
);

const Nivaa4Feilmelding = () => {
    const erreservertKRR = useSelector(selectReservasjonKRR);
    const erManuell = useSelector(selectErBrukerManuell);

    if (erManuell || erreservertKRR) {
        return null;
    }

    return (
        <div className="m-4">
            <Alert variant="warning">
                Denne brukeren kan ikke logge inn i aktivitetsplan og dialog.
                <Mere />
            </Alert>
        </div>
    );
};

export default Nivaa4Feilmelding;
