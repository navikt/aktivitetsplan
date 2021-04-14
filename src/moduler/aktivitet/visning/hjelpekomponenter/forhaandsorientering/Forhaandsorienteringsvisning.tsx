import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Forhaandsorientering } from '../../../../../datatypes/aktivitetTypes';
import EkspanderbarLinjeBase from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import AdvarselTittel from './AdvarselTittel';
import styles from './Forhaandsorienteringsvisning.module.less';
import LestDatoVisning from './LestDatoVisning';
import LestKnapp from './LestKnapp';

interface Props {
    forhaandsorientering?: Forhaandsorientering;
    forhaandsorienteringLagtTil?: boolean;
    onMarkerSomLest?(): void;
}

const Forhaandsorienteringsvisning = (props: Props) => {
    const { forhaandsorientering, onMarkerSomLest, forhaandsorienteringLagtTil = false } = props;
    const forhaandsorienteringTekst = forhaandsorientering?.tekst;
    const forhaandsorienteringLestDato = forhaandsorientering?.lest;
    const erLest = !!forhaandsorienteringLestDato;

    const erBruker = useSelector(selectErBruker);

    const ekspandertDefault = !erBruker ? forhaandsorienteringLagtTil : !erLest;
    const [erEkspandert, setErEkspandert] = useState(ekspandertDefault);

    if (!forhaandsorienteringTekst) {
        return null;
    }

    const onClickLestKnapp = () => {
        onMarkerSomLest && onMarkerSomLest();
        setErEkspandert(false);
    };

    const onClickToggle = () => setErEkspandert((ekspandert) => !ekspandert);

    const tittel = erLest || !erBruker ? 'Informasjon om ansvaret ditt' : <AdvarselTittel />;

    return (
        <EkspanderbarLinjeBase
            tittel={tittel}
            aapneTekst="Les"
            lukkeTekst="Lukk"
            erAapen={erEkspandert}
            onClick={onClickToggle}
            kanToogle
        >
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
            <LestDatoVisning hidden={!erLest} lestDato={forhaandsorienteringLestDato} />
            <LestKnapp hidden={!erBruker || erLest} onClick={onClickLestKnapp} />
        </EkspanderbarLinjeBase>
    );
};

export default Forhaandsorienteringsvisning;
