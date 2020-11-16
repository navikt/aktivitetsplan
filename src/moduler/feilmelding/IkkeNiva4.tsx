import { useSelector } from 'react-redux';
import { selectNivaa4 } from '../tilgang/tilgang-selector';
import React from 'react';

import styles from './Feilmelding.module.less';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

const Nivaa4Feilmelding = () => {
    const niva4 = useSelector(selectNivaa4);

    if (niva4) {
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
