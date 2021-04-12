import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import EkspanderbarLinje from '../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { formaterDatoKortManedTid } from '../../../../utils';
import { selectErBruker } from '../../../identitet/identitet-selector';
import styles from './Forhaandsorienteringsvisning.module.less';

interface Props {
    forhaandsorienteringTekst?: string;
    forhaandsorienteringLest?: string;
    hidden: boolean;
    markerSomLest?(): void;
}

const Forhaandsorenteringsvisning = (props: Props) => {
    const { forhaandsorienteringTekst, forhaandsorienteringLest, hidden, markerSomLest } = props;

    const [ekspandert, setEkspandert] = useState(!forhaandsorienteringLest);

    const erBruker = useSelector(selectErBruker);

    if (hidden) {
        return null;
    }

    const onClickLestKnapp = () => {
        markerSomLest && markerSomLest();
        setEkspandert(false);
    };

    console.log('ekspandert: ', ekspandert);

    return (
        <EkspanderbarLinje
            tittel="Informasjon om ansvaret ditt"
            kanToogle
            aapneTekst="Les mer"
            lukkeTekst="Lukk"
            defaultAapen={ekspandert}
        >
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
            {erBruker && !forhaandsorienteringLest && (
                <Knapp onClick={onClickLestKnapp} kompakt>
                    Ok, jeg har lest beskjeden
                </Knapp>
            )}
            {forhaandsorienteringLest && (
                <Normaltekst>Lest {formaterDatoKortManedTid(forhaandsorienteringLest)}</Normaltekst>
            )}
        </EkspanderbarLinje>
    );
};

export default Forhaandsorenteringsvisning;
