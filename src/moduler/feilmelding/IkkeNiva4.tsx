import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectNivaa4, selectNivaa4LastetOk } from '../tilgang/tilgang-selector';
import styles from './Feilmelding.module.less';
import { selectErBrukerManuell, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';

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
                Systemet får ikke sjekket om denne brukeren er en digital eller manuell bruker. <br />
                Dette er et midlertidig problem på grunn av ny teknisk løsning etter koronasituasjonen.
                <ul>
                    <li>
                        Hvis brukeren svarer på digital dialog, så kan du kommunisere digitalt. Forhåndsorientering og
                        varsel vil ikke fungere på denne brukeren.
                        <br />
                    </li>
                    <li>Hvis brukeren ikke svarer på digital dialog, så setter du brukeren til manuell bruker.</li>
                </ul>
            </AlertStripeAdvarsel>
        </div>
    );
};

export default Nivaa4Feilmelding;
