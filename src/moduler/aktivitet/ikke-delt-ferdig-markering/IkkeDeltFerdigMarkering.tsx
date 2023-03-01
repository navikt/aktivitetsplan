import { Tag } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { MoteAktivitet, SamtalereferatAktivitet } from '../../../datatypes/internAktivitetTypes';
import { selectErBruker } from '../../identitet/identitet-selector';

export const SkalIkkeDeltFerdigMarkeringVises = (aktivitet: SamtalereferatAktivitet | MoteAktivitet): boolean => {
    const { type, referat, erReferatPublisert } = aktivitet;
    const harIkkeDeltSamtalereferat = type === SAMTALEREFERAT_TYPE && !erReferatPublisert;
    const harMoteReferat = Boolean(referat);
    const harIkkedeltReferatFraMote = type === MOTE_TYPE && harMoteReferat && !erReferatPublisert;
    return harIkkeDeltSamtalereferat || harIkkedeltReferatFraMote;
};

const ReferatIkkeDelt = () => {
    const erBruker = useSelector(selectErBruker);
    const tekst = erBruker ? 'Samtalereferatet er ikke ferdig' : 'Samtalereferatet er ikke delt';

    return (
        <Tag variant="warning" size="small" className="mt-0.5">
            {tekst}
        </Tag>
    );
};

export default ReferatIkkeDelt;
