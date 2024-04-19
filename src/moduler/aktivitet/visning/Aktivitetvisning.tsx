import React from 'react';

import { AlleAktiviteter, isArenaAktivitet } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { trengerBegrunnelse } from '../aktivitet-util';
import AktivitetvisningAccordion from './AktivitetvisningAccordion';
import { DeleCvContainer } from './dele-cv/DeleCvContainer';
import ActionRad from './hjelpekomponenter/ActionRad';
import AktivitetinformasjonVisning from './hjelpekomponenter/AktivitetinformasjonVisning';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import VarslingBoks from './hjelpekomponenter/VarslingBoks';
import ReferatContainer from './referat/ReferatContainer';

interface Props {
    aktivitet: AlleAktiviteter;
    tillatEndring: boolean;
    laster: boolean;
}

const Aktivitetvisning = (props: Props) => {
    const { aktivitet, tillatEndring, laster } = props;
    const erArenaAktivitet = isArenaAktivitet(aktivitet);
    const visBegrunnelse = !erArenaAktivitet && trengerBegrunnelse(aktivitet.avtalt, aktivitet.status, aktivitet.type);

    return (
        <div className=" space-y-8">
            <VarslingBoks aktivitet={aktivitet} />
            {visBegrunnelse && aktivitet.avsluttetKommentar ? (
                <BegrunnelseBoks begrunnelse={aktivitet.avsluttetKommentar} />
            ) : null}
            <AktivitetinformasjonVisning valgtAktivitet={aktivitet} />
            {/* TODO strategy pattern w/ slots? */}
            {aktivitet.type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE ? (
                <DeleCvContainer aktivitet={aktivitet} />
            ) : null}
            <ActionRad aktivitet={aktivitet} tillatEndring={tillatEndring} laster={laster} />
            {aktivitet.type === VeilarbAktivitetType.MOTE_TYPE ||
            aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE ? (
                <ReferatContainer aktivitet={aktivitet} />
            ) : null}
            <AktivitetvisningAccordion aktivitet={aktivitet} />
        </div>
    );
};

export default Aktivitetvisning;
