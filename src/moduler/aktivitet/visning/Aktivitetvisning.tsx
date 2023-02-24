import React from 'react';

import { AlleAktiviteter, isArenaAktivitet, isVeilarbAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { trengerBegrunnelse } from '../aktivitet-util';
import styles from './Aktivitetsvisning.module.less';
import { DeleCvContainer } from './dele-cv/DeleCvContainer';
import AktivitetinformasjonVisning from './hjelpekomponenter/AktivitetinformasjonVisning';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import HandlingContainer from './hjelpekomponenter/HandlingContainer';
import Statusadministrasjon from './hjelpekomponenter/Statusadministrasjon';
import VarslingBoks from './hjelpekomponenter/VarslingBoks';
import ReferatContainer from './referat/ReferatContainer';
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
            <VarslingBoks className={styles.underseksjon} aktivitet={aktivitet} />

            {visBegrunnelse && aktivitet.avsluttetKommentar ? (
                <BegrunnelseBoks className={styles.underseksjon} begrunnelse={aktivitet.avsluttetKommentar} />
            ) : null}

            <AktivitetinformasjonVisning
                valgtAktivitet={aktivitet}
                tillatEndring={tillatEndring}
                underOppfolging={underOppfolging}
                laster={laster}
            />

            {aktivitet.type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE ? (
                <DeleCvContainer aktivitet={aktivitet} />
            ) : null}
            {aktivitet.type === VeilarbAktivitetType.MOTE_TYPE ||
            aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE ? (
                <ReferatContainer aktivitet={aktivitet} />
            ) : null}
            {aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE ? (
                <HandlingContainer aktivitet={aktivitet} />
            ) : null}
            <Statusadministrasjon aktivitet={aktivitet} />
            {/*<DialogLenke aktivitet={aktivitet} /> */}
            {isVeilarbAktivitet(aktivitet) ? <EndringsLogg aktivitet={aktivitet} /> : null}
        </div>
    );
}

export default Aktivitetvisning;
