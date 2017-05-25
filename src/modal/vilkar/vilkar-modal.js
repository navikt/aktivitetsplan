import React from 'react';
import Modal from '../modal';
import history from '../../history';
import ModalHeader from '../modal-header';

function VilkarModal(Component) {
    return function inner() {
        return (
            <Modal
                isOpen
                onRequestClose={() => history.push('/')}
                contentLabel="vilkar-modal"
            >
                <ModalHeader tilbakeTekstId="vilkar.modal.tilbake">
                    <Component />
                </ModalHeader>
            </Modal>
        );
    };
}

export default VilkarModal;
