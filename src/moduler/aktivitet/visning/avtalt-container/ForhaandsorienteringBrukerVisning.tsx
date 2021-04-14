import React from 'react';
import { useDispatch } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { markerForhaandsorienteringSomLest } from '../../aktivitet-actions';
import { markerForhaandsorienteringSomLestArenaAktivitet } from '../../arena-aktiviteter-reducer';
import DeleLinje from '../delelinje/delelinje';
import Forhaandsorienteringsvisning from '../hjelpekomponenter/forhaandsorientering/Forhaandsorienteringsvisning';

interface Props {
    aktivitet: Aktivitet;
}

const ForhaandsorienteringBrukerVisning = (props: Props) => {
    const { aktivitet } = props;

    const dispatch = useDispatch();

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
            <Forhaandsorienteringsvisning
                forhaandsorientering={aktivitet.forhaandsorientering}
                onMarkerSomLest={onMarkerSomLest}
            />
            <DeleLinje />
        </>
    );
};

export default ForhaandsorienteringBrukerVisning;
