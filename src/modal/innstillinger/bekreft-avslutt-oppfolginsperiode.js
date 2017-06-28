import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import ModalFooter from '../modal-footer';
import { avsluttOppfolging } from '../../ducks/situasjon';
import history from '../../history';
import { AVSLUTT_FORM_NAME } from './avslutt-oppfolginsperiode';
import { RemoteResetKnapp } from './remote-knapp';

function BekreftAvslutning({
    doAvsluttOppfolging,
    begrunnelse,
    veilederId,
    navn,
}) {
    return (
        <div>
            <section className="innstillinger__avslutt-periode">
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
                    mini
                    onClick={() => doAvsluttOppfolging(begrunnelse, veilederId)}
                >
                    <FormattedMessage id="innstillinger.modal.avslutt.bekreft.knapp.bekreft" />
                </Hovedknapp>
                <RemoteResetKnapp
                    formNavn={AVSLUTT_FORM_NAME}
                    mini
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avbryt" />
                </RemoteResetKnapp>
            </ModalFooter>
        </div>
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
    navn: state.data.motpart.data.navn,
    veilederId: state.data.identitet.data.id,
    begrunnelse: formValueSelector(AVSLUTT_FORM_NAME)(state, 'begrunnelse'),
});

const mapDispatchToProps = dispatch => ({
    doAvsluttOppfolging: (begrunnelse, veilederId) => {
        dispatch(avsluttOppfolging(begrunnelse, veilederId)).then(
            () => history.push('/innstillinger/avslutt/kvittering')
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(BekreftAvslutning);
