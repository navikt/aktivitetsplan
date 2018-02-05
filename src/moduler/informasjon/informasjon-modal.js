import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from '../../felles-komponenter/modal/modal';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import { ONBOARDING_VIDEO_URL } from '../../environment';

function InformasjonModal() {
    return (
        <Modal
            contentLabel="informasjon-modal"
            contentClass="informasjon-visnign"
        >
            <ModalContainer className="informasjon-modal-container">
                <Innholdstittel>
                    <FormattedMessage id="informasjon.tittel" />
                </Innholdstittel>
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
                <Undertittel>
                    <FormattedMessage id="informasjon.videokontent.tittel" />
                </Undertittel>
                <Normaltekst>
                    <FormattedMessage id="informasjon.videokontent.text" />
                </Normaltekst>
            </ModalContainer>
        </Modal>
    );
}

InformasjonModal.propTypes = {};

export default InformasjonModal;
