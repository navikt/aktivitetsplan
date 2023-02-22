import { BodyShort } from '@navikt/ds-react';
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

    const Tittel = () => <BodyShort className={styles.deleCVEndreTittel}>{overskrift}</BodyShort>;
    const TittelMedUtloptTekst = () => (
        <>
            <Tittel />
            <BodyShort className={styles.deleCVTittelUtloptTekst}>Fristen har gått ut</BodyShort>
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
            <BodyShort className={styles.deleCVUtloptTekst}>
                Spørsmålet ble ikke besvart innen fristen {formaterDatoManed(svarfrist)}
            </BodyShort>
        </EkspanderbarLinje>
    );
};
