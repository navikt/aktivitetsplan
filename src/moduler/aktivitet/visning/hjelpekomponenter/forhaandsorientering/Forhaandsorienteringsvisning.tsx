import AlertStripe from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Forhaandsorientering } from '../../../../../datatypes/aktivitetTypes';
import EkspanderbarLinjeBase from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinjeBase';
import { selectErBruker } from '../../../../identitet/identitet-selector';
import styles from './Forhaandsorienteringsvisning.module.less';
import LestDatoForhaandsorientering from './LestDatoForhaandsorientering';
import LestKnappForhaandsorientering from './LestKnappForhaandsorientering';

interface Props {
    forhaandsorientering?: Forhaandsorientering;
    forhaandsorienteringLagtTil?: boolean;
    markerSomLest?(): void;
}

const Forhaandsorienteringsvisning = (props: Props) => {
    const { forhaandsorientering, markerSomLest, forhaandsorienteringLagtTil = false } = props;
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
        markerSomLest && markerSomLest();
        setErEkspandert(false);
    };

    const advarselTittel = (
        <AlertStripe type="advarsel" form="inline">
            <Element>Informasjon om ansvaret ditt</Element>
        </AlertStripe>
    );
    const normalTittel = 'Informasjon om ansvaret ditt';

    const tittel = erLest || !erBruker ? normalTittel : advarselTittel;

    const onClick = () => setErEkspandert((ekspandert) => !ekspandert);

    return (
        <EkspanderbarLinjeBase
            tittel={tittel}
            kanToogle
            aapneTekst="Les"
            lukkeTekst="Lukk"
            erAapen={erEkspandert}
            onClick={onClick}
        >
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
            <LestDatoForhaandsorientering hidden={!erLest} lestDato={forhaandsorienteringLestDato} />
            <LestKnappForhaandsorientering hidden={!erBruker || erLest} onClick={onClickLestKnapp} />
        </EkspanderbarLinjeBase>
    );
};

export default Forhaandsorienteringsvisning;
