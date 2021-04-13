import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import EkspanderbarLinje from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import styles from './Forhaandsorienteringsvisning.module.less';
import LestDatoForhaandsorientering from './LestDatoForhaandsorientering';
import LestKnappForhaandsorientering from './LestKnappForhaandsorientering';

interface Props {
    forhaandsorienteringTekst?: string;
    forhaandsorienteringLest?: string;
    hidden: boolean;
    markerSomLest?(): void;
}

const Forhaandsorienteringsvisning = (props: Props) => {
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

    const advarselTittel = (
        <AlertStripe type="advarsel" form="inline" className={styles.advarsel}>
            Informasjon om ansvaret ditt
        </AlertStripe>
    );
    const normalTittel = 'Informasjon om ansvaret ditt';

    const tittel = forhaandsorienteringLest ? normalTittel : advarselTittel;

    return (
        <EkspanderbarLinje tittel={tittel} kanToogle aapneTekst="Les" lukkeTekst="Lukk" defaultAapen={ekspandert}>
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
            <LestDatoForhaandsorientering
                hidden={!forhaandsorienteringLest}
                forhaandsorienteringLest={forhaandsorienteringLest}
            />
            <LestKnappForhaandsorientering
                hidden={!erBruker || !!forhaandsorienteringLest}
                onClick={onClickLestKnapp}
            />
        </EkspanderbarLinje>
    );
};

export default Forhaandsorienteringsvisning;
