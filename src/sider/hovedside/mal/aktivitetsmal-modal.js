import React from 'react';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';

function AktivitetsmalModal(Component) {
    return function inner() {
        return (
            <div>
                <Modal
                    header={
                        <ModalHeader
                            normalTekstId="aktivitetsmal.mitt-mal"
                            className="aktivitetmal__modal"
                        />
                    }
                    contentLabel="aktivitetsmal-modal"
                >
                    <ModalContainer>
                        <Component />
                    </ModalContainer>
                </Modal>
            </div>
        );
    };
}

export default AktivitetsmalModal;
