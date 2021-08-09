import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { CvKanDelesData } from '../../../../datatypes/aktivitetTypes';
import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import styles from './DeleCvSvarVisning.module.less';
import { JaSvarTekst, NeiSvarTekst } from './tekster';

interface Props {
    overskrift: string;
    Ingress: () => JSX.Element;
    cvKanDelesData: CvKanDelesData;
}

export const DeleCvSvarVisning = ({ overskrift, Ingress, cvKanDelesData }: Props) => {
    const cvKanDeles = cvKanDelesData.kanDeles;

    const Tittel = () => <Normaltekst>{overskrift}</Normaltekst>;
    const TittelMedCvSvar = () => (
        <>
            <Tittel />
            <Element className={styles.deleCVTittelSvarTekst}>{cvKanDeles ? 'Ja' : 'Nei'}</Element>
        </>
    );

    const Infostripe = () =>
        cvKanDeles ? (
            <AlertStripeInfo className={styles.infoStripe}>
                Du trenger ikke gjøre noe mer med stillingen. Arbeidsgiveren eller NAV vil ta kontakt
            </AlertStripeInfo>
        ) : null;

    return (
        <EkspanderbarLinje
            tittel={<TittelMedCvSvar />}
            aapneTittel={<Tittel />}
            kanToogle
            aapneTekst="Åpne"
            lukkeTekst="Lukk"
        >
            <Ingress />
            <Normaltekst className={styles.deleCVSvarTekst}>{cvKanDeles ? JaSvarTekst : NeiSvarTekst}</Normaltekst>
            <Infostripe />
        </EkspanderbarLinje>
    );
};
