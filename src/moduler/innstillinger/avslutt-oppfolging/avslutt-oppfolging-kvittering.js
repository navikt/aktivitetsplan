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

function AvsluttOppfolgingKvittering({ motpart, situasjon }) {
    const { navn } = motpart.data;
    const avsluttet =
        situasjon.data.avslutningStatus &&
        !situasjon.data.avslutningStatus.kanAvslutte;
    return (
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <ModalHeader />
            <Innholdslaster avhengigheter={[motpart]}>
                <article className="innstillinger__container">
                    <Innholdstittel>
                        <FormattedMessage
                            id="innstillinger.modal.overskrift"
                            values={{ navn }}
                        />
                    </Innholdstittel>
                    <div className="innstillinger__innhold blokk-xs">
                        <Systemtittel>
                            <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.overskrift" />
                        </Systemtittel>
                    </div>
                    <HiddenIfAlertStripeSuksess
                        hidden={!avsluttet}
                        className="blokk-m"
                    >
                        <FormattedMessage
                            id="innstillinger.modal.avslutt.oppfolging.kvittering"
                            values={{ navn }}
                        />
                    </HiddenIfAlertStripeSuksess>
                    <HiddenIfAlertStripeAdvarsel
                        hidden={avsluttet}
                        className="blokk-m"
                    >
                        <FormattedMessage id="innstillinger.modal.avslutt.oppfolging.kvittering.feil" />
                    </HiddenIfAlertStripeAdvarsel>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

AvsluttOppfolgingKvittering.defaultProps = {
    motpart: undefined,
    situasjon: undefined,
};

AvsluttOppfolgingKvittering.propTypes = {
    motpart: AppPT.motpart,
    situasjon: AppPT.situasjon,
};

const mapStateToProps = state => ({
    motpart: state.data.motpart,
    situasjon: state.data.innstillinger,
});

export default connect(mapStateToProps)(AvsluttOppfolgingKvittering);
