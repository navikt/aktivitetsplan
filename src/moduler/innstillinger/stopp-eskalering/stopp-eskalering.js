import React, { Component } from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import history from '../../../history';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import BegrunnelseForm from '../begrunnelse-form';
import InnstillingerModal from '../innstillinger-modal';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import {
    stoppEskalering,
    stoppEskaleringUtenHenvendelse,
} from '../innstillinger-reducer';
import { STATUS } from '../../../ducks/utils';
import {
    selectGjeldendeEskaleringsVarsel,
    selectOppfolgingStatus,
} from '../../oppfolging-status/oppfolging-selector';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import * as AppPT from '../../../proptypes';
import { div as HiddenIfDiv } from '../../../felles-komponenter/hidden-if/hidden-if';

export const STOPP_ESKALERING_FORM_NAME = 'stopp-eskalering-form';

class StoppEskalering extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        };
        this.toggleHenvedelseTekstFelt = this.toggleHenvedelseTekstFelt.bind(
            this
        );
    }

    toggleHenvedelseTekstFelt() {
        this.setState({ checked: !this.state.checked });
    }

    render() {
        const {
            avhengigheter,
            handleSubmit,
            submitUtenHenvendelse,
            innstillingerStatus,
            tilhorendeDialogId,
        } = this.props;

        return (
            <InnstillingerModal>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <div>
                        <section className="innstillinger__prosess">
                            <Systemtittel>
                                <FormattedMessage id="innstillinger.modal.stopp-eskalering.overskrift" />
                            </Systemtittel>
                            <br />
                            <Checkbox
                                key="sendBrukerHendvedelse"
                                label={
                                    <FormattedMessage id="innstillinger.modal.stop-eskalering.henvendelse.checkbox.tittel" />
                                }
                                onChange={this.toggleHenvedelseTekstFelt}
                            />
                            <HiddenIfDiv hidden={!this.state.checked}>
                                <FormattedMessage id="innstillinger.modal.stopp-eskalering.beskrivelse" />
                                <FormattedMessage id="innstillinger.modal.stopp-eskalering.automatisk-tekst">
                                    {defaultBegrunnelse =>
                                        <BegrunnelseForm
                                            labelId="innstillinger.modal.stopp-eskalering.begrunnelse"
                                            pakrevdFeilmelding={
                                                'stopp.eskalering.begrunnelse.for-kort'
                                            }
                                            defaultBegrunnelse={
                                                defaultBegrunnelse
                                            }
                                            formNavn={
                                                STOPP_ESKALERING_FORM_NAME
                                            }
                                            onSubmit={form =>
                                                handleSubmit(
                                                    form,
                                                    tilhorendeDialogId
                                                )}
                                        />}
                                </FormattedMessage>
                            </HiddenIfDiv>
                        </section>
                        <ModalFooter>
                            {this.state.checked
                                ? <RemoteSubmitKnapp
                                      formNavn={STOPP_ESKALERING_FORM_NAME}
                                      spinner={
                                          innstillingerStatus ===
                                              STATUS.PENDING ||
                                          innstillingerStatus ===
                                              STATUS.RELOADING
                                      }
                                      autoDisableVedSpinner
                                  >
                                      <FormattedMessage id="innstillinger.modal.stopp-eskalering.knapp.bekreft" />
                                  </RemoteSubmitKnapp>
                                : <Hovedknapp onClick={submitUtenHenvendelse}>
                                      <FormattedMessage id="innstillinger.modal.stopp-eskalering.knapp.bekreft" />
                                  </Hovedknapp>}
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
}

StoppEskalering.defaultProps = {
    tilhorendeDialogId: null,
};

StoppEskalering.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    handleSubmit: PT.func.isRequired,
    submitUtenHenvendelse: PT.func.isRequired,
    innstillingerStatus: AppPT.status.isRequired,
    tilhorendeDialogId: PT.number,
};

const mapStateToProps = state => {
    const innstillingerStatus = selectInnstillingerStatus(state);
    const oppfolgingStatus = selectOppfolgingStatus(state);
    const gjeldendeEskaleringsVarsel = selectGjeldendeEskaleringsVarsel(state);
    return {
        avhengigheter: [oppfolgingStatus, innstillingerStatus],
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
    submitUtenHenvendelse: () => dispatch(stoppEskaleringUtenHenvendelse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StoppEskalering);
