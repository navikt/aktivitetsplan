import React from 'react';

import { StillingFraNavAktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import { MeldInteresseForStilling } from './MeldInteresseForStilling';

interface PropTypes {
    aktivitet: StillingFraNavAktivitet;
}

export const DeleCvContainer = ({ aktivitet }: PropTypes) => {
    const harSvart = !!aktivitet.cvKanDelesData;
    return (
        <>
            <DeleLinje />
            {!harSvart && <MeldInteresseForStilling aktivitet={aktivitet} />}
        </>
    );
};
