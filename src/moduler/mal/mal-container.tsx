import React, { MutableRefObject, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { loggMittMalLagre } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { selectGjeldendeMal } from './aktivitetsmal-selector';
import MalForm from './MalForm';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import Malvisning from './mal-visning';

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
    useEffect(() => {
        setEdit(!viserHistoriskPeriode && underOppfolging && harSkriveTilgang);
    }, [viserHistoriskPeriode, underOppfolging, harSkriveTilgang]);

    if (edit) {
        return (
            <MalForm
                mal={mal}
                dirtyRef={props.dirtyRef}
                handleComplete={() => {
                    setEdit(false);
                    props.dirtyRef.current = false;
                    loggMittMalLagre(erVeileder);
                    props.onLagre();
                }}
            />
        );
    }

   return <Malvisning/>;

};

export default MalContainer;
