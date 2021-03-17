import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import styles from './Forhaandsorienteringsvisning.module.less';

interface Props {
    forhaandsorienteringTekst?: String;
    hidden: boolean;
}

const Forhaandsorenteringsvisning = (props: Props) => {
    const { forhaandsorienteringTekst, hidden } = props;

    if (hidden) {
        return null;
    }

    return (
        <EkspanderbarLinje
            tittel="Informasjon om ansvaret ditt"
            kanToogle
            aapneTekst="Les mer"
            lukkeTekst="Lukk"
            defaultAapen
        >
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
        </EkspanderbarLinje>
    );
};

export default Forhaandsorenteringsvisning;
