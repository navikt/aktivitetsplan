import React from 'react';
import PT from 'prop-types';
import * as statuskoder from '../../../constant';
import visibleIfHOC from '../../../hocs/visible-if';
import EtikettBase from '../../../felles-komponenter/etikett-base/etikett-base';
import styles from './etikett.module.less';

const getCls = etikettnavn => {
    switch (etikettnavn) {
        case statuskoder.DIALOG_IKKE_FERDIGBEHANDLET:
            return styles.etikettIkkeBehandlet;
        case statuskoder.DIALOG_MA_BESVARES:
            return styles.etikettMaBesvares;
        case statuskoder.DIALOG_ESKALERING:
            return styles.etikettEskalering;
        default:
            return null;
    }
};

const getText = (etikettnavn, erBruker) => {
    switch (etikettnavn) {
        case statuskoder.DIALOG_IKKE_FERDIGBEHANDLET:
            return 'Venter på svar fra NAV';
        case statuskoder.DIALOG_MA_BESVARES:
            return erBruker
                ? 'NAV venter på svar fra deg'
                : 'Venter på svar fra bruker';
        case statuskoder.DIALOG_ESKALERING:
            return 'Viktig melding';
        default:
            return null;
    }
};

function Etikett({ etikett, erBruker }) {
    return (
        <EtikettBase type="fokus" className={getCls(etikett, erBruker)}>
            {getText(etikett)}
        </EtikettBase>
    );
}

Etikett.defaultProps = {
    etikett: undefined,
    erBruker: false,
};

Etikett.propTypes = {
    etikett: PT.string,
    erBruker: PT.bool,
};

export default visibleIfHOC(Etikett);
