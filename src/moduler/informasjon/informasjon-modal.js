import React from 'react';
import Modal from '../../felles-komponenter/modal/modal';
import InformasjonsContent from './informasjons-content';

export const INFORMASJON_MODAL_VERSJON = 'v1';

function InformasjonModal() {
    return (
        <Modal
            contentLabel="informasjon-modal"
            contentClass="informasjon-visning"
        >
            <InformasjonsContent />
        </Modal>
    );
}

export default InformasjonModal;
