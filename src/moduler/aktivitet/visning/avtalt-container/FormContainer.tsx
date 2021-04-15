import React from 'react';

import { Aktivitet, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import AvtaltFormContainer from './aktivitet/AvtaltMedNavFormContainer';
import ArenaForhaandsorienteringFormKomponent from './arena-aktivitet/ArenaForhaandsorienteringFormKomponent';

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: Aktivitet;
    erArenaAktivitet: boolean;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const FormContainer = (props: Props) => {
    const { erArenaAktivitet, ...rest } = props;

    //TODO kan vi slå sammen ArenaForhaandsorienteringFormKomponent og AvtaltFormContainer
    if (erArenaAktivitet) {
        return <ArenaForhaandsorienteringFormKomponent {...rest} />;
    }

    return <AvtaltFormContainer {...rest} />;
};

export default FormContainer;
