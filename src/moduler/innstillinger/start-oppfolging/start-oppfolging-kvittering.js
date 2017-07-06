import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import Modal from '../../../modal/modal';
import ModalHeader from '../../../modal/modal-header';
import history from '../../../history';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import * as AppPT from '../../../proptypes';

function StartOppfolgingKvittering({ motpart }) {
    const { navn } = motpart.data;
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
                            <FormattedMessage id="innstillinger.modal.startoppfolging.overskrift" />
                        </Systemtittel>
                    </div>
                    <AlertStripeSuksess className="blokk-m">
                        <FormattedMessage
                            id="innstillinger.modal.startoppfolging.kvittering"
                            values={{ navn }}
                        />
                    </AlertStripeSuksess>
                </article>
            </Innholdslaster>
        </Modal>
    );
}

StartOppfolgingKvittering.defaultProps = {
    motpart: undefined,
};

StartOppfolgingKvittering.propTypes = {
    motpart: AppPT.motpart,
};

const mapStateToProps = state => ({
    motpart: state.data.motpart,
});

export default connect(mapStateToProps)(StartOppfolgingKvittering);
