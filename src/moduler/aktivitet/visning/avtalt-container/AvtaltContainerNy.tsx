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
import { selectErBruker, selectErVeileder } from '../../../identitet/identitet-selector';
import ForhaandsorienteringsVisningsLinje from './ForhaandsorienteringsVisningsLinje';
import FormContainer from './FormContainer';
import SattTilAvtaltVisning from './SattTilAvtaltVisning';

interface Props {
    underOppfolging: boolean;
    aktivitet: Aktivitet;
    className: string;
}

const AvtaltContainerNy = (props: Props) => {
    const { underOppfolging, aktivitet } = props;
    const { type, status, historisk, avtalt } = aktivitet;

    const [sendtAtErAvtaltMedNav, setSendtAtErAvtaltMedNav] = useState(false);
    const [forhandsorienteringType, setForhandsorienteringType] = useState<ForhaandsorienteringType>(
        ForhaandsorienteringType.IKKE_SEND
    );

    const erVeileder = useSelector(selectErVeileder);
    const erBruker = useSelector(selectErBruker);

    const skalViseForhondsorentering =
        aktivitet.forhaandsorientering && aktivitet.forhaandsorientering.type !== ForhaandsorienteringType.IKKE_SEND;
    const skalViseSattTilAvtalt = sendtAtErAvtaltMedNav;

    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(type);
    const aktivAktivitet = !historisk && underOppfolging && status !== STATUS_FULLFOERT && status !== STATUS_AVBRUTT;
    const harForhaandsorientering = erArenaAktivitet ? aktivitet.forhaandsorientering : avtalt;

    const skalViseAvtaltFormKonteiner = !harForhaandsorientering && erVeileder && aktivAktivitet;

    if (!skalViseForhondsorentering && !skalViseAvtaltFormKonteiner && !skalViseSattTilAvtalt) {
        return null;
    }

    if (skalViseAvtaltFormKonteiner) {
        return (
            <FormContainer
                setSendtAtErAvtaltMedNav={() => setSendtAtErAvtaltMedNav(true)}
                aktivitet={aktivitet}
                setForhandsorienteringType={setForhandsorienteringType}
                erArenaAktivitet={erArenaAktivitet}
            />
        );
    }
    if (skalViseSattTilAvtalt) {
        return (
            <SattTilAvtaltVisning
                forhaandsorienteringstype={forhandsorienteringType}
                aktivitet={aktivitet}
                erArenaAktivitet={erArenaAktivitet}
            />
        );
    }

    return (
        <ForhaandsorienteringsVisningsLinje
            aktivitet={aktivitet}
            erBruker={erBruker}
            erArenaAktivitet={erArenaAktivitet}
        />
    );
};

export default AvtaltContainerNy;
