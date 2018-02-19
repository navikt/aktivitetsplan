import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Systemtittel from 'nav-frontend-typografi/src/systemtittel';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import * as AppPt from '../../../proptypes';
import history from '../../../history';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import BegrunnelseForm from '../begrunnelse-form';
import {
    settDigitalOppfolging,
    lagreBegrunnelse,
} from '../innstillinger-reducer';
import InnstillingerModal from '../innstillinger-modal';
import { STATUS } from '../../../ducks/utils';
import { hentOppfolging } from '../../oppfolging-status/oppfolging-reducer';
import { selectIdentitetId } from '../../identitet/identitet-selector';
import { selectInnstillingerStatus } from '../innstillinger-selector';

const SETT_DIGITAL_FORM_NAME = 'sett-digital-form';

function SettDigitalOppfolging({
    veilederId,
    innstillingerStatus,
    handleSubmit,
}) {
    const oppfolgingStatus =
        innstillingerStatus === STATUS.PENDING ||
        innstillingerStatus === STATUS.RELOADING;
    return (
        <InnstillingerModal>
            <section className="innstillinger__prosess">
                <div className="blokk-xxs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.digital.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-xxs">
                    <FormattedMessage id="innstillinger.modal.digital.infotekst" />
                </AlertStripeInfoSolid>
                <BegrunnelseForm
                    labelId="innstillinger.modal.digital.begrunnelse"
                    pakrevdFeilmelding="sett-digital.begrunnelse.for-kort"
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    onSubmit={form => handleSubmit(form, veilederId)}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    spinner={oppfolgingStatus}
                    disabled={oppfolgingStatus}
                >
                    <FormattedMessage id="innstillinger.modal.digital.bekreft.knapp" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.digital.avbryt.knapp" />
                </RemoteResetKnapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}

SettDigitalOppfolging.defaultProps = {
    veilederId: undefined,
    innstillingerStatus: undefined,
};

SettDigitalOppfolging.propTypes = {
    veilederId: PT.string,
    handleSubmit: PT.func.isRequired,
    innstillingerStatus: AppPt.status,
};

const mapStateToProps = state => ({
    veilederId: selectIdentitetId(state),
    innstillingerStatus: selectInnstillingerStatus(state),
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: (form, veilederId) => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        dispatch(settDigitalOppfolging(form.begrunnelse, veilederId))
            .then(() => history.push('/innstillinger/digital/kvittering'))
            .then(() => dispatch(hentOppfolging()))
            .catch(() => history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    SettDigitalOppfolging
);
