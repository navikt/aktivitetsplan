import Tekstomrade from 'nav-frontend-tekstomrade';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { selectGjeldendeMal } from './aktivitetsmal-reducer';
import { selectMalListe } from './aktivitetsmal-selector';

interface Props {
    onClick: () => void;
}

function Malvisning(props: Props) {
    const { onClick } = props;
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const historiskeMal = useSelector(selectMalListe, shallowEqual);
    const historiskVisning = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);

    const mal = malData && malData.mal;
    const malText: string =
        (historiskVisning && historiskeMal.length === 0) || !mal ? 'Det ble ikke skrevet mål i denne perioden' : mal;

    return (
        <div className="aktivitetmal__innhold">
            <Tekstomrade className="aktivitetmal__tekst">{malText}</Tekstomrade>
            <HiddenIfHovedknapp
                onClick={onClick}
                hidden={historiskVisning}
                disabled={!harSkriveTilgang || !underOppfolging}
            >
                Rediger
            </HiddenIfHovedknapp>
        </div>
    );
}

export default Malvisning;
