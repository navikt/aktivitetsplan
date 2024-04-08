import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { SAMTALEREFERAT_TYPE, STILLING_FRA_NAV_TYPE } from '../../../../constant';
import { AktivitetStatus, AlleAktiviteter, isArenaAktivitet } from '../../../../datatypes/aktivitetTypes';
import { ForhaandsorienteringType } from '../../../../datatypes/forhaandsorienteringTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { useErVeileder } from '../../../../Provider';
import { selectErBruker } from '../../../identitet/identitet-selector';
import ForhaandsorienteringsVisningsLinje from './ForhaandsorienteringsVisningsLinje';
import FormContainer from './FormContainer';
import SattTilAvtaltVisning from './SattTilAvtaltVisning';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';

interface Props {
    aktivitet: AlleAktiviteter;
    className?: string;
}

const AvtaltContainer = (props: Props) => {
    const { aktivitet } = props;
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const { type, status, avtalt } = aktivitet;
    const historisk = 'historisk' in aktivitet ? aktivitet.historisk : false;

    const [sendtAtErAvtaltMedNav, setSendtAtErAvtaltMedNav] = useState(false);
    const [forhandsorienteringType, setForhandsorienteringType] = useState<ForhaandsorienteringType>(
        ForhaandsorienteringType.IKKE_SEND,
    );

    const erVeileder = useErVeileder();
    const erBruker = useSelector(selectErBruker);

    const skalViseForhondsorentering =
        aktivitet.forhaandsorientering && aktivitet.forhaandsorientering.type !== ForhaandsorienteringType.IKKE_SEND;
    const skalViseSattTilAvtalt = sendtAtErAvtaltMedNav;

    const erArenaAktivitet = isArenaAktivitet(aktivitet);
    const aktivAktivitet =
        !historisk && underOppfolging && status !== AktivitetStatus.FULLFOERT && status !== AktivitetStatus.AVBRUTT;
    const harForhaandsorientering =
        erArenaAktivitet || aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE
            ? aktivitet.forhaandsorientering
            : avtalt;

    const aktivitetTypeKanAvtales = type !== STILLING_FRA_NAV_TYPE && type !== SAMTALEREFERAT_TYPE;

    const skalViseAvtaltFormKonteiner =
        !harForhaandsorientering && erVeileder && aktivAktivitet && aktivitetTypeKanAvtales;

    if (!skalViseForhondsorentering && !skalViseAvtaltFormKonteiner && !skalViseSattTilAvtalt) {
        return null;
    }

    if (skalViseAvtaltFormKonteiner) {
        return (
            <FormContainer
                setSendtAtErAvtaltMedNav={() => setSendtAtErAvtaltMedNav(true)}
                aktivitet={aktivitet}
                setForhandsorienteringType={setForhandsorienteringType}
            />
        );
    }
    if (skalViseSattTilAvtalt) {
        return <SattTilAvtaltVisning forhaandsorienteringstype={forhandsorienteringType} aktivitet={aktivitet} />;
    }

    return <ForhaandsorienteringsVisningsLinje aktivitet={aktivitet} erBruker={erBruker} />;
};

export default AvtaltContainer;
