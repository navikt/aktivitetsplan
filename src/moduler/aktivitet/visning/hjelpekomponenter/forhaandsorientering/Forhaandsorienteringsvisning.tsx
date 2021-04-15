import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Aktivitet } from '../../../../../datatypes/aktivitetTypes';
import EkspanderbarLinjeBase from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import { markerForhaandsorienteringSomLest } from '../../../aktivitet-actions';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../../arena-aktiviteter-reducer';
import styles from './Forhaandsorienteringsvisning.module.less';
import LestDatoVisning from './LestDatoVisning';
import LestKnapp from './LestKnapp';
import Tittel from './Tittel';

interface Props {
    aktivitet: Aktivitet;
    startAapen?: boolean;
}

const Forhaandsorienteringsvisning = (props: Props) => {
    const { aktivitet, startAapen = false } = props;

    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;
    const forhaandsorienteringLestDato = aktivitet.forhaandsorientering?.lest;

    const erLest = !!forhaandsorienteringLestDato;

    const erBruker = useSelector(selectErBruker);
    const dispatch = useDispatch();

    const kanMarkeresSomLest = !erLest && erBruker;

    const [erEkspandert, setErEkspandert] = useState(startAapen);

    if (!forhaandsorienteringTekst) {
        return null;
    }

    const onMarkerSomLest = () => {
        if (aktivitet.arenaAktivitet) {
            dispatch(markerForhaandsorienteringSomLestArenaAktivitet(aktivitet));
        } else {
            dispatch(markerForhaandsorienteringSomLest(aktivitet));
        }
    };

    const onClickLestKnapp = () => {
        onMarkerSomLest && onMarkerSomLest();
        setErEkspandert(false);
    };

    const onClickToggle = () => setErEkspandert((ekspandert) => !ekspandert);

    return (
        <EkspanderbarLinjeBase
            tittel={<Tittel kanMarkeresSomLest={kanMarkeresSomLest} />}
            aapneTekst="Les"
            lukkeTekst="Lukk"
            erAapen={erEkspandert}
            onClick={onClickToggle}
            kanToogle
        >
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
            <LestDatoVisning hidden={!erLest} lestDato={forhaandsorienteringLestDato} />
            <LestKnapp hidden={!kanMarkeresSomLest} onClick={onClickLestKnapp} />
        </EkspanderbarLinjeBase>
    );
};

export default Forhaandsorienteringsvisning;
