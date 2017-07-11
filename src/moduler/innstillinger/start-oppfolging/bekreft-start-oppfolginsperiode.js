import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { startOppfolging } from '../innstillinger-reducer';
import ModalFooter from '../../../modal/modal-footer';
import history from '../../../history';
import InnstillingerModal from '../innstillinger-modal';
import { hentSituasjon } from '../../../ducks/situasjon';

function BekreftStart({ doStartOppfolging, navn }) {
    return (
        <InnstillingerModal>
            <section className="innstillinger__prosess">
                <div className="blokk-xs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.startoppfolging.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-m">
                    <FormattedMessage
                        id="innstillinger.modal.startoppfolging.bekreft.alert-melding"
                        values={{ navn }}
                    />
                </AlertStripeInfoSolid>
            </section>
            <ModalFooter>
                <Hovedknapp mini onClick={() => doStartOppfolging()}>
                    <FormattedMessage id="innstillinger.modal.startoppfolging.knapp.bekreft" />
                </Hovedknapp>
                <Knapp mini onClick={() => history.push('/')}>
                    <FormattedMessage id="innstillinger.modal.startoppfolging.knapp.avbryt" />
                </Knapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}
BekreftStart.defaultProps = {
    navn: undefined,
};

BekreftStart.propTypes = {
    navn: PT.string,
    doStartOppfolging: PT.func.isRequired,
};

const mapStateToProps = state => ({
    navn: state.data.motpart.data.navn,
});

const mapDispatchToProps = dispatch => ({
    doStartOppfolging: () => {
        dispatch(startOppfolging())
            .then(() => history.push('/innstillinger/start/kvittering'))
            .then(() => dispatch(hentSituasjon()))
            .catch(() => history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(BekreftStart);
