import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectGjeldendeMal } from './aktivitetsmal-reducer';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { selectErVeileder } from '../identitet/identitet-selector';
import { loggMittMalLagre } from '../../felles-komponenter/utils/logging';
import MalForm from './mal-form';
import Malvisning from './mal-visning';

function MalContainer() {
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const erVeileder = useSelector(selectErVeileder, shallowEqual);
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);

    const mal = malData && malData.mal;

    const [edit, setEdit] = useState(!viserHistoriskPeriode && !mal && underOppfolging && harSkriveTilgang);

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
