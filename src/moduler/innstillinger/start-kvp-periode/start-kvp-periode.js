import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Systemtittel from 'nav-frontend-typografi/src/systemtittel';
import BegrunnelseForm from '../begrunnelse-form';
import InnstillingerModal from '../innstillinger-modal';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import { startKvpOppfolging, lagreBegrunnelse } from '../innstillinger-reducer';
import * as AppPT from '../../../proptypes';
import { STATUS } from '../../../ducks/utils';
import { hentOppfolging } from '../../oppfolging-status/oppfolging-reducer';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';

const START_KVP_FORM_NAVN = 'start-kvp-form';

function StartKvpPeriode({ handleSubmit, innstillingerStatus, history }) {
    const oppfolgingStatus =
        innstillingerStatus === STATUS.PENDING ||
        innstillingerStatus === STATUS.RELOADING;

    return (
        <InnstillingerModal>
            <Innholdslaster avhengigheter={[innstillingerStatus]}>
                <div>
                    <section className="innstillinger__prosess">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.start-kvp.tittel" />
                        </Systemtittel>
                        <div className="blokk-xxs">
                            <FormattedMessage id="innstillinger.modal.start-kvp.infotekst" />
                        </div>
                        <BegrunnelseForm
                            labelId="innstillinger.modal.start-kvp.begrunnelse.tittel"
                            pakrevdFeilmelding="start.kvp.begrunnelse.for-kort"
                            formNavn={START_KVP_FORM_NAVN}
                            onSubmit={form => handleSubmit(form)}
                        />
                    </section>
                    <ModalFooter>
                        <RemoteSubmitKnapp
                            formNavn={START_KVP_FORM_NAVN}
                            spinner={oppfolgingStatus}
                            disabled={oppfolgingStatus}
                        >
                            <FormattedMessage id="innstillinger.modal.kvp.bekreft.knapp" />
                        </RemoteSubmitKnapp>
                        <RemoteResetKnapp
                            formNavn={START_KVP_FORM_NAVN}
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

StartKvpPeriode.propTypes = {
    handleSubmit: PT.func.isRequired,
    innstillingerStatus: AppPT.status.isRequired,
    history: AppPT.history.isRequired,
};

const mapStateToProps = state => ({
    innstillingerStatus: selectInnstillingerStatus(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    handleSubmit: form => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        dispatch(startKvpOppfolging(form.begrunnelse))
            .then(() => dispatch(hentOppfolging()))
            .then(() =>
                props.history.push('/innstillinger/startKvp/kvittering')
            )
            .catch(() => props.history.push('/innstillinger/feilkvittering'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StartKvpPeriode);
