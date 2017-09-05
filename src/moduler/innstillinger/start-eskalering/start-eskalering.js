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
import { startEskalering } from '../innstillinger-reducer';
import { hentSituasjon } from '../../situasjon/situasjon';
import { STATUS } from '../../../ducks/utils';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import * as AppPT from '../../../proptypes';

export const START_ESKALERING_FORM_NAME = 'start-eskalering-form';

function StartEskalering({ handleSubmit, innstillingerStatus }) {
    return (
        <InnstillingerModal>
            <Innholdslaster avhengigheter={[innstillingerStatus]}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.start-eskalering.overskrift" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <FormattedMessage id="innstillinger.modal.start-eskalering.beskrivelse" />
                        </div>
                        <FormattedMessage id="dialog.eskalering.overskrift">
                            {overskrift =>
                                <BegrunnelseForm
                                    labelId="innstillinger.modal.start-eskalering.begrunnelse"
                                    formNavn={START_ESKALERING_FORM_NAME}
                                    onSubmit={form =>
                                        handleSubmit(form, overskrift)}
                                />}
                        </FormattedMessage>
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp
                            formNavn={START_ESKALERING_FORM_NAME}
                            mini
                            spinner={
                                innstillingerStatus === STATUS.PENDING ||
                                innstillingerStatus === STATUS.RELOADING
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
    innstillingerStatus: AppPT.status.isRequired,
};

const mapStateToProps = state => ({
    innstillingerStatus: selectInnstillingerStatus(state),
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: (form, overskrift) => {
        dispatch(
            startEskalering({
                begrunnelse: form.begrunnelse,
                overskrift,
            })
        )
            .then(() => dispatch(hentSituasjon()))
            .then(() =>
                history.push('/innstillinger/startEskalering/kvittering')
            )
            .catch(() => history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StartEskalering);
