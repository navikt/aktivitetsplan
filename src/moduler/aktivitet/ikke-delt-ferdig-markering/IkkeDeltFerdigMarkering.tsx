import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import visibleIfHOC from '../../../hocs/visible-if';
import { selectErBruker } from '../../identitet/identitet-selector';
import styles from './ikke-delt-ferdig-markering.module.less';

export const skalMarkeringVises = ({ type, erReferatPublisert, referat }: Aktivitet): boolean => {
    const harIkkeDeltSamtalereferat = type === SAMTALEREFERAT_TYPE && !erReferatPublisert;
    const harMoteReferat = Boolean(referat);
    const harIkkedeltReferatFraMote = type === MOTE_TYPE && harMoteReferat && !erReferatPublisert;
    return harIkkeDeltSamtalereferat || harIkkedeltReferatFraMote;
};

interface Props {
    className?: string;
}

const IkkeDeltFerdigMarkering = (props: Props) => {
    const { className } = props;

    const erBruker = useSelector(selectErBruker);
    const tekst = erBruker ? 'Samtalereferatet er ikke ferdig' : 'Samtalereferatet er ikke delt';

    return <EtikettBase className={classNames(styles.etikett, className)}>{tekst}</EtikettBase>;
};

export default visibleIfHOC(IkkeDeltFerdigMarkering);
