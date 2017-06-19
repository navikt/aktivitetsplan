import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import history from '../../history';
import StartProsess from './start-prosess';
import hiddenIfHoc from './../../felles-komponenter/hidden-if/hidden-if';

function StartOppfolgingProsess({ intl }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittel={intl.formatMessage({
                id: 'innstillinger.prosess.startoppfolging.tittel',
            })}
            knappetekst={intl.formatMessage({
                id: 'innstillinger.modal.prosess.start.knapp',
            })}
            onClick={() =>
                history.push('/innstillinger/start/bekreft/')}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.startoppfolging.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}


StartOppfolgingProsess.propTypes = {
    intl: intlShape.isRequired,
};


export default hiddenIfHoc(injectIntl(StartOppfolgingProsess));
