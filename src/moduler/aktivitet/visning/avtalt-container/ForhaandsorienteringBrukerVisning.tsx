import React from 'react';
import { useDispatch } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { markerForhaandsorienteringSomLest } from '../../aktivitet-actions';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../arena-aktiviteter-reducer';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorenteringsvisning from '../hjelpekomponenter/Forhaandsorenteringsvisning';

interface Props {
    aktivitet: Aktivitet;
}

const ForhaandsorienteringBrukerVisning = (props: Props) => {
    const { aktivitet } = props;

    const dispatch = useDispatch();

    const forhaandsorienteringTekst = aktivitet.forhaandsorientering?.tekst;
    const forhaandsorienteringLest = aktivitet.forhaandsorientering?.lest;

    const onMarkerSomLest = () => {
        if (aktivitet.arenaAktivitet) {
            dispatch(markerForhaandsorienteringSomLestArenaAktivitet(aktivitet));
        } else {
            dispatch(markerForhaandsorienteringSomLest(aktivitet));
        }
    };

    return (
        <>
            <DeleLinje />
            <Forhaandsorenteringsvisning
                forhaandsorienteringTekst={forhaandsorienteringTekst}
                forhaandsorienteringLest={forhaandsorienteringLest}
                hidden={!forhaandsorienteringTekst}
                markerSomLest={onMarkerSomLest}
            />
            <DeleLinje />
        </>
    );
};

export default ForhaandsorienteringBrukerVisning;
