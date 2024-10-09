import React, { MutableRefObject, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { loggMittMalLagre } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
//import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { selectGjeldendeMal } from './aktivitetsmal-selector';
//import Malvisning from './mal-visning';
import MalForm from './MalForm';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';

interface Props {
    dirtyRef: MutableRefObject<boolean>;
    onLagre: () => void;
}

const MalContainer = (props: Props) => {
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const underOppfolging = useSelector(selectErUnderOppfolging, shallowEqual);
    const erVeileder = useErVeileder();
    const harSkriveTilgang = useSelector(selectHarSkriveTilgang, shallowEqual);

    const mal = malData && malData.mal;

    const [edit, setEdit] = useState( !viserHistoriskPeriode && underOppfolging && harSkriveTilgang);

    if (edit) {
        return (
            <MalForm
                mal={mal}
                dirtyRef={props.dirtyRef}
                handleComplete={() => {
                    setEdit(false);
                    props.dirtyRef.current = false;
                    loggMittMalLagre(erVeileder);
                    console.log('Mitt mål lagret');
                    props.onLagre();
                }}
            />
        );
    }

  // return <Malvisning onClick={() => setEdit(true)} />;

};

export default MalContainer;
