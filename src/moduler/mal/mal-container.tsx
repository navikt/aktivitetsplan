import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectGjeldendeMal } from './aktivitetsmal-reducer';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import { loggMittMalLagre } from '../../felles-komponenter/utils/logging';
import MalForm from './mal-form';
import Malvisning from './mal-visning';

function MalContainer() {
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);

    const mal = malData && malData.mal;

    const [edit, setEdit] = useState(!viserHistoriskPeriode && !mal && underOppfolging);

    if (edit) {
        return (
            <MalForm
                mal={mal}
                handleComplete={() => {
                    setEdit(false);
                    loggMittMalLagre(erVeileder);
                }}
            />
        );
    }

    return <Malvisning onClick={() => setEdit(true)} />;
}

export default MalContainer;
