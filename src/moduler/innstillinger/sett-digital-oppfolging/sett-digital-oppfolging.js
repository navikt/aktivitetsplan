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
import { hentSituasjon } from '../../../ducks/situasjon';

const SETT_DIGITAL_FORM_NAME = 'sett-digital-form';

function SettDigitalOppfolging({
    veilederId,
    innstillingerReducer,
    handleSubmit,
}) {
    const situasjonLaster =
        innstillingerReducer.status === STATUS.PENDING ||
        innstillingerReducer.status === STATUS.RELOADING;
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
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    onSubmit={form => handleSubmit(form, veilederId)}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    mini
                    spinner={situasjonLaster}
                    disabled={situasjonLaster}
                >
                    <FormattedMessage id="innstillinger.modal.digital.bekreft.knapp" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    mini
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
    innstillingerReducer: undefined,
};

SettDigitalOppfolging.propTypes = {
    veilederId: PT.string,
    handleSubmit: PT.func.isRequired,
    innstillingerReducer: AppPt.situasjon,
};

const mapStateToProps = state => ({
    veilederId: state.data.identitet.data.id,
    innstillingerReducer: state.data.innstillinger,
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: (form, veilederId) => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        dispatch(settDigitalOppfolging(form.begrunnelse, veilederId))
            .then(() => history.push('/innstillinger/digital/kvittering'))
            .then(() => dispatch(hentSituasjon()))
            .catch(() => history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    SettDigitalOppfolging
);
