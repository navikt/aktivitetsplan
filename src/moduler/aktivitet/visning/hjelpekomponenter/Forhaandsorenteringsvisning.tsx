import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';

import { Forhaandsorientering } from '../../../../datatypes/aktivitetTypes';
import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { ForhaandsorienteringType } from '../avtalt-container/AvtaltContainer';
import DeleLinje from '../delelinje/delelinje';
import styles from './Forhaandsorienteringsvisning.module.less';

interface Props {
    forhaandsorientering?: Forhaandsorientering;
}

const Forhaandsorenteringsvisning = (props: Props) => {
    const forhaandsorientering = props.forhaandsorientering;

    if (!forhaandsorientering || forhaandsorientering.type === ForhaandsorienteringType.IKKE_SEND) {
        return null;
    }

    return (
        <>
            <DeleLinje />
            <EkspanderbarLinje
                tittel="Informasjon om ansvaret ditt"
                kanToogle
                aapneTekst="Les mer"
                lukkeTekst="Lukk"
                defaultAapen
            >
                <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorientering.tekst}</Normaltekst>
            </EkspanderbarLinje>
            <DeleLinje />
        </>
    );
};

export default Forhaandsorenteringsvisning;
