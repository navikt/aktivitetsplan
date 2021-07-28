import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';

interface PropTypes {
    aktivitet: Aktivitet;
}

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const harSvart = aktivitet.stillingFraNavData && !!aktivitet.stillingFraNavData.cvKanDelesData;
    return (
        <>
            <DeleLinje />
            {!harSvart && <MeldInteresseForStilling aktivitet={aktivitet} />}
        </>
    );
};
