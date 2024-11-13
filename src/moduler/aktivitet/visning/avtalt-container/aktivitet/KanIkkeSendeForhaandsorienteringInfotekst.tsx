import { Alert } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../../oppfolging-status/oppfolging-selector';

const getTekst = (
    brukerErManuell: boolean,
    brukerErUnderKvp: boolean,
    brukerErIReservasjonKRR: boolean,
    mindreEnnSyvDagerTil: boolean,
    manglerTilDato: boolean,
): string | undefined => {
    if (brukerErUnderKvp) {
        return 'Du kan ikke legge til forhåndsorientering fordi brukeren deltar i kvalifiseringsprogrammet.';
    }
    if (brukerErIReservasjonKRR) {
        return 'Du kan ikke legge til forhåndsorientering fordi brukeren har reservert seg i kontakt- og reservasjonsregisteret. Du skal ha orientert brukeren om mulig konsekvens for ytelse, og dokumentert dette.';
    }
    if (brukerErManuell) {
        return 'Du kan ikke legge til forhåndsorientering fordi brukeren har manuell oppfølging. Du skal ha orientert brukeren om mulig konsekvens for ytelse, og dokumentert dette.';
    }
    if (manglerTilDato) {
        return 'Du kan ikke sende forhåndsorientering fordi aktiviteten ikke har "til dato". Hvis du har hatt muntlig dialog med brukeren om mulige konsekvenser for ytelse og dokumentert dette i et samtalereferat, så kan du sette aktiviteten til "Avtalt med Nav"';
    }
    if (mindreEnnSyvDagerTil) {
        return 'Du kan ikke legge til forhåndsorientering fordi sluttdatoen er færre enn 7 dager frem i tid. Hvis du har hatt muntlig dialog med brukeren om mulige konsekvenser for ytelse og dokumentert dette i et samtalereferat, så kan du sette aktiviteten til “Avtalt med Nav".';
    }
};

//Senere: slette tekstfil sett-avtalt-forhandsrientering-bruker-uten-aktivitesplan
//Senere: Husk å slette tekstfil sett-til-avtalt-mindre-enn-syv-dager
const KanIkkeSendeForhaandsorienteringInfotekst = (props: {
    mindreEnnSyvDagerTil: boolean;
    manglerTilDato: boolean;
}) => {
    const brukerErManuell = useSelector(selectErBrukerManuell);
    const brukerErUnderKvp = useSelector(selectErUnderKvp);
    const brukerErIReservasjonKRR = useSelector(selectReservasjonKRR);

    const tekst = getTekst(
        brukerErManuell,
        brukerErUnderKvp,
        brukerErIReservasjonKRR,
        props.mindreEnnSyvDagerTil,
        props.manglerTilDato,
    );

    if (!tekst) {
        return null;
    }

    return <Alert variant="warning">{tekst}</Alert>;
};

export default KanIkkeSendeForhaandsorienteringInfotekst;
