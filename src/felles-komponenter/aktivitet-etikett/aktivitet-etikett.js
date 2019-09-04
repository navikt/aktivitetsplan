import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import EtikettBase from 'nav-frontend-etiketter';
import Tekstomrade from 'nav-frontend-tekstomrade';
import hiddenIfHOC from '../hidden-if/hidden-if';
import * as statuskoder from '../../constant';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';

const cls = type => classNames('etikett', `etikett--${type}`);

const getType = (etikettnavn, erVeileder) => {
    switch (etikettnavn) {
        case statuskoder.SOKNAD_SENDT:
            return {
                stylingKlasse: 'ok',
                tekst: 'Søknaden er sendt',
            };
        case statuskoder.JOBBTILBUD:
            return {
                stylingKlasse: 'ok',
                tekst: 'Fått jobbtilbud',
            };
        case statuskoder.DIALOG_IKKE_FERDIGBEHANDLET:
            return {
                stylingKlasse: 'ikkebehandlet',
                tekst: 'Venter på svar fra NAV',
            };
        case statuskoder.INNKALT_TIL_INTERVJU:
            return {
                stylingKlasse: 'info',
                tekst: 'Innkalt til intervju',
            };
        case statuskoder.DIALOG_ESKALERING:
            return {
                stylingKlasse: 'eskalering',
                tekst: 'Viktig melding',
            };
        case statuskoder.DIALOG_MA_BESVARES:
            return {
                stylingKlasse: 'mabesvares',
                tekst: erVeileder
                    ? 'Venter på svar fra bruker'
                    : 'NAV venter på svar fra deg',
            };
        case statuskoder.AVSLAG:
            return {
                stylingKlasse: 'varsling',
                tekst: 'Fått avslag',
            };
        case statuskoder.AVTALT_MED_NAV:
            return {
                stylingKlasse: 'avtalt',
                tekst: 'Avtalt med NAV',
            };
        default:
            return {
                stylingKlasse: 'info',
            };
    }
};

function AktivitetEtikett({ etikett, erVeileder }) {
    const etikettData = getType(etikett, erVeileder);
    return (
        <EtikettBase className={cls(etikettData.stylingKlasse)} type="fokus">
            <Tekstomrade>
                {etikettData.tekst}
            </Tekstomrade>
        </EtikettBase>
    );
}

AktivitetEtikett.propTypes = {
    etikett: PT.string.isRequired,
    erVeileder: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
});

export default hiddenIfHOC(connect(mapStateToProps)(AktivitetEtikett));
