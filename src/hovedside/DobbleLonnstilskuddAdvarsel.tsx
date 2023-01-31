import AlertStripe from 'nav-frontend-alertstriper';
import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter } from '../datatypes/aktivitetTypes';
import { EksternAktivitetType, VeilarbAktivitetType } from '../datatypes/internAktivitetTypes';
import { selectAktiviterForAktuellePerioden } from '../moduler/aktivitet/aktivitetlisteSelector';
import styles from './dobble-lonnstilskudd-advarsel.module.less';

console.log(styles);
console.log(styles.lonnstilskuddAdvarsel);

const erLonnstilskudd = (aktivitet: AlleAktiviteter): boolean => {
    return (
        aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE &&
        (aktivitet.eksternAktivitet.type === EksternAktivitetType.MIDL_LONNSTILSKUDD_TYPE ||
            aktivitet.eksternAktivitet.type === EksternAktivitetType.VARIG_LONNSTILSKUDD_TYPE)
    );
};

const DobbleLonnstilskuddAdvarsel = () => {
    const harLonnstilskudd = useSelector(selectAktiviterForAktuellePerioden).some(erLonnstilskudd);

    if (!harLonnstilskudd) {
        return null;
    }

    return (
        <AlertStripe
            className={styles.lonnstilskuddAdvarsel}
            type={'advarsel'}
            title={'Vi opplever en teknisk feil i aktivitetsplanen'}
        >
            <h1 className={styles.lonnstilskuddAdvarsel__tittel}>
                Lønnstilskudd kan dukke opp flere ganger i aktivitetsplanen din
            </h1>
            <p>
                Vi erstatter nå det gamle systemet for varig og midlertidig lønnstilskudd med et nytt system. Fordi vi
                bytter system kan samme lønnstilskudd dukke opp to ganger i aktivitetsplanen din.
            </p>
            <p>Du fortsetter å få pengene dine som før, og du trenger ikke å gjøre noe.</p>
        </AlertStripe>
    );
};

export default DobbleLonnstilskuddAdvarsel;
