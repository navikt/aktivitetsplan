import React from 'react';

import { AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import ModalContainer from '../../../felles-komponenter/modal/ModalContainer';
import { trengerBegrunnelse } from '../aktivitet-util';
import styles from './Aktivitetsvisning.module.less';
import { DeleCvContainer } from './dele-cv/DeleCvContainer';
import AktivitetinformasjonVisning from './hjelpekomponenter/AktivitetinformasjonVisning';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import Statusadministrasjon from './hjelpekomponenter/Statusadministrasjon';
import VarslingBoks from './hjelpekomponenter/VarslingBoks';
import ReferatContainer from './referat/ReferatContainer';
import DialogLenke from './underelement-for-aktivitet/dialog/DialogLenke';
import EndringsLogg from './underelement-for-aktivitet/EndringsLogg';

interface Props {
    aktivitet: AlleAktiviteter;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

function Aktivitetvisning(props: Props) {
    const { aktivitet, tillatEndring, laster, underOppfolging } = props;

    const erArenaAktivitet = isArenaAktivitet(aktivitet);

    const visBegrunnelse = !erArenaAktivitet && trengerBegrunnelse(aktivitet.avtalt, aktivitet.status, aktivitet.type);

    return (
        <div>
            <ModalContainer className="aktivitetvisning">
                <VarslingBoks className={styles.underseksjon} aktivitet={aktivitet} />

                <BegrunnelseBoks
                    className={styles.underseksjon}
                    begrunnelse={aktivitet.avsluttetKommentar}
                    visible={visBegrunnelse}
                />

                <AktivitetinformasjonVisning
                    valgtAktivitet={aktivitet}
                    tillatEndring={tillatEndring}
                    underOppfolging={underOppfolging}
                    laster={laster}
                />

                <DeleCvContainer aktivitet={aktivitet} />
                <ReferatContainer aktivitet={aktivitet} />
                <Statusadministrasjon aktivitet={aktivitet} />
                <DialogLenke aktivitet={aktivitet} skulDelelingje={erArenaAktivitet} />
                <EndringsLogg aktivitet={aktivitet} hidden={erArenaAktivitet} />
            </ModalContainer>
        </div>
    );
}

export default Aktivitetvisning;
