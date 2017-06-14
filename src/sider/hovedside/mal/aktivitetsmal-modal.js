import React from 'react';
import Modal from '../../../modal/modal';
import ModalHeader from '../../../modal/modal-header';
import ModalContainer from '../../../modal/modal-container';
import history from '../../../history';

function AktivitetsmalModal(Component) {
    return function inner() {
        return (
            <div>
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
                            <Component />
                        </ModalContainer>
                    </ModalHeader>
                </Modal>
            </div>
        );
    };
}

export default AktivitetsmalModal;
