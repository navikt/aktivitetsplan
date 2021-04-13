import AlertStripe from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Forhaandsorientering } from '../../../../../datatypes/aktivitetTypes';
import EkspanderbarLinje from '../../../../../felles-komponenter/ekspanderbar-linje/EkspanderbarLinje';
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

    const erBruker = useSelector(selectErBruker);

    const forhaandsorienteringTekst = forhaandsorientering?.tekst;
    const forhaandsorienteringLestDato = forhaandsorientering?.lest;

    const erLest = !!forhaandsorienteringLestDato;

    const ekspandertDefault = !erBruker ? forhaandsorienteringLagtTil : !erLest;
    const [ekspandert, setEkspandert] = useState(ekspandertDefault);

    if (!forhaandsorienteringTekst) {
        return null;
    }

    const onClickLestKnapp = () => {
        markerSomLest && markerSomLest();
        setEkspandert(false);
    };

    const advarselTittel = (
        <AlertStripe type="advarsel" form="inline">
            <Element>Informasjon om ansvaret ditt</Element>
        </AlertStripe>
    );
    const normalTittel = 'Informasjon om ansvaret ditt';

    const tittel = erLest || !erBruker ? normalTittel : advarselTittel;

    return (
        <EkspanderbarLinje tittel={tittel} kanToogle aapneTekst="Les" lukkeTekst="Lukk" defaultAapen={ekspandert}>
            <Normaltekst className={styles.forhaandsorienteringTekst}>{forhaandsorienteringTekst}</Normaltekst>
            <LestDatoForhaandsorientering hidden={!erLest} lestDato={forhaandsorienteringLestDato} />
            <LestKnappForhaandsorientering hidden={!erBruker || erLest} onClick={onClickLestKnapp} />
        </EkspanderbarLinje>
    );
};

export default Forhaandsorienteringsvisning;
