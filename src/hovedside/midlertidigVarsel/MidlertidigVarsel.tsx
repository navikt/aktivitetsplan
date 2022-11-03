import classNames from 'classnames';
import AlertStripe from 'nav-frontend-alertstriper';
import Tekstomrade from 'nav-frontend-tekstomrade';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import styles from './MidlertidigVarsel.module.less';

const MidlertidigVarsel = () => {
    const erVeileder = useSelector(selectErVeileder);

    if (!erVeileder) return null;

    console.log(styles);

    return (
        <div className="container">
            <AlertStripe type="advarsel" className={classNames(styles.midlertidigVarsel)}>
                <h3 className={styles.midlertidigVarsel__tittel}>Vi opplever en teknisk feil i aktivitetsplanen</h3>
                <p>
                    Noen ganger reagerer ikke knappene i aktivitetskortet når du klikker på dem. Aktiviteten kan da bli
                    lagret eller delt flere ganger. Brukeren kan få flere like kort i sin aktivitetsplan.
                </p>
                <p>
                    Hvis du opplever at knappene ikke reagerer når du klikker på dem, kan du laste inn siden på nytt
                    (F5) etter å ha klikket på knappen én gang. Da skal kortet ha blitt oppdatert.
                </p>
            </AlertStripe>
        </div>
    );
};

export default MidlertidigVarsel;
