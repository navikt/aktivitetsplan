import Tekstomrade from 'nav-frontend-tekstomrade';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { Aktivitet } from '../../../../../datatypes/aktivitetTypes';
import EkspanderbarLinjeBase from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import { markerForhaandsorienteringSomLest } from '../../../aktivitet-actions';
import { selectAktivitetFhoLestStatus } from '../../../aktivitet-selector';
import { selectArenaAktivitetFhoLestStatus } from '../../../arena-aktivitet-selector';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../../arena-aktiviteter-reducer';
import { skalMarkereForhaandsorienteringSomLest } from '../../avtalt-container/utilsForhaandsorientering';
import styles from './Forhaandsorienteringsvisning.module.less';
import LestDatoVisning from './LestDatoVisning';
import LestKnapp from './LestKnapp';
import Tittel from './Tittel';

interface Props {
    aktivitet: Aktivitet;
    erArenaAktivitet: boolean;
    startAapen?: boolean;
}

const Forhaandsorienteringsvisning = (props: Props) => {
    const { aktivitet, erArenaAktivitet, startAapen = false } = props;

    const forhaandsorientering = aktivitet.forhaandsorientering;
    const forhaandsorienteringTekst = forhaandsorientering?.tekst;
    const forhaandsorienteringLestDato = forhaandsorientering?.lest;

    const erLest = !!forhaandsorienteringLestDato;

    const erBruker = useSelector(selectErBruker);
    const arenaAktivitetFhoLestStatus = useSelector(selectArenaAktivitetFhoLestStatus);
    const aktivitetFhoLestStatus = useSelector(selectAktivitetFhoLestStatus);

    const dispatch = useDispatch();

    const kanMarkeresSomLest = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    const [erEkspandert, setErEkspandert] = useState(startAapen);

    if (!forhaandsorienteringTekst) {
        return null;
    }

    const onMarkerSomLest = () => {
        if (erArenaAktivitet) {
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

    const lasterDataArena = arenaAktivitetFhoLestStatus === STATUS.PENDING;
    const lasterDataAktivitet = aktivitetFhoLestStatus === STATUS.PENDING;
    const lasterData = erArenaAktivitet ? lasterDataArena : lasterDataAktivitet;

    return (
        <EkspanderbarLinjeBase
            tittel={<Tittel kanMarkeresSomLest={kanMarkeresSomLest} />}
            aapneTekst="Les"
            lukkeTekst="Lukk"
            erAapen={erEkspandert}
            onClick={onClickToggle}
            kanToogle
        >
            <Tekstomrade className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Tekstomrade>
            <LestDatoVisning hidden={!erLest} lestDato={forhaandsorienteringLestDato} />
            <LestKnapp hidden={!kanMarkeresSomLest} onClick={onClickLestKnapp} lasterData={lasterData} />
        </EkspanderbarLinjeBase>
    );
};

export default Forhaandsorienteringsvisning;
