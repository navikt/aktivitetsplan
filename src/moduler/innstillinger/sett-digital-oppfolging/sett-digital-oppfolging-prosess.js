import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import { SLETT_BEGRUNNELSE_ACTION } from '../../../ducks/situasjon';
import {
    HiddenIfAlertStripeInfoSolid,
} from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';

function SettDigitalOppfolgingProsess({
    intl,
    slettBegrunnelse,
    reservasjonKRR,
}) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittel={intl.formatMessage({
                id: 'innstillinger.prosess.digital.tittel',
            })}
            knappetekst={intl.formatMessage({
                id: 'innstillinger.modal.prosess.start.knapp',
            })}
            disabled={reservasjonKRR}
            onClick={() => slettBegrunnelse()}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.digital.tekst" />
                </Normaltekst>
                <HiddenIfAlertStripeInfoSolid hidden={!reservasjonKRR}>
                    <FormattedMessage id="instillinger.proses.manuell.reservasjon-krr" />
                </HiddenIfAlertStripeInfoSolid>
            </div>
        </StartProsess>
    );
}

SettDigitalOppfolgingProsess.defaultProps = {
    reservasjonKRR: false,
};

SettDigitalOppfolgingProsess.propTypes = {
    intl: intlShape.isRequired,
    slettBegrunnelse: PT.func.isRequired,
    reservasjonKRR: PT.bool,
};

const mapStateToProps = state => ({
    reservasjonKRR: state.data.situasjon.data.reservasjonKRR,
});

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
        history.push('/innstillinger/digital');
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(injectIntl(SettDigitalOppfolgingProsess))
);
