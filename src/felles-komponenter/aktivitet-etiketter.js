import React, { PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import './aktivitet-etiketter.less';
import * as statuskoder from '../constant';

const cls = (type) => classNames('etikett', `etikett--${type}`);
const setType = (etikettnavn) => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return 'ok';
        case statuskoder.INNKALT_TIL_INTERVJU:
        case statuskoder.JOBBTILBUD:
            return 'info';
        case statuskoder.AVSLAG:
            return 'varsling';
        case statuskoder.AVTALT_MED_NAV:
            return 'avtalt';
        default:
            return '';
    }
};

function AktivitetEtikett({ etikett, id }) {
    return (
        etikett ?
            <span key={etikett} className={cls(setType(etikett))}>
                <FormattedMessage id={id} />
            </span> : null
    );
}

AktivitetEtikett.propTypes = {
    etikett: PT.string.isRequired,
    id: PT.string.isRequired
};

export default AktivitetEtikett;
