import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { ReactNode } from 'react';

import { CvKanDelesData } from '../../../../datatypes/aktivitetTypes';
import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import styles from './DeleCvContainer.module.less';
import { JaSvarTekst, NeiSvarTekst } from './tekster';

interface Props {
    overskrift: string;
    ingress: ReactNode;
    cvKanDelesData: CvKanDelesData;
}

export const DeleCvSvarVisning = ({ overskrift, ingress, cvKanDelesData }: Props) => {
    const cvKanDeles = cvKanDelesData.kanDeles;

    const Tittel = () => <Normaltekst>{overskrift}</Normaltekst>;

    const TittelMedCvSvar = () => (
        <>
            <Tittel />
            <Element className={styles.deleCVSvarTekst}>{cvKanDeles ? 'Ja' : 'Nei'}</Element>
        </>
    );

    return (
        <EkspanderbarLinje
            tittel={<TittelMedCvSvar />}
            aapneTittel={<Tittel />}
            kanToogle
            aapneTekst="Åpne"
            lukkeTekst="Lukk"
        >
            {ingress}
            <Normaltekst>{cvKanDeles ? JaSvarTekst : NeiSvarTekst}</Normaltekst>
        </EkspanderbarLinje>
    );
};
