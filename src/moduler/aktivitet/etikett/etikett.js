import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import * as statuskoder from '../../../constant';
import visibleIfHOC from '../../../hocs/visible-if';
import styles from './etikett.module.less';
import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';

const getCls = etikettnavn => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return styles.soknadSendt;
        case statuskoder.INNKALT_TIL_INTERVJU:
            return styles.inkaltTilIntervju;
        case statuskoder.JOBBTILBUD:
            return styles.jobbtilbud;
        case statuskoder.AVSLAG:
            return styles.avslag;
        default:
            return styles.ikkeStartet;
    }
};

const getText = etikettnavn => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return 'Sendt søknad';
        case statuskoder.INNKALT_TIL_INTERVJU:
            return 'Skal på intervju';
        case statuskoder.JOBBTILBUD:
            return 'Fått jobbtilbud 🎉';
        case statuskoder.AVSLAG:
            return 'Fått avslag';
        default:
            return 'Ikke startet';
    }
};

function Etikett({ etikett, className }) {
    const cls = getCls(etikett);

    return <EtikettBase className={classNames(cls, className)}>{getText(etikett)}</EtikettBase>;
}

Etikett.defaultProps = {
    etikett: undefined,
    className: undefined
};

Etikett.propTypes = {
    etikett: PT.string,
    className: PT.string
};

export default visibleIfHOC(Etikett);
