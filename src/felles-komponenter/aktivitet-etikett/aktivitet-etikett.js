import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import EtikettBase from 'nav-frontend-etiketter';
import Text from '../../text';
import hiddenIfHOC from '../hidden-if/hidden-if';
import * as statuskoder from '../../constant';

const cls = type => classNames('etikett', `etikett--${type}`);
const setType = etikettnavn => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
        case statuskoder.JOBBTILBUD:
            return 'ok';
        case statuskoder.DIALOG_IKKE_FERDIGBEHANDLET:
            return 'ikkebehandlet';
        case statuskoder.INNKALT_TIL_INTERVJU:
            return 'info';
        case statuskoder.DIALOG_ESKALERING:
            return 'eskalering';
        case statuskoder.DIALOG_MA_BESVARES:
            return 'mabesvares';
        case statuskoder.AVSLAG:
            return 'varsling';
        case statuskoder.AVTALT_MED_NAV:
            return 'avtalt';
        default:
            return 'info';
    }
};

function AktivitetEtikett({ etikett, id }) {
    return (
        <EtikettBase className={cls(setType(etikett))} type="fokus">
            <Text id={id} />
        </EtikettBase>
    );
}

AktivitetEtikett.propTypes = {
    etikett: PT.string.isRequired,
    id: PT.string.isRequired,
};

export default hiddenIfHOC(AktivitetEtikett);
