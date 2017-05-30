import React from 'react';
import AktivitetsMal from './aktivitetsmal';
import Modal from '../../../modal/modal';
import ModalHeader from '../../../modal/modal-header';
import ModalContainer from '../../../modal/modal-container';
import history from '../../../history';
import Hovedside from '../hovedside';

function AktivitetsmalModal() {
    return (
        <div>
            <Hovedside />
            <Modal
                isOpen
                onRequestClose={() => history.push('/')}
                contentLabel="aktivitetsmal-modal"
            >
                <ModalHeader
                    normalTekstId="aktivitetsmal.mitt-mal"
                    className="aktivitetmal__modal"
                >
                    <ModalContainer>
                        <AktivitetsMal />
                    </ModalContainer>
                </ModalHeader>
            </Modal>
        </div>
    );
}

export default AktivitetsmalModal;
