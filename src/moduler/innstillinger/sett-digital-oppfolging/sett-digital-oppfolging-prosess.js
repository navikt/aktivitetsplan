import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import history from '../../../history';
import StartProsess from '../prosesser/start-prosess';
import { SLETT_BEGRUNNELSE_ACTION } from '../innstillinger-reducer';
import { HiddenIfAlertStripeInfoSolid } from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';

function SettDigitalOppfolgingProsess({ slettBegrunnelse, reservasjonKRR }) {
    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.digital.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
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
    slettBegrunnelse: PT.func.isRequired,
    reservasjonKRR: PT.bool,
};

const mapStateToProps = state => ({
    reservasjonKRR: state.data.innstillinger.data.reservasjonKRR,
});

const mapDispatchToProps = dispatch => ({
    slettBegrunnelse: () => {
        dispatch(SLETT_BEGRUNNELSE_ACTION);
        history.push('/innstillinger/digital');
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    hiddenIfHoc(SettDigitalOppfolgingProsess)
);
