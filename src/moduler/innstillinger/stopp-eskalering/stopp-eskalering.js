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
import { stoppEskalering } from '../innstillinger-reducer';
import { STATUS } from '../../../ducks/utils';
import {
    selectGjeldendeEskaleringsVarsel,
    selectSituasjonStatus,
} from '../../situasjon/situasjon-selector';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import * as AppPT from '../../../proptypes';

export const STOPP_ESKALERING_FORM_NAME = 'stopp-eskalering-form';

function StoppEskalering({
    avhengigheter,
    handleSubmit,
    innstillingerStatus,
    tilhorendeDialogId,
}) {
    return (
        <InnstillingerModal>
            <Innholdslaster avhengigheter={avhengigheter}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.stopp-eskalering.overskrift" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <FormattedMessage id="innstillinger.modal.stopp-eskalering.beskrivelse" />
                        </div>
                        <FormattedMessage id="innstillinger.modal.stopp-eskalering.automatisk-tekst">
                            {defaultBegrunnelse =>
                                <BegrunnelseForm
                                    labelId="innstillinger.modal.stopp-eskalering.begrunnelse"
                                    defaultBegrunnelse={defaultBegrunnelse}
                                    formNavn={STOPP_ESKALERING_FORM_NAME}
                                    onSubmit={form =>
                                        handleSubmit(form, tilhorendeDialogId)}
                                />}
                        </FormattedMessage>
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp
                            formNavn={STOPP_ESKALERING_FORM_NAME}
                            spinner={
                                innstillingerStatus === STATUS.PENDING ||
                                innstillingerStatus === STATUS.RELOADING
                            }
                            autoDisableVedSpinner
                        >
                            <FormattedMessage id="innstillinger.modal.stopp-eskalering.knapp.bekreft" />
                        </RemoteSubmitKnapp>
                        <RemoteResetKnapp
                            formNavn={STOPP_ESKALERING_FORM_NAME}
                            onClick={() => history.push('/')}
                        >
                            <FormattedMessage id="innstillinger.modal.stopp-eskalering.knapp.avbryt" />
                        </RemoteResetKnapp>
                    </ModalFooter>
                </div>
            </Innholdslaster>
        </InnstillingerModal>
    );
}

StoppEskalering.defaultProps = {
    tilhorendeDialogId: null,
};

StoppEskalering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    handleSubmit: PT.func.isRequired,
    innstillingerStatus: AppPT.status.isRequired,
    tilhorendeDialogId: PT.number,
};

const mapStateToProps = state => {
    const innstillingerStatus = selectInnstillingerStatus(state);
    const situasjonStatus = selectSituasjonStatus(state);
    const gjeldendeEskaleringsVarsel = selectGjeldendeEskaleringsVarsel(state);
    return {
        avhengigheter: [situasjonStatus, innstillingerStatus],
        innstillingerStatus,
        tilhorendeDialogId:
            gjeldendeEskaleringsVarsel &&
            gjeldendeEskaleringsVarsel.tilhorendeDialogId,
    };
};

const mapDispatchToProps = dispatch => ({
    handleSubmit: (form, dialogId) =>
        dispatch(
            stoppEskalering({
                begrunnelse: form.begrunnelse,
                dialogId,
            })
        ),
});

export default connect(mapStateToProps, mapDispatchToProps)(StoppEskalering);
