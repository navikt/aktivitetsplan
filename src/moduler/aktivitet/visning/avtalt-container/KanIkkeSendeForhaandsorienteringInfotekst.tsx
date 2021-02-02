import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';

const getTekst = (
    brukerErManuell: boolean,
    brukerErUnderKvp: boolean,
    brukerErIReservasjonKRR: boolean,
    harLoggetInnMedNivaa4: boolean,
    mindreEnnSyvDagerTil: boolean
): string | undefined => {
    if (brukerErManuell) {
        return 'Du kan ikke sende forhåndsorientering fordi brukeren er manuell bruker.';
    }
    if (brukerErUnderKvp) {
        return 'Du kan ikke sende forhåndsorientering fordi brukeren deltar i kvalifiseringsprogrammet.';
    }
    if (brukerErIReservasjonKRR) {
        return 'Du kan ikke sende forhåndsorientering fordi brukeren har reservert seg i kontakt- og reservasjonsregisteret.';
    }
    if (!harLoggetInnMedNivaa4) {
        return 'Du kan ikke sende forhåndsorientering fordi brukeren ikke har vært innlogget de siste 18 månedene med nivå 4 (for eksempel BankID).';
    }
    if (mindreEnnSyvDagerTil) {
        return 'Du kan ikke sende forhåndsorientering fordi du har satt sluttdatoen til mindre enn 7 dager frem i tid. Hvis du har hatt muntlig dialog med brukeren om mulige konsekvenser for ytelse og dokumentert dette i et samtalereferat, så kan du sette aktiviteten til "Avtalt med NAV".';
    }
};

//TODO: slette tekstfil sett-avtalt-forhandsrientering-bruker-uten-aktivitesplan
//TODO: Husk å slette tekstfil sett-til-avtalt-mindre-enn-syv-dager
const KanIkkeSendeForhaandsorienteringInfotekst = (props: { mindreEnnSyvDagerTil: boolean }) => {
    const brukerErManuell = useSelector(selectErBrukerManuell);
    const brukerErUnderKvp = useSelector(selectErUnderKvp);
    const brukerErIReservasjonKRR = useSelector(selectReservasjonKRR);
    const harLoggetInnMedNivaa4 = useSelector(selectNivaa4);

    const tekst = getTekst(
        brukerErManuell,
        brukerErUnderKvp,
        brukerErIReservasjonKRR,
        harLoggetInnMedNivaa4,
        props.mindreEnnSyvDagerTil
    );

    if (!tekst) {
        return null;
    }

    return <AlertStripeInfo>{tekst}</AlertStripeInfo>;
};

export default KanIkkeSendeForhaandsorienteringInfotekst;
