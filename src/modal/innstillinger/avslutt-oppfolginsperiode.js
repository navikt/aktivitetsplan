import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import ModalFooter from '../modal-footer';
import history from '../../history';
import { RemoteSubmitKnapp, RemoteResetKnapp } from './remote-knapp';
import BegrunnelseForm from './begrunnelse-form';
import { lagreBegrunnelse } from '../../ducks/situasjon';
import InnstillingerModal from '../innstillinger/innstillinger-modal';

export const AVSLUTT_FORM_NAME = 'avslutt-oppfolging-form';

function AvsluttOppfolgingperiode({ doLagreBegrunnelse }) {
    return (
        <InnstillingerModal>
            <section className="innstillinger__avslutt-periode">
                <Systemtittel>
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                </Systemtittel>
                <div className="blokk-xxs">
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.beskrivelse" />
                </div>
                <BegrunnelseForm
                    labelId="innstillinger.modal.avslutt.oppfolging.begrunnelse"
                    formNavn={AVSLUTT_FORM_NAME}
                    onSubmit={form => {
                        doLagreBegrunnelse(form.begrunnelse);
                        return history.push('/innstillinger/avslutt/bekreft');
                    }}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp formNavn={AVSLUTT_FORM_NAME} mini>
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avslutt" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={AVSLUTT_FORM_NAME}
                    mini
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.knapp.avbryt" />
                </RemoteResetKnapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}

AvsluttOppfolgingperiode.propTypes = {
    doLagreBegrunnelse: PT.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    doLagreBegrunnelse: begrunnelse => dispatch(lagreBegrunnelse(begrunnelse)),
});

export default connect(null, mapDispatchToProps)(AvsluttOppfolgingperiode);
