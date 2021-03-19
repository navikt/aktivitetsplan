import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
    GRUPPE_AKTIVITET_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../../constant';
import { Aktivitet, ForhaandsorienteringType } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import { selectErBruker } from '../../../identitet/identitet-selector';
import AvtaltFormContainer from './AvtaltMedNavFormContainer';
import SattTilAvtaltVisning from './SattTilAvtaltVisning';

interface Props {
    underOppfolging: boolean;
    aktivitet: Aktivitet;
    className: string;
}

const AvtaltContainerNy = (props: Props) => {
    const { underOppfolging, aktivitet } = props;
    const { type, status, historisk, avtalt } = aktivitet;

    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();

    const [sendtAtErAvtaltMedNav, setSendtAtErAvtaltMedNav] = useState(false);
    const [forhandsorienteringType, setForhandsorienteringType] = useState<ForhaandsorienteringType>(
        ForhaandsorienteringType.IKKE_SEND
    );

    const erBruker = useSelector(selectErBruker);

    if (!brukeNyForhaandsorientering) {
        return null;
    }

    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(type);
    const aktivitetKanIkkeEndres =
        historisk || !underOppfolging || status === STATUS_FULLFOERT || status === STATUS_AVBRUTT || erArenaAktivitet;

    if (erBruker || aktivitetKanIkkeEndres) {
        return null;
    }

    if (
        !sendtAtErAvtaltMedNav &&
        aktivitet.forhaandsorientering &&
        aktivitet.forhaandsorientering.type === ForhaandsorienteringType.IKKE_SEND
    ) {
        return null;
    }

    if (avtalt) {
        return (
            <SattTilAvtaltVisning
                forhaandsorienteringstype={forhandsorienteringType}
                sendtAtErAvtaltMedNav={sendtAtErAvtaltMedNav}
                aktivitet={aktivitet}
            />
        );
    }

    return (
        <AvtaltFormContainer
            setSendtAtErAvtaltMedNav={setSendtAtErAvtaltMedNav}
            aktivitet={aktivitet}
            setForhandsorienteringType={setForhandsorienteringType}
        />
    );
};

export default AvtaltContainerNy;
