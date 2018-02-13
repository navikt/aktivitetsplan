import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Systemtittel from 'nav-frontend-typografi/src/systemtittel';
import BegrunnelseForm from '../begrunnelse-form';
import InnstillingerModal from '../innstillinger-modal';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import history from '../../../history';
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

const STOPP_KVP_FORM_NAVN = 'stopp-kvp-form';

function StoppKvpPeriode({ handleSubmit, innstillingerStatus }) {
    const oppfolgingStatus =
        innstillingerStatus === STATUS.PENDING ||
        innstillingerStatus === STATUS.RELOADING;

    return (
        <InnstillingerModal>
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
};

const mapStateToProps = state => ({
    innstillingerStatus: selectInnstillingerStatus(state),
});

const mapDispatchToProps = dispatch => ({
    handleSubmit: form => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        dispatch(stoppKvpOppfolging(form.begrunnelse))
            .then(() => dispatch(hentOppfolging()))
            .then(() => history.push('/innstillinger/stoppKvp/kvittering'))
            .catch(() => history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StoppKvpPeriode);
