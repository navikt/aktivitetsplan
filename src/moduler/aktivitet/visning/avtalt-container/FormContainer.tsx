import React from 'react';

import { Aktivitet, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import AvtaltFormContainer from './aktivitet/AvtaltFormContainer';
import ArenaForhaandsorienteringFormKomponent from './arena-aktivitet/ArenaForhaandsorienteringFormKomponent';

interface Props {
    setSendtAtErAvtaltMedNav(): void;
    aktivitet: Aktivitet;
    erArenaAktivitet: boolean;
    setForhandsorienteringType(type: ForhaandsorienteringType): void;
}

const FormContainer = (props: Props) => {
    const { erArenaAktivitet, ...rest } = props;

    const brukerNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();

    if (!brukerNyForhaandsorientering) {
        return null;
    }

    //TODO kan vi slå sammen ArenaForhaandsorienteringFormKomponent og AvtaltFormContainer
    if (erArenaAktivitet) {
        return <ArenaForhaandsorienteringFormKomponent {...rest} />;
    }

    return <AvtaltFormContainer {...rest} />;
};

export default FormContainer;
