import React from 'react';
import Modal from '../modal';
import history from '../../history';
import ModalHeader from '../modal-header';
import Vilkar from './vilkar';


function VilkarModal() {
    return (
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="vilkar-modal"
        >
            <ModalHeader>
                <Vilkar visVilkar />
            </ModalHeader>
        </Modal>
    );
}

export default VilkarModal;
