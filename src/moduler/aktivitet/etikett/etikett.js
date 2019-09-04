import React from 'react';
import PT from 'prop-types';
import EtikettBase from 'nav-frontend-etiketter';
import * as statuskoder from '../../../constant';
import styles from './etikett.module.less';
import visibleIfHOC from '../../../hocs/visible-if';

const getType = etikettnavn => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
        case statuskoder.INNKALT_TIL_INTERVJU:
        case statuskoder.JOBBTILBUD:
            return 'suksess';
        case statuskoder.AVSLAG:
            return 'info';
        default:
            return null;
    }
};

const getText = etikettnavn => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return 'Søknaden er sendt';
        case statuskoder.INNKALT_TIL_INTERVJU:
            return 'Skal på intervju';
        case statuskoder.JOBBTILBUD:
            return 'Fått jobbtilbud';
        case statuskoder.AVSLAG:
            return 'Fått avslag';
        default:
            return null;
    }
};

function Etikett({ etikett }) {
    const type = getType(etikett);

    if (!type) {
        return null;
    }

    return (
        <EtikettBase type={type} className={styles.etikett}>
            {getText(etikett)}
        </EtikettBase>
    );
}

Etikett.defaultProps = {
    etikett: undefined,
};

Etikett.propTypes = {
    etikett: PT.string,
};

export default visibleIfHOC(Etikett);
