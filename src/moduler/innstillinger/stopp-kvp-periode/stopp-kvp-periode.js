import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { isDirty } from 'redux-form';
import { Systemtittel } from 'nav-frontend-typografi';
import BegrunnelseForm from '../begrunnelse-form';
import InnstillingerModal from '../innstillinger-modal';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import * as AppPT from '../../../proptypes';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../../ducks/utils';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import { hentOppfolging } from '../../oppfolging-status/oppfolging-reducer';
import { stoppKvpOppfolging, lagreBegrunnelse } from '../innstillinger-reducer';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';

const STOPP_KVP_FORM_NAVN = 'stopp-kvp-form';

function StoppKvpPeriode({
    handleSubmit,
    innstillingerStatus,
    history,
    intl,
    formIsDirty,
    lukkModal,
}) {
    const oppfolgingStatus =
        innstillingerStatus === STATUS.PENDING ||
        innstillingerStatus === STATUS.RELOADING;

    return (
        <InnstillingerModal
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });
                // eslint-disable-next-line no-alert
                if (!formIsDirty || window.confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
            visConfirmDialog={formIsDirty}
        >
            <Innholdslaster avhengigheter={[innstillingerStatus]}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.stopp-kvp.tittel" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <FormattedMessage id="innstillinger.modal.stopp-kvp.tekst" />
                        </div>
                        <BegrunnelseForm
                            labelId="innstillinger.modal.stopp-kvp.begrunnelse.tittel"
                            pakrevdFeilmelding="stop.kvp.begrunnelse.for-kort"
                            formNavn={STOPP_KVP_FORM_NAVN}
                            onSubmit={form => handleSubmit(form)}
                        />
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp
                            formNavn={STOPP_KVP_FORM_NAVN}
                            spinner={oppfolgingStatus}
                            disabled={oppfolgingStatus}
                        >
                            <FormattedMessage id="innstillinger.modal.kvp.bekreft.knapp" />
                        </RemoteSubmitKnapp>
                        <RemoteResetKnapp
                            formNavn={STOPP_KVP_FORM_NAVN}
                            onClick={() => history.push('/')}
                        >
                            <FormattedMessage id="innstillinger.modal.kvp.avbryt.knapp" />
                        </RemoteResetKnapp>
                    </ModalFooter>
                </div>
            </Innholdslaster>
        </InnstillingerModal>
    );
}

StoppKvpPeriode.propTypes = {
    handleSubmit: PT.func.isRequired,
    innstillingerStatus: AppPT.status.isRequired,
    history: AppPT.history.isRequired,
    intl: intlShape.isRequired,
    formIsDirty: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapStateToProps = state => ({
    innstillingerStatus: selectInnstillingerStatus(state),
    formIsDirty: isDirty(STOPP_KVP_FORM_NAVN)(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
    handleSubmit: form => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        dispatch(stoppKvpOppfolging(form.begrunnelse))
            .then(() => dispatch(hentOppfolging()))
            .then(() =>
                props.history.push('/innstillinger/stoppKvp/kvittering')
            )
            .catch(() => props.history.push('/innstillinger/feilkvittering'));
    },
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(StoppKvpPeriode)
);
