import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import { AlleAktiviteter, isArenaAktivitet } from '../../../../datatypes/aktivitetTypes';
import { selectErBruker } from '../../../identitet/identitet-selector';
import AktivitetStatusAdministrasjon from './AktivitetStatusAdministrasjon';
import ArenaStatusAdministrasjon from './ArenaStatusAdministrasjon';

interface Props {
    aktivitet: AlleAktiviteter;
}

const Statusadministrasjon = (props: Props) => {
    const { aktivitet } = props;
    const { type } = aktivitet;

    const erBruker = useSelector(selectErBruker);

    if ([SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker) {
        return null;
    }

    if (isArenaAktivitet(aktivitet)) {
        return <ArenaStatusAdministrasjon erBruker={erBruker} />;
    }

    return <AktivitetStatusAdministrasjon aktivitet={aktivitet} />;
};

export default Statusadministrasjon;
