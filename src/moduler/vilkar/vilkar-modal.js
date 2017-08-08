import React from 'react';
import Modal from '../../felles-komponenter/modal/modal';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import OppfolgingStatus from '../oppfolging-status/oppfolging-status';

function VilkarModal(Component, options) {
    return () =>
        <Modal
            header={
                <ModalHeader
                    tilbakeTekstId={
                        options &&
                        options.visTilbakeKnapp &&
                        'vilkar.modal.tilbake'
                    }
                />
            }
            contentLabel="vilkar-modal"
        >
            <OppfolgingStatus visVilkar>
                <Component />
            </OppfolgingStatus>
        </Modal>;
}

export default VilkarModal;
