import React, { MutableRefObject, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { loggMittMalLagre } from '../../felles-komponenter/utils/logging';
import { useErVeileder } from '../../Provider';
import { selectGjeldendeMal } from './aktivitetsmal-selector';
import MalForm from './MalForm';
import Malvisning from './mal-visning';
import { ReadWriteMode, selectReadWriteMode } from '../../utils/readOrWriteModeReducer';

interface Props {
    dirtyRef: MutableRefObject<boolean>;
    onLagre: () => void;
}

const MalContainer = (props: Props) => {
    const malData = useSelector(selectGjeldendeMal, shallowEqual);
    const mal = malData && malData.mal;
    const erVeileder = useErVeileder();
    const canEdit = useSelector(selectReadWriteMode, shallowEqual) == ReadWriteMode.WRITE;

    if (canEdit) {
        return (
            <MalForm
                mal={mal}
                dirtyRef={props.dirtyRef}
                handleComplete={() => {
                    props.dirtyRef.current = false;
                    loggMittMalLagre(erVeileder);
                    props.onLagre();
                }}
            />
        );
    } else {
        return <Malvisning />;
    }
};

export default MalContainer;
