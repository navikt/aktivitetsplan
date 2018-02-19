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
                                <FormattedMessage id="innstillinger.modal.start-eskalering.automatisk-tekst">
                                    {defaultTekst =>
                                        <BegrunnelseForm
                                            labelId="innstillinger.modal.start-eskalering.begrunnelse"
                                            pakrevdFeilmelding={'start.eskalering.begrunnelse.for-kort'}
                                            formNavn={
                                                START_ESKALERING_FORM_NAME
                                            }
                                            maksBeskrivelseLengde={5000}
                                            defaultBegrunnelse={defaultTekst}
                                            onSubmit={form =>
                                                handleSubmit(form, overskrift)}
                                        />}
                                </FormattedMessage>}
                        </FormattedMessage>
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp
                            formNavn={START_ESKALERING_FORM_NAME}
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
    handleSubmit: (form, overskrift) =>
        dispatch(
            startEskalering({
                begrunnelse: form.begrunnelse,
                overskrift,
            })
        ),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartEskalering);
