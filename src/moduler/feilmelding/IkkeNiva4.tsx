import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectErBrukerManuell, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import { selectNivaa4, selectNivaa4LastetOk } from '../tilgang/tilgang-selector';
import styles from './Feilmelding.module.css';

const Mere = () => (
    <Hjelpetekst type={PopoverOrientering.Under}>
        Denne brukeren har ikke vært innlogget de siste 18 månedene med nivå 4 (for eksempel BankID). <br />
        Du kan derfor ikke sende forhåndsorientering, varsel og meldinger.
    </Hjelpetekst>
);

const Nivaa4Feilmelding = () => {
    const niva4 = useSelector(selectNivaa4);
    const lastetOk = useSelector(selectNivaa4LastetOk);
    const erreservertKRR = useSelector(selectReservasjonKRR);
    const erManuell = useSelector(selectErBrukerManuell);

    if (niva4 || !lastetOk || erManuell || erreservertKRR) {
        return null;
    }

    return (
        <div className={styles.feilmelding}>
            <AlertStripeAdvarsel>
                Denne brukeren kan ikke logge inn i aktivitetsplan og dialog.
                <Mere />
            </AlertStripeAdvarsel>
        </div>
    );
};

export default Nivaa4Feilmelding;
