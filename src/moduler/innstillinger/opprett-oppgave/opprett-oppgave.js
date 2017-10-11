import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import { formValueSelector } from 'redux-form';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import history from '../../../history';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import InnstillingerModal from '../innstillinger-modal';
import { STATUS } from '../../../ducks/utils';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import OpprettOppgaveForm from './opprett-oppgave-form';
import * as AppPT from '../../../proptypes';
import { resetEnheter } from './hent-behandlende-enheter-reducer';

export const OPPRETT_OPPGAVE_FORM = 'opprett-oppgave-form';

function OpprettOppgave({ innstillingerStatus, slettEnheter, valgtTema }) {
    const onRequestClose = () => {
        slettEnheter();
        history.push('/');
    };

    return (
        <InnstillingerModal onRequestClose={onRequestClose}>
            <div>
                <section className="innstillinger__prosess">
                    <Systemtittel className="blokk-s">
                        <FormattedMessage id="innstillinger.modal.opprett-oppgave.beskrivelse" />
                    </Systemtittel>
                    <OpprettOppgaveForm formNavn={OPPRETT_OPPGAVE_FORM} />
                </section>
                <ModalFooter>
                    <RemoteSubmitKnapp
                        formNavn={OPPRETT_OPPGAVE_FORM}
                        spinner={
                            innstillingerStatus === STATUS.PENDING ||
                            innstillingerStatus === STATUS.RELOADING
                        }
                        autoDisableVedSpinner
                        disabled={!valgtTema}
                    >
                        <FormattedMessage id="innstillinger.modal.opprett-oppgave.knapp.bekreft" />
                    </RemoteSubmitKnapp>
                    <RemoteResetKnapp
                        formNavn={OPPRETT_OPPGAVE_FORM}
                        onClick={() => {
                            slettEnheter();
                            history.push('/');
                        }}
                    >
                        <FormattedMessage id="innstillinger.modal.opprett-oppgave.knapp.avbryt" />
                    </RemoteResetKnapp>
                </ModalFooter>
            </div>
        </InnstillingerModal>
    );
}

OpprettOppgave.propTypes = {
    innstillingerStatus: AppPT.status.isRequired,
    slettEnheter: PT.func.isRequired,
    valgtTema: PT.string,
};

OpprettOppgave.defaultProps = {
    valgtTema: undefined,
};

const mapStateToProps = state => {
    const selector = formValueSelector(OPPRETT_OPPGAVE_FORM);
    return {
        innstillingerStatus: selectInnstillingerStatus(state),
        valgtTema: selector(state, 'tema'),
    };
};

const mapDispatchToProps = dispatch => ({
    slettEnheter: () => dispatch(resetEnheter()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettOppgave);
