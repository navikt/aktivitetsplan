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
import { erMerEnnSyvDagerTil } from '../../../../utils';
import { selectErBruker } from '../../../identitet/identitet-selector';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';
import DeleLinje from '../delelinje/delelinje';
import ForhandsorienteringArenaAktivitetGammel from '../forhandsorientering-gammel/ForhandsorienteringArenaAktivitetGammel';
import Forhaandsorenteringsvisning from '../hjelpekomponenter/Forhaandsorenteringsvisning';
import ForhaandsorieteringsForm from './ForhaandsorienteringForm';
import ForhaandsorienteringLagtTilInfotekst from './ForhaandsorienteringLagtTilInfotekst';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from './KanIkkeLeggeTilForhaandsorienteringInfotekst';

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

    if (!erArenaAktivitet) {
        return null;
    }

    const kanVarsles = erManuellBruker || erUnderKvp || erReservertKrr || !harNivaa4;

    const erBrukerOgKanVarsles = !erBruker && !kanVarsles;

    if (
        [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status) ||
        (!erBrukerOgKanVarsles && !forhaandsorienteringLagtTil)
    ) {
        return null;
    }

    if (!forhaandsorienteringLagtTil && aktivitet.forhaandsorientering) {
        return (
            <>
                <DeleLinje />
                <Forhaandsorenteringsvisning forhaandsorientering={aktivitet.forhaandsorientering} />
                <DeleLinje />
            </>
        );
    }

    const merEnnSyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato) || !aktivitet.tilDato;

    return (
        <>
            <DeleLinje />
            <div className="aktivitetvisning__underseksjon">
                <KanIkkeLeggeTilForhaandsorienteringInfotekst merEnnSyvDagerTil={merEnnSyvDagerTil} />
                <ForhaandsorieteringsForm
                    valgtAktivitet={aktivitet}
                    visible={merEnnSyvDagerTil && !forhaandsorienteringLagtTil}
                    forhandsorienteringSendt={() => setForhaandsorienteringLagtTil(true)}
                />
                <ForhaandsorienteringLagtTilInfotekst forhaandsorienteringIkkeLagtTil={!forhaandsorienteringLagtTil} />
            </div>
            <Forhaandsorenteringsvisning forhaandsorientering={aktivitet.forhaandsorientering} />
            <DeleLinje />
        </>
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
