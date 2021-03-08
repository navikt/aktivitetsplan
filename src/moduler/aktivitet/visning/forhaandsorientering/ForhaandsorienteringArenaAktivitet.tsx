import React, { useState } from 'react';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import DeleLinje from '../delelinje/delelinje';
import ForhandsorienteringArenaAktivitetGammel from '../forhandsorientering-gammel/ForhandsorienteringArenaAktivitetGammel';
import ForhaandsorieteringsForm from './ForhaandsorienteringForm';
import ForhaandsorienteringLagtTilInfotekst from './ForhaandsorienteringLagtTilInfotekst';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from './KanIkkeLeggeTilForhaandsorienteringInfotekst';

interface Props {
    aktivitet: Aktivitet;
    kanSendeForhaandsorientering: boolean;
}

const ForhaandsorienteringArenaAktivitet = (props: Props) => {
    const { aktivitet, kanSendeForhaandsorientering } = props;

    const [forhaandsorienteringLagtTil, setForhaandsorienteringLagtTil] = useState(false);

    if (
        [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status) ||
        (!kanSendeForhaandsorientering && !forhaandsorienteringLagtTil)
    ) {
        return null;
    }

    const merEnnSyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato) || !aktivitet.tilDato;

    return (
        <>
            <div className="aktivitetvisning__underseksjon">
                <KanIkkeLeggeTilForhaandsorienteringInfotekst merEnnSyvDagerTil={merEnnSyvDagerTil} />
                <ForhaandsorieteringsForm
                    valgtAktivitet={aktivitet}
                    visible={merEnnSyvDagerTil && !forhaandsorienteringLagtTil}
                    forhandsorienteringSendt={() => setForhaandsorienteringLagtTil(true)}
                />
                <ForhaandsorienteringLagtTilInfotekst forhaandsorienteringIkkeLagtTil={!forhaandsorienteringLagtTil} />
            </div>
            <DeleLinje />
        </>
    );
};

const ForhaandsorienteringArenaAktivitetWrapper = (props: Props) => {
    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();
    return brukeNyForhaandsorientering ? (
        <ForhaandsorienteringArenaAktivitet {...props} />
    ) : (
        <ForhandsorienteringArenaAktivitetGammel
            visible={props.kanSendeForhaandsorientering}
            aktivitet={props.aktivitet}
        />
    );
};

export default ForhaandsorienteringArenaAktivitetWrapper;
