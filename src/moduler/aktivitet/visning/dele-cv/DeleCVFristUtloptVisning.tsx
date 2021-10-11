import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { formaterDatoManed } from '../../../../utils';
import { Ingress } from './DeleCvContainer';
import styles from './DeleCVFristUtloptVisning.module.less';

interface Props {
    overskrift: string;
    svarfrist: string;
}

export const DeleCVFristUtloptVisning = (props: Props) => {
    const { overskrift, svarfrist } = props;

    const Tittel = () => <Normaltekst className={styles.deleCVEndreTittel}>{overskrift}</Normaltekst>;
    const TittelMedUtloptTekst = () => (
        <>
            <Tittel />
            <Element className={styles.deleCVTittelUtloptTekst}>Fristen har gått ut</Element>
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
            <Normaltekst className={styles.deleCVUtloptTekst}>
                Spørsmålet ble ikke besvart innen fristen {formaterDatoManed(svarfrist)}
            </Normaltekst>
        </EkspanderbarLinje>
    );
};
