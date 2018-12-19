import React from 'react';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import { formValueSelector, isDirty } from 'redux-form';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
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
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';

export const OPPRETT_OPPGAVE_FORM = 'opprett-oppgave-form';

function OpprettOppgave({
    innstillingerStatus,
    slettEnheter,
    valgtTema,
    history,
    intl,
    formIsDirty,
    lukkModal,
}) {
    const onRequestClose = () => {
        const dialogTekst = intl.formatMessage({
            id: 'aktkivitet-skjema.lukk-advarsel',
        });
        // eslint-disable-next-line no-alert
        if (!formIsDirty || confirm(dialogTekst)) {
            history.push('/');
            lukkModal();
        } else {
            slettEnheter();
            history.push('/');
        }
    };

    return (
        <InnstillingerModal
            onRequestClose={onRequestClose}
            visConfirmDialog={formIsDirty}
        >
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
    history: AppPT.history.isRequired,
    valgtTema: PT.string,
    intl: intlShape.isRequired,
    formIsDirty: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
};

OpprettOppgave.defaultProps = {
    valgtTema: undefined,
};

const mapStateToProps = state => {
    const selector = formValueSelector(OPPRETT_OPPGAVE_FORM);
    return {
        innstillingerStatus: selectInnstillingerStatus(state),
        valgtTema: selector(state, 'tema'),
        formIsDirty: isDirty(OPPRETT_OPPGAVE_FORM)(state),
    };
};

const mapDispatchToProps = dispatch => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
    slettEnheter: () => dispatch(resetEnheter()),
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(OpprettOppgave)
);
