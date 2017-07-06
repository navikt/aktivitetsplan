import React from 'react';
import Modal from '../../modal/modal';
import history from '../../history';
import ModalHeader from '../../modal/modal-header';
import OppfolgingStatus from '../oppfolging-status/oppfolging-status';

function VilkarModal(Component, options) {
    return () =>
        <Modal
            isOpen
            onRequestClose={() => history.push('/')}
            contentLabel="vilkar-modal"
        >
            <ModalHeader
                tilbakeTekstId={
                    options && options.visTilbakeKnapp && 'vilkar.modal.tilbake'
                }
            >
                <OppfolgingStatus visVilkar>
                    <Component />
                </OppfolgingStatus>
            </ModalHeader>
        </Modal>;
}

export default VilkarModal;
