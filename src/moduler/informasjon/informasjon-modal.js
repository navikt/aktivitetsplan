import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { ONBOARDING_VIDEO_URL } from '../../environment';

function InformasjonModal() {
    return (
        <Modal
            header={<ModalHeader tilbakeTekstId="informasjon.tilbake.link" />}
            contentLabel="informasjon-modal"
            contentClass="informasjon-visnign"
        >
            <ModalContainer className="informasjon-modal-container">
                <Normaltekst>
                    <FormattedMessage id="informasjon.hjelpetekst" />
                </Normaltekst>
                <iframe
                    title="onboarding-video"
                    frameBorder="0"
                    scrolling="no"
                    src={ONBOARDING_VIDEO_URL}
                    className="video-player"
                />
            </ModalContainer>
        </Modal>
    );
}

InformasjonModal.propTypes = {};

export default InformasjonModal;
