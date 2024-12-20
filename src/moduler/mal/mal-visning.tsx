import { BodyLong } from '@navikt/ds-react';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { selectGjeldendeMal } from './aktivitetsmal-selector';
import { selectMalListe } from './malliste-selector';
import { selectViserHistoriskPeriode } from '../oppfolging-status/oppfolging-selector';

const Malvisning = () => {
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const historiskeMal = useSelector(selectMalListe, shallowEqual);
    const historiskVisning = useSelector(selectViserHistoriskPeriode, shallowEqual);

    const mal = malData && malData.mal;
    const malText: string =
        (historiskVisning && historiskeMal.length === 0) || !mal ? 'Det ble ikke skrevet mål i denne perioden' : mal;

    return (
        <div className="mb-8">
            <BodyLong className="mb-8">{malText}</BodyLong>
        </div>
    );
};

export default Malvisning;
