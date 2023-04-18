import { BodyLong } from '@navikt/ds-react';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/HiddenIfHovedknapp';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { selectGjeldendeMal } from './aktivitetsmal-selector';
import { selectMalListe } from './malliste-selector';

interface Props {
    onClick: () => void;
}

const Malvisning = (props: Props) => {
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
        <div className="mb-8">
            <BodyLong className="mb-8">{malText}</BodyLong>
            <HiddenIfHovedknapp
                onClick={onClick}
                hidden={historiskVisning}
                disabled={!harSkriveTilgang || !underOppfolging}
            >
                Rediger
            </HiddenIfHovedknapp>
        </div>
    );
};

export default Malvisning;
