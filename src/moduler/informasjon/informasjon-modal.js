import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../felles-komponenter/modal/modal-container';
import UnsafeHtml from '../../felles-komponenter/utils/unsafe-html';

function InformasjonModal(props) {
    return (
        <Modal
            header={<ModalHeader tilbakeTekstId="informasjon.tilbake.link" />}
            contentLabel="informasjon-modal"
            contentClass="informasjon-visnign"
        >
            <ModalContainer>
                <UnsafeHtml>
                    {props.intl.formatMessage({
                        id: 'informasjon.innhold',
                    })}
                </UnsafeHtml>
            </ModalContainer>
        </Modal>
    );
}

InformasjonModal.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(InformasjonModal);
