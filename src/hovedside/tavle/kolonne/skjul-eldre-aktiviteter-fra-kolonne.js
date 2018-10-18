import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { VisibleIfLesmerpanel } from '../../../felles-komponenter/utils/visible-if-lesmerpanel';
import { selectErVeileder } from '../../../moduler/identitet/identitet-selector';
import { lagAktivitetsListe } from './../aktivitetstavle';
import loggEvent from './../../../felles-komponenter/utils/logging';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

function loggingAvSkjulEldreAktiviteter(typeEvent, hvem) {
    loggEvent(typeEvent, hvem);
}

function SkjulEldreAktiviteter({
    aktiviteteterTilDatoMerEnnToManederSiden,
    intl,
    erVeileder,
}) {
    const visible = aktiviteteterTilDatoMerEnnToManederSiden.length > 0;
    const apneTekst = intl.formatMessage({
        id: 'vis-eldre-aktiviteter-apnetekst',
    });
    const lukkTekst = intl.formatMessage({
        id: 'vis-eldre-aktiviteter-lukktekst',
    });
    return (
        <VisibleIfLesmerpanel
            visible={visible}
            className="aktivitetstavle__kolonne-lesmerpanel"
            onOpen={loggingAvSkjulEldreAktiviteter(
                LOGGING_VISELDREAKITIVITETER,
                { erVeileder }
            )}
            onClose={loggingAvSkjulEldreAktiviteter(
                LOGGING_SKJULELDREAKTIVITETER,
                { erVeileder }
            )}
            apneTekst={apneTekst}
            lukkTekst={lukkTekst}
        >
            {lagAktivitetsListe(aktiviteteterTilDatoMerEnnToManederSiden)}
        </VisibleIfLesmerpanel>
    );
}

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
});

SkjulEldreAktiviteter.propTypes = {
    aktiviteteterTilDatoMerEnnToManederSiden: PT.arrayOf(PT.object).isRequired,
    erVeileder: PT.bool.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(connect(mapStateToProps)(SkjulEldreAktiviteter));
