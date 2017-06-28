import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import hiddenIfHoc from './../../felles-komponenter/hidden-if/hidden-if';
import { STATUS } from './../../ducks/utils';
import history from '../../history';
import StartProsess from './start-prosess';

function SettManuellProsess({ intl, laster }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittel={intl.formatMessage({
                id: 'innstillinger.prosess.manuell.tittel',
            })}
            knappetekst={intl.formatMessage({
                id: 'innstillinger.modal.prosess.manuell.knapp',
            })}
            laster={laster}
            onClick={() => history.push('/innstillinger/manuell')}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.manuell.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

SettManuellProsess.propTypes = {
    intl: intlShape.isRequired,
    laster: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    laster: state.data.situasjon.status === STATUS.RELOADING,
});

export default connect(mapStateToProps)(
    hiddenIfHoc(injectIntl(SettManuellProsess))
);
