import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import history from '../../../history';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';
import {
    HiddenIfAlertStripeAdvarsel,
    HiddenIfAlertStripeSuksess,
} from '../../../felles-komponenter/hidden-if/hidden-if-alertstriper';

function SettDigitalOppfolgingKvittering({ motpart, innstillingerReducer }) {
    const { navn } = motpart.data;
    const { manuell } = innstillingerReducer.data;
    const { begrunnelse } = innstillingerReducer;
    return (
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <ModalHeader />
            <Innholdslaster avhengigheter={[motpart, innstillingerReducer]}>
                <article className="innstillinger__container">
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.digital.overskrift" />
                        </Systemtittel>
                    </div>
                    <HiddenIfAlertStripeSuksess
                        hidden={manuell}
                        className="blokk-m"
                    >
                        <FormattedMessage
                            id="innstillinger.modal.digital.kvittering.ok"
                            values={{ begrunnelse }}
                        >
                            {text =>
                                <span className="whitespace">
                                    {text}
                                </span>}
                        </FormattedMessage>
                    </HiddenIfAlertStripeSuksess>
                    <HiddenIfAlertStripeAdvarsel
                        hidden={!manuell}
                        className="blokk-m"
                    >
                        <FormattedMessage id="innstillinger.modal.digital.kvittering.feilet" />
                    </HiddenIfAlertStripeAdvarsel>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

SettDigitalOppfolgingKvittering.defaultProps = {
    motpart: undefined,
};

SettDigitalOppfolgingKvittering.propTypes = {
    motpart: AppPT.motpart,
    innstillingerReducer: AppPT.situasjon.isRequired,
};

const mapStateToProps = state => ({
    motpart: state.data.motpart,
    innstillingerReducer: state.data.innstillinger,
});

export default connect(mapStateToProps)(SettDigitalOppfolgingKvittering);
