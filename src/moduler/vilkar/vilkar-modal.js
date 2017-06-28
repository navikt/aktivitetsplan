import React from 'react';
import Modal from '../../modal/modal';
import history from '../../history';
import ModalHeader from '../../modal/modal-header';
import OppfolgingStatus from './oppfolging-status';

function VilkarModal() {
    return (
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="vilkar-modal"
        >
            <ModalHeader>
                <OppfolgingStatus visVilkar />
            </ModalHeader>
        </Modal>
    );
}

export default VilkarModal;
