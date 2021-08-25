import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import EtikettBase from '../../../felles-komponenter/etikett-base/EtikettBase';
import visibleIfHOC from '../../../hocs/visible-if';
import { selectErBruker } from '../../identitet/identitet-selector';
import styles from './ikke-ferdig-markering.module.less';

export const SkalIkkeFerdigMarkeringVises = ({ type, erReferatPublisert, referat }: Aktivitet): boolean => {
    const erBruker = useSelector(selectErBruker);
    const harIkkeDeltSamtaleReferat = type === SAMTALEREFERAT_TYPE && !erReferatPublisert;
    const harMoteReferat = Boolean(referat);
    const harIkkeDeltReferatFraMote = type === MOTE_TYPE && harMoteReferat && !erReferatPublisert;
    return erBruker && (harIkkeDeltSamtaleReferat || harIkkeDeltReferatFraMote);
};

interface Props {
    className?: string;
}

const IkkeFerdigMarkering = (props: Props) => {
    const { className } = props;
    return <EtikettBase className={classNames(styles.etikett, className)}>Samtalereferatet er ikke ferdig</EtikettBase>;
};

export default visibleIfHOC(IkkeFerdigMarkering);
