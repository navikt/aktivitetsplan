import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { selectErBruker } from '../../../identitet/identitet-selector';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';
import AktivitetStatusAdministrasjon from './AktivitetStatusAdministrasjon';
import ArenaStatusAdministrasjon from './ArenaStatusAdministrasjon';

interface Props {
    aktivitet: Aktivitet;
    erArenaAktivitet: boolean;
}

const Statusadministrasjon = (props: Props) => {
    const { aktivitet, erArenaAktivitet } = props;
    const { type } = aktivitet;

    const erBruker = useSelector(selectErBruker);
    const erManuellBruker = useSelector(selectErBrukerManuell);
    const erUnderKvp = useSelector(selectErUnderKvp);
    const erReservertKrr = useSelector(selectReservasjonKRR);
    const harNivaa4 = useSelector(selectNivaa4);

    const kanVarsles = erManuellBruker || erUnderKvp || erReservertKrr || !harNivaa4;

    if ([SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker) {
        return null;
    }

    if (erArenaAktivitet) {
        return <ArenaStatusAdministrasjon erBruker={erBruker} kanVarsles={kanVarsles} aktivitet={aktivitet} />;
    }

    return <AktivitetStatusAdministrasjon type={type} aktivitet={aktivitet} />;
};

export default Statusadministrasjon;
