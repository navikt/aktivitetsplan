import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import history from '../../../history';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import BegrunnelseForm from '../begrunnelse-form';
import InnstillingerModal from '../innstillinger-modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { situasjon } from '../../../proptypes';
import { startEskalering } from '../innstillinger-reducer';
import { hentSituasjon } from '../../situasjon/situasjon';
import { nyHenvendelse } from '../../../ducks/dialog';
import { STATUS } from '../../../ducks/utils';

export const START_ESKALERING_FORM_NAME = 'start-eskalering-form';

function StartEskalering({ handleSubmit, innstillingerReducer }) {
    return (
        <InnstillingerModal>
            <Innholdslaster avhengigheter={[innstillingerReducer]}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.start-eskalering.overskrift" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <FormattedMessage id="innstillinger.modal.start-eskalering.beskrivelse" />
                        </div>
                        <BegrunnelseForm
                            labelId="innstillinger.modal.start-eskalering.begrunnelse"
                            formNavn={START_ESKALERING_FORM_NAME}
                            onSubmit={handleSubmit}
                        />
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp
                            formNavn={START_ESKALERING_FORM_NAME}
                            mini
                            spinner={
                                innstillingerReducer.status ===
                                    STATUS.PENDING ||
                                innstillingerReducer.status === STATUS.RELOADING
                            }
                            autoDisableVedSpinner
                        >
                            <FormattedMessage id="innstillinger.modal.start-eskalering.knapp.bekreft" />
                        </RemoteSubmitKnapp>
                        <RemoteResetKnapp
                            formNavn={START_ESKALERING_FORM_NAME}
                            mini
                            onClick={() => history.push('/')}
                        >
                            <FormattedMessage id="innstillinger.modal.start-eskalering.knapp.avbryt" />
                        </RemoteResetKnapp>
                    </ModalFooter>
                </div>
            </Innholdslaster>
        </InnstillingerModal>
    );
}

StartEskalering.propTypes = {
    handleSubmit: PT.func.isRequired,
    innstillingerReducer: situasjon.isRequired,
};

const mapStateToProps = state => ({
    innstillingerReducer: state.data.innstillinger,
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: form => {
        dispatch(
            nyHenvendelse({
                tekst: form.begrunnelse,
                overskrift: 'string',
            })
        ).then(henvendelse =>
            dispatch(startEskalering(henvendelse.data.id))
                .then(() =>
                    history.push('/innstillinger/startEskalering/kvittering')
                )
                .then(() => dispatch(hentSituasjon()))
                .catch(() => history.push('/innstillinger/feilkvittering'))
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StartEskalering);
