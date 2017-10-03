import React from 'react';
import Modal from '../../felles-komponenter/modal/modal';
import history from '../../history';

function FeilKvittering() {
    return (
        <Modal
            onRequestClose={() => history.push('/')}
            contentLabel="instillinger-modal"
            contentClass="innstillinger"
        >
            <div />
        </Modal>
    );
}

export default FeilKvittering;
