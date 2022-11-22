import React from 'react';

import { AlleAktiviteter, isArenaAktivitet } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import AvtaltFormContainer from './aktivitet/AvtaltFormContainer';
import ArenaForhaandsorienteringFormKomponent from './arena-aktivitet/ArenaForhaandsorienteringFormKomponent';

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: AlleAktiviteter;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const FormContainer = (props: Props) => {
    const { aktivitet, ...rest } = props;

    if (isArenaAktivitet(aktivitet)) {
        return <ArenaForhaandsorienteringFormKomponent aktivitet={aktivitet} {...rest} />;
    }

    return <AvtaltFormContainer aktivitet={aktivitet} {...rest} />;
};

export default FormContainer;
