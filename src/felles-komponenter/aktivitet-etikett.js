import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import visibleIfHOC from '../hocs/visible-if';
import * as statuskoder from '../constant';

const cls = type => classNames('etikett', `etikett--${type}`);
const setType = etikettnavn => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
        case statuskoder.JOBBTILBUD:
            return 'ok';
        case statuskoder.INNKALT_TIL_INTERVJU:
            return 'info';
        case statuskoder.AVSLAG:
        case statuskoder.DIALOG_MA_BESVARES:
        case statuskoder.DIALOG_IKKE_FERDIGBEHANDLET:
            return 'varsling';
        case statuskoder.AVTALT_MED_NAV:
            return 'avtalt';
        default:
            return 'info';
    }
};

function AktivitetEtikett({ etikett, id }) {
    return (
        <span key={etikett} className={cls(setType(etikett))}>
            <FormattedMessage id={id} />
        </span>
    );
}

AktivitetEtikett.propTypes = {
    etikett: PT.string.isRequired,
    id: PT.string.isRequired,
};

export default visibleIfHOC(AktivitetEtikett);
