import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
    GRUPPE_AKTIVITET_TYPE,
    STATUS_AVBRUTT,
    STATUS_FULLFOERT,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import { selectErBruker } from '../../../identitet/identitet-selector';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';
import ForhandsorienteringArenaAktivitetGammel from '../forhandsorientering-gammel/ForhandsorienteringArenaAktivitetGammel';
import ArenaForhaandsorienteringFormKomponent from './ArenaForhaandsorienteringFormKomponent';
import ArenaForhaandsorienteringKomponent from './ArenaForhaandsorienteringKomponent';

interface Props {
    aktivitet: Aktivitet;
}

const ForhaandsorienteringArenaAktivitet = (props: Props) => {
    const { aktivitet } = props;

    const erBruker = useSelector(selectErBruker);
    const erManuellBruker = useSelector(selectErBrukerManuell);
    const erUnderKvp = useSelector(selectErUnderKvp);
    const erReservertKrr = useSelector(selectReservasjonKRR);
    const harNivaa4 = useSelector(selectNivaa4);

    const [forhaandsorienteringLagtTil, setForhaandsorienteringLagtTil] = useState(false);

    const erArenaAktivitet = [TILTAK_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, UTDANNING_AKTIVITET_TYPE].includes(
        aktivitet.type
    );
    const erIFullfortStatus = [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status);
    const kanVarsles = erManuellBruker || erUnderKvp || erReservertKrr || !harNivaa4;
    const erBrukerOgKanVarsles = !erBruker && !kanVarsles;
    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;

    if (!erArenaAktivitet) {
        return null;
    }

    if (erIFullfortStatus || (!erBrukerOgKanVarsles && !forhaandsorienteringLagtTil)) {
        return null;
    }

    if (!forhaandsorienteringLagtTil && aktivitet.forhaandsorientering) {
        return <ArenaForhaandsorienteringKomponent forhaandsorienteringTekst={forhaandsorienteringTekst} />;
    }

    return (
        <ArenaForhaandsorienteringFormKomponent
            aktivitet={aktivitet}
            forhaandsorienteringLagtTil={forhaandsorienteringLagtTil}
            forhandsorienteringSendt={() => setForhaandsorienteringLagtTil(true)}
        />
    );
};

const ForhaandsorienteringArenaAktivitetWrapper = (props: Props) => {
    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();
    return brukeNyForhaandsorientering ? (
        <ForhaandsorienteringArenaAktivitet {...props} />
    ) : (
        <ForhandsorienteringArenaAktivitetGammel {...props} />
    );
};

export default ForhaandsorienteringArenaAktivitetWrapper;
