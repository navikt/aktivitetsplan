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
import ModalFooter from '../../../modal/modal-footer';
import BegrunnelseForm from '../begrunnelse-form';
import {
    settManuellOppfolging,
    lagreBegrunnelse,
} from '../../../ducks/situasjon';
import InnstillingerModal from '../innstillinger-modal';
import { STATUS } from '../../../ducks/utils';

const SETT_MANUELL_FORM_NAME = 'sett-manuell-form';

function SettManuellOppfolging({ veilederId, situasjonReducer, handleSubmit }) {
    const situasjonLaster =
        situasjonReducer.status === STATUS.PENDING ||
        situasjonReducer.status === STATUS.RELOADING;
    return (
        <InnstillingerModal>
            <section className="innstillinger__prosess">
                <div className="blokk-xxs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.manuell.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-xxs">
                    <FormattedMessage id="innstillinger.modal.manuell.infotekst" />
                </AlertStripeInfoSolid>
                <BegrunnelseForm
                    labelId="innstillinger.modal.manuell.begrunnelse"
                    formNavn={SETT_MANUELL_FORM_NAME}
                    onSubmit={form => handleSubmit(form, veilederId)}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp
                    formNavn={SETT_MANUELL_FORM_NAME}
                    mini
                    spinner={situasjonLaster}
                    disabled={situasjonLaster}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.bekreft.knapp" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={SETT_MANUELL_FORM_NAME}
                    mini
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.avbryt.knapp" />
                </RemoteResetKnapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}

SettManuellOppfolging.defaultProps = {
    veilederId: undefined,
    situasjonReducer: undefined,
};

SettManuellOppfolging.propTypes = {
    veilederId: PT.string,
    handleSubmit: PT.func.isRequired,
    situasjonReducer: AppPt.situasjon,
};

const mapStateToProps = state => ({
    veilederId: state.data.identitet.data.id,
    situasjonReducer: state.data.situasjon,
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: (form, veilederId) => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        dispatch(settManuellOppfolging(form.begrunnelse, veilederId))
            .then(() => history.push('/innstillinger/manuell/kvittering'))
            .catch(() => history.push('/'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    SettManuellOppfolging
);
