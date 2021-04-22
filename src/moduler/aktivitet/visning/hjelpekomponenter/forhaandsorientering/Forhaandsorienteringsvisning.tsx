import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../../api/utils';
import { Aktivitet } from '../../../../../datatypes/aktivitetTypes';
import EkspanderbarLinjeBase from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import { markerForhaandsorienteringSomLest } from '../../../aktivitet-actions';
import { selectAktivitetStatus } from '../../../aktivitet-selector';
import { selectArenaAktivitetStatus } from '../../../arena-aktivitet-selector';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../../arena-aktiviteter-reducer';
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

    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;
    const forhaandsorienteringLestDato = aktivitet.forhaandsorientering?.lest;

    const erLest = !!forhaandsorienteringLestDato;

    const erBruker = useSelector(selectErBruker);
    const arenaAktivitetStatus = useSelector(selectArenaAktivitetStatus);
    const aktivitetStatus = useSelector(selectAktivitetStatus);

    const dispatch = useDispatch();

    const kanMarkeresSomLest = !erLest && erBruker;

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

    const lasterDataArena = arenaAktivitetStatus !== STATUS.OK;
    const lasterDataAktivitet = aktivitetStatus !== STATUS.OK;
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
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
            <LestDatoVisning hidden={!erLest} lestDato={forhaandsorienteringLestDato} />
            <LestKnapp hidden={!kanMarkeresSomLest} onClick={onClickLestKnapp} lasterData={lasterData} />
        </EkspanderbarLinjeBase>
    );
};

export default Forhaandsorienteringsvisning;
