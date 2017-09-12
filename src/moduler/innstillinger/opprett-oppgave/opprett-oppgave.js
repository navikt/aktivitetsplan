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
import InnstillingerModal from '../innstillinger-modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../../ducks/utils';
import {
    selectBehandlendeEnheter,
    selectInnstillingerStatus,
} from '../innstillinger-selector';
import OpprettOppgaveForm from './opprett-oppgave-form';
import * as AppPT from '../../../proptypes';

export const OPPRETT_OPPGAVE_FORM = 'opprett-oppgave-form';

function OpprettOppgave({ handleSubmit, innstillingerStatus, enhetliste }) {
    return (
        <InnstillingerModal>
            <Innholdslaster avhengigheter={[innstillingerStatus]}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.opprett-oppgave.overskrift" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <FormattedMessage id="innstillinger.modal.opprett-oppgave.beskrivelse" />
                        </div>
                        <OpprettOppgaveForm
                            handleSubmit={handleSubmit}
                            enhetliste={enhetliste}
                            formNavn={OPPRETT_OPPGAVE_FORM}
                        />
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp
                            formNavn={OPPRETT_OPPGAVE_FORM}
                            mini
                            spinner={
                                innstillingerStatus === STATUS.PENDING ||
                                innstillingerStatus === STATUS.RELOADING
                            }
                            autoDisableVedSpinner
                        >
                            <FormattedMessage id="innstillinger.modal.opprett-oppgave.knapp.bekreft" />
                        </RemoteSubmitKnapp>
                        <RemoteResetKnapp
                            formNavn={OPPRETT_OPPGAVE_FORM}
                            mini
                            onClick={() => history.push('/')}
                        >
                            <FormattedMessage id="innstillinger.modal.opprett-oppgave.knapp.avbryt" />
                        </RemoteResetKnapp>
                    </ModalFooter>
                </div>
            </Innholdslaster>
        </InnstillingerModal>
    );
}

OpprettOppgave.propTypes = {
    handleSubmit: PT.func.isRequired,
    innstillingerStatus: AppPT.status.isRequired,
};

const mapStateToProps = state => ({
    innstillingerStatus: selectInnstillingerStatus(state),
    enhetliste: selectBehandlendeEnheter(state),
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: form => {
        console.log('formHandleSubmit', form);
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettOppgave);
