import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { startOppfolging } from '../../ducks/oppfolging-status';
import ModalFooter from '../modal-footer';
import history from '../../history';

function BekreftStart({ lagre, navn }) {
    return (
        <div>
            <section className="innstillinger__avslutt-periode">
                <div className="blokk-xs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.start.oppfolging.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-m">
                    <FormattedMessage
                        id="innstillinger.modal.start.bekreft.alert-melding"
                        values={{ navn }}
                    />
                </AlertStripeInfoSolid>
            </section>
            <ModalFooter>
                <Hovedknapp mini onClick={() => lagre()}>
                    <FormattedMessage id="innstillinger.modal.start.bekreft.knapp.bekreft" />
                </Hovedknapp>
                <Knapp mini onClick={() => history.push('/')}>
                    <FormattedMessage id="innstillinger.modal.start.oppfolging.knapp.avbryt" />
                </Knapp>
            </ModalFooter>
        </div>
    );
}
BekreftStart.defaultProps = {
    navn: undefined,
};

BekreftStart.propTypes = {
    navn: PT.string,
    lagre: PT.func.isRequired,
};

const mapStateToProps = state => ({
    navn: state.data.motpart.data.navn,
});

const mapDispatchToProps = dispatch => ({
    lagre: () => {
        dispatch(startOppfolging()).then(() =>
            history.push('/innstillinger/start/kvittering')
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(BekreftStart);
