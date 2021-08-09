import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { formaterDatoManed } from '../../../../utils';
import styles from './DeleCvSvarVisning.module.less';

interface Props {
    overskrift: string;
    svarfrist: string;
    Ingress(): JSX.Element;
}

export const DeleCVFristUtloptVisning = (props: Props) => {
    const { overskrift, Ingress, svarfrist } = props;

    const Tittel = () => <Normaltekst>{overskrift}</Normaltekst>;
    const TittelMedUtloptTekst = () => (
        <>
            <Tittel />
            <Element className={styles.deleCVTittelSvarTekst}>Fristen har gått ut</Element>
        </>
    );

    return (
        <EkspanderbarLinje
            tittel={<TittelMedUtloptTekst />}
            aapneTittel={<Tittel />}
            kanToogle
            aapneTekst="Åpne"
            lukkeTekst="Lukk"
        >
            <Ingress />
            <Normaltekst className={styles.deleCVSvarTekst}>
                Spørsmålet ble ikke besvart innen fristen {formaterDatoManed(svarfrist)}
            </Normaltekst>
        </EkspanderbarLinje>
    );
};
