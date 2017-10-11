import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import { avsluttOppfolging } from '../innstillinger-reducer';
import history from '../../../history';
import { AVSLUTT_FORM_NAME } from './avslutt-oppfolginsperiode';
import { RemoteResetKnapp } from '../../../felles-komponenter/remote-knapp/remote-knapp';
import InnstillingerModal from '../innstillinger-modal';
import { selectNavnPaMotpart } from '../../motpart/motpart-selector';
import { selectIdentitetId } from '../../identitet/identitet-selector';
import { selectInnstillingerBegrunnelse } from '../innstillinger-selector';

function BekreftAvslutning({
    doAvsluttOppfolging,
    begrunnelse,
    veilederId,
    navn,
}) {
    return (
        <InnstillingerModal>
            <section className="innstillinger__prosess">
                <div className="blokk-xs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-m">
                    <FormattedMessage
                        id="innstillinger.modal.avslutt.bekreft.alert-melding"
                        values={{ navn }}
                    />
                </AlertStripeInfoSolid>
            </section>
            <ModalFooter>
                <Hovedknapp
                    onClick={() => doAvsluttOppfolging(begrunnelse, veilederId)}
                >
                    <FormattedMessage id="innstillinger.modal.avslutt.bekreft.knapp.bekreft" />
                </Hovedknapp>
                <RemoteResetKnapp
                    formNavn={AVSLUTT_FORM_NAME}
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avbryt" />
                </RemoteResetKnapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}
BekreftAvslutning.defaultProps = {
    begrunnelse: undefined,
    navn: undefined,
    veilederId: undefined,
};

BekreftAvslutning.propTypes = {
    navn: PT.string,
    begrunnelse: PT.string,
    veilederId: PT.string,
    doAvsluttOppfolging: PT.func.isRequired,
};

const mapStateToProps = state => ({
    navn: selectNavnPaMotpart(state),
    veilederId: selectIdentitetId(state),
    begrunnelse: selectInnstillingerBegrunnelse(state),
});

const mapDispatchToProps = dispatch => ({
    doAvsluttOppfolging: (begrunnelse, veilederId) => {
        dispatch(avsluttOppfolging(begrunnelse, veilederId))
            .then(() => history.push('/innstillinger/avslutt/kvittering'))
            .catch(() => history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(BekreftAvslutning);
