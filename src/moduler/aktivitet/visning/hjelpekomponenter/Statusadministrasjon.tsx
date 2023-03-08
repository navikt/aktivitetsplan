import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../../constant';
import { AlleAktiviteter, isVeilarbAktivitet } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { selectErBruker } from '../../../identitet/identitet-selector';
import AktivitetStatusAdministrasjon from './AktivitetStatusAdministrasjon';

interface Props {
    aktivitet: AlleAktiviteter;
}

const Statusadministrasjon = (props: Props) => {
    const { aktivitet } = props;
    const { type } = aktivitet;

    if (!isVeilarbAktivitet(aktivitet)) return null;

    const erBruker = useSelector(selectErBruker);

    if (type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE) {
        return null;
    }

    if ([SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker) {
        return null;
    }

    return <AktivitetStatusAdministrasjon aktivitet={aktivitet} />;
};

export default Statusadministrasjon;
