import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';
import ForhaandsorieteringsForm from './ForhaandsorienteringForm';
import ForhaandsorienteringLagtTilInfotekst from './ForhaandsorienteringLagtTilInfotekst';
import KanIkkeLeggeTilForhaandsorienteringInfotekst from './KanIkkeLeggeTilForhaandsorienteringInfotekst';

interface Props {
    aktivitet: Aktivitet;
    forhaandsorienteringLagtTil: boolean;
    forhandsorienteringSendt(): void;
}

const ArenaForhaandsorienteringFormKomponent = (props: Props) => {
    const { forhaandsorienteringLagtTil, forhandsorienteringSendt, aktivitet } = props;

    const merEnnSyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato) || !aktivitet.tilDato;
    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;
    const forhaandsorienteringLest = aktivitet.forhaandsorientering?.lest;

    return (
        <>
            <DeleLinje />
            <div className="aktivitetvisning__underseksjon">
                <KanIkkeLeggeTilForhaandsorienteringInfotekst merEnnSyvDagerTil={merEnnSyvDagerTil} />
                <ForhaandsorieteringsForm
                    valgtAktivitet={aktivitet}
                    visible={merEnnSyvDagerTil && !forhaandsorienteringLagtTil}
                    forhandsorienteringSendt={forhandsorienteringSendt}
                />
                <ForhaandsorienteringLagtTilInfotekst forhaandsorienteringIkkeLagtTil={!forhaandsorienteringLagtTil} />
            </div>
            <Forhaandsorienteringsvisning
                forhaandsorienteringTekst={forhaandsorienteringTekst}
                forhaandsorienteringLest={forhaandsorienteringLest}
                hidden={!forhaandsorienteringTekst}
            />
            <DeleLinje />
        </>
    );
};

export default ArenaForhaandsorienteringFormKomponent;
