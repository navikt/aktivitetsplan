import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';

import { CvKanDelesData } from '../../../../datatypes/aktivitetTypes';
import EkspanderbarLinjeBase from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { formaterDatoManed } from '../../../../utils';
import { Ingress } from './DeleCvContainer';
import styles from './DeleCvSvarVisning.module.css';
import { JaSvarTekst, NeiSvarTekst, overskrift } from './tekster';

interface Props {
    cvKanDelesData: CvKanDelesData;
    startAapen?: boolean;
}

export const DeleCvSvarVisning = ({ cvKanDelesData, startAapen = false }: Props) => {
    const [erAapen, setAapen] = useState(startAapen);
    const toggle = () => setAapen(!erAapen);

    const cvKanDeles = cvKanDelesData.kanDeles;

    const Tittel = () => <Normaltekst className={styles.deleCVEndreTittel}>{overskrift}</Normaltekst>;
    const TittelMedCvSvar = () => (
        <>
            <Tittel />
            <Element className={styles.deleCVTittelSvarTekst}>{cvKanDeles ? 'Ja' : 'Nei'}</Element>
        </>
    );

    const Infostripe = () =>
        cvKanDeles ? (
            <AlertStripeInfo className={styles.infoStripe}>
                Arbeidsgiveren eller NAV vil kontakte deg hvis du er aktuell for stillingen
            </AlertStripeInfo>
        ) : null;

    var svarTekst: string, endretTekst: string;
    if (cvKanDelesData.endretAvType === 'BRUKER') {
        svarTekst = cvKanDeles ? JaSvarTekst : NeiSvarTekst;
        endretTekst = `Du svarte ${formaterDatoManed(cvKanDelesData.endretTidspunkt)}`;
    } else {
        svarTekst = `NAV var i kontakt med deg ${formaterDatoManed(cvKanDelesData.avtaltDato)}. Du sa ${
            cvKanDeles ? 'ja' : 'nei'
        } til at CV-en din deles med arbeidsgiver.`;
        endretTekst = `NAV svarte på vegne av deg ${formaterDatoManed(cvKanDelesData.endretTidspunkt)}.`;
    }

    return (
        <EkspanderbarLinjeBase
            tittel={<TittelMedCvSvar />}
            aapneTittel={<Tittel />}
            kanToogle
            aapneTekst="Åpne"
            lukkeTekst="Lukk"
            erAapen={erAapen}
            onClick={toggle}
        >
            <Ingress />
            <Normaltekst className={styles.deleCVSvarTekst}>{svarTekst}</Normaltekst>
            <Normaltekst className={styles.endretTidspunkt}>{endretTekst}</Normaltekst>
            <Infostripe />
        </EkspanderbarLinjeBase>
    );
};
